import { AppDataSource } from "@/data-source";
import { UserRegisterDTO } from "@/DTOs/UserRegisterDTO";
import { User } from "@/entity/User";
import { EmailService } from "./EmailService";
import bcrypt from "bcryptjs";
import { generalconfig } from "@/config/general";
import { EmailVerification } from "@/entity/EmailVerification";
import crypto from "crypto";
import { UserLoginDTO } from "@/DTOs/UserLoginDTO";
import { jwtconfig } from "@/config/jwt";
import jwt, { SignOptions } from "jsonwebtoken";
import { ServiceResult } from "@/ServiceResult";
import { plainToInstance } from "class-transformer";
import { UserProfileDTO } from "@/DTOs/UserProfileDTO";
import { EntityManager, FindOptionsWhere } from "typeorm";
import { BaseService } from "./BaseService";
import { UserRepository } from "@/repositories/UserRepository";
import { BadRequestException } from "@/exceptions/BadRequestException";
import { UnauthorizedException } from "@/exceptions/UnauthorizedException";
import { ForbiddenException } from "@/exceptions/ForbiddenException";
import { ServiceUnavailableException } from "@/exceptions/ServiceUnavailableException";
import { NotFoundException } from "@/exceptions/NotFoundException";

export class UserService extends BaseService<User> {

  public repo: UserRepository;
  public manager: EntityManager;
    
  constructor(manager?: EntityManager) {
    super(new UserRepository(manager));
  }

  async register(data: UserRegisterDTO): Promise<UserProfileDTO> {

    const isExisted = await this.repo.exists({
      name: data.name,
      email: data.email,
    });
    
    if (isExisted) {
      throw new BadRequestException('User already exists');
    }

    // Verify SMTP connection
    const isEmailServiceWorking = await EmailService.verifyConnection();
    if (!isEmailServiceWorking) {
      throw new ServiceUnavailableException('Email service is not available. Please try again later.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {

      // Hash password and save user
      data.password = await bcrypt.hash(data.password, generalconfig.saltRounds);
      const user = await this.repo.store(data);

      // Save verification record in email_verifications table
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = new Date(Date.now() + 3600000);

      const emailVerificationRepository = AppDataSource.getRepository(EmailVerification);
      const emailVerification = emailVerificationRepository.create({
        email: data.email, 
        token: verificationToken,
        expired_at: tokenExpiration,
      });
      await emailVerificationRepository.save(emailVerification);

      // Send an email for verification
      await EmailService.sendVerificationEmail(user.email, user.name, verificationToken);
      
      await queryRunner.commitTransaction();

      return plainToInstance(UserProfileDTO, user, { excludeExtraneousValues: true });

    } catch (exception) {

      console.log('User Service - Registration: ', exception);
      await queryRunner.rollbackTransaction();
      throw exception;

    } finally {
      await queryRunner.release()
    }
  }

  async login(data: UserLoginDTO): Promise<any> {

    try {
  
      const user = await this.repo.findOneBy({ email: data.email });
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.is_verified) {
        throw new ForbiddenException('Please verify your account first.');
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.id } as object,
        jwtconfig.secret,
        {
          expiresIn: jwtconfig.expiresIn,
          algorithm: 'HS256'
        } as SignOptions
      );
      
      return {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      };
  
    } catch (exception) {

      console.error("User Service Login Exception:", exception);
      throw exception;
    }
  }

  async verify(token: string): Promise<boolean> {
    
    try {
    
      const verificationRepository = AppDataSource.getRepository(EmailVerification);

      const verification = await verificationRepository
                                .createQueryBuilder('verification')
                                .innerJoinAndMapOne(
                                  'verification.user',
                                  User,
                                  'user',
                                  'user.email = verification.email'
                                )
                                .where('verification.token = :token', { token })
                                .getOne() as (EmailVerification & { user: User });

      if (!verification || !verification.user) {
        throw new BadRequestException('Invalid or expired verification token.');
      }
    
      if (verification.expired_at < new Date()) {
        throw new BadRequestException('Verification token has been already expired.');
      }
    
      await AppDataSource.transaction(async (manager) => {
        verification.is_verified = true;
        verification.user.is_verified = true;
        verification.user.verified_at = new Date();
    
        await manager.save(verification);
        await manager.save(verification.user);
      });
      
      return true;

    } catch (exception) {

      console.log('User Service Verify Data Access Exception: ', exception);
      throw exception;
    }
  }  

  async forgotPassword(email: string): Promise<boolean> {

    try {

      // Find user by email
      const user = await this.repo.findOneBy({ email: email });

      if (!user) {
        throw new NotFoundException('No account found with that email!');
      }

      // Verify SMTP connection
      const isEmailServiceWorking = await EmailService.verifyConnection();
      if (!isEmailServiceWorking) {
        throw new BadRequestException('Email service is not available. Please try again later.');
      }

      // Save verification record in email_verifications table
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = new Date(Date.now() + 3600000);

      const emailVerificationRepository = AppDataSource.getRepository(EmailVerification);
      const emailVerification = emailVerificationRepository.create({
        email: email, 
        token: resetToken,
        expired_at: tokenExpiration,
      });
      await emailVerificationRepository.save(emailVerification);

      // Send an email for password reset
      await EmailService.sendPasswordResetEmail(user.email, user.name, resetToken);

      return true;

    } catch (exception) {

      console.log('User Service - Forgot Password: ', exception);
      throw exception;
    }
  }

  async checkResetTokenValidity(token: string): Promise<User & any> {

    try {

      const result = await AppDataSource
                          .getRepository(User)
                          .createQueryBuilder('user')
                          .innerJoin(
                            EmailVerification,
                            'verification',
                            'verification.email = user.email AND verification.token = :token',
                            { token }
                          )
                          .select([
                            'user.id',
                            'user.name',
                            'user.email',
                            'user.is_verified',
                            'verification.expired_at'
                          ])
                          .getRawAndEntities();

      const user = result.entities[0];
      const expiredAt = result.raw[0]['verification_expired_at'];
      
      if (!user) {
        throw new BadRequestException('The token is invalid.');
      }
      
      if (expiredAt < new Date()) {
        throw new BadRequestException('The token has been already expired.');
      }

      return {
        user: user, 
        expired_at: expiredAt
      };
      
    } catch (exception) {

      console.log('User Service - Check Token Validity: ', exception);
      throw exception;
    }
  }

  async resetPassword(token: string, password: string): Promise<boolean> {

    try {

      const result = await this.checkResetTokenValidity(token);
      const user = result.data.user;
  
      // Hash password and save user
      user.password = await bcrypt.hash(password, generalconfig.saltRounds);
      await this.repo.update(user.id, user);
      
      return true;

    } catch (exception) {

      console.log('User Service - Reset Password: ', exception);
      throw exception;
    }
  }

  async getProfileInfo(userId: number): Promise<UserProfileDTO> {

    try {
      
      const user = await this.repo.findOneBy({ id: userId });
      return plainToInstance(UserProfileDTO, user, { excludeExtraneousValues: true });

    } catch (exception) {

      console.log('User Service - Get Profile Info ', exception);
      throw exception;
    }
  }

  async exists(fields: FindOptionsWhere<User>): Promise<boolean> {
    return await this.repo.exists(fields);
  }
}
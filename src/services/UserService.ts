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

export class UserService {

  private static repo = AppDataSource.getRepository(User);

  static async register(data: UserRegisterDTO) {

    const isExisted = await this.repo.exists({
      where: {
        name: data.name,
        email: data.email,
      }
    });
    
    if (isExisted) {
      return ServiceResult.error('The user is already existed!', 400);
    }

    // Verify SMTP connection
    const isEmailServiceWorking = await EmailService.verifyConnection();
    if (!isEmailServiceWorking) {
      return ServiceResult.error('Email service is not available. Please try again later.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {

      // Hash password and save user
      data.password = await bcrypt.hash(data.password, generalconfig.saltRounds);
      const userRepository = this.repo;
      const user = this.repo.create(data);
      await userRepository.save(user);

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

      return ServiceResult.success('You were successfully registered.', 201);

    } catch (error) {

      console.log('User Service - Registration: ', error);
      await queryRunner.rollbackTransaction();

      return ServiceResult.error('Something went wrong. Please try again later!');

    } finally {
      await queryRunner.release()
    }
  }

  static async login(data: UserLoginDTO) {

    try {
  
      const user = await this.repo.findOne({
        where: { email: data.email }
      });
  
      if (!user) {
        return ServiceResult.error('Invalid credentials!', 401);
      }
  
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return ServiceResult.error('Invalid credentials!', 401);
      }

      if (!user.is_verified) {
        return ServiceResult.error('Please verify your account first.', 401);
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
      
      return ServiceResult.success(
        'You have successfully logged in.', 
        200, 
        {
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }
      );
  
    } catch (error) {

      console.error("User Service Login Exception:", error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async verify(token: string) {
    
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
        return ServiceResult.error('Invalid or expired verification token.', 400);
      }
    
      if (verification.expired_at < new Date()) {
        return ServiceResult.error('Verification token has been already expired.', 400);
      }
    
      await AppDataSource.transaction(async (manager) => {
        verification.is_verified = true;
        verification.user.is_verified = true;
        verification.user.verified_at = new Date();
    
        await manager.save(verification);
        await manager.save(verification.user);
      });
      
      return ServiceResult.success('You have successfully verified.');

    } catch (error) {

      console.log('User Service Verify Data Access Exception: ', error);
      return ServiceResult.error('Something went wrong. Please try again later!');
    }
  }  

  static async forgotPassword(email: string) {
    
    const userRepository = this.repo;

    // Find user by email
    const user = await userRepository.findOne({
      where: { email: email }
    });

    if (!user) {
      return ServiceResult.error('No account found with that email!', 404);
    }

    // Verify SMTP connection
    const isEmailServiceWorking = await EmailService.verifyConnection();
    if (!isEmailServiceWorking) {
      return ServiceResult.error('Email service is not available. Please try again later.');
    }

    try {

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

      return ServiceResult.success('An email of password reset has been sent to you.');

    } catch (error) {

      console.log('User Service - Forgot Password: ', error);
      return ServiceResult.error('Something went wrong. Please try again later!');
    }
  }

  static async checkResetTokenValidity(token: string) {

    const userRepository = this.repo;

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
      return ServiceResult.error('The token is invalid.', 400);
    }
    
    if (expiredAt < new Date()) {
      return ServiceResult.error('The token has been already expired.', 400);
    }

    return ServiceResult.success('The token is still valid.', 200, {
      user: user, 
      expired_at: expiredAt
    });
  }

  static async resetPassword(token: string, password: string): Promise<ServiceResult> {

    const userRepository = this.repo;

    const result = await this.checkResetTokenValidity(token);
    
    if (!result.success) {
      return ServiceResult.error(result.message, result.code);
    }
    
    const user = result.data.user;

    try {
  
      // Hash password and save user
      user.password = await bcrypt.hash(password, generalconfig.saltRounds);
      await userRepository.save(user);
      
      return ServiceResult.success('You have reset your password successfully.');

    } catch (error) {

      console.log('User Service - Reset Password: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async getProfileInfo(userId?: number): Promise<ServiceResult> {

    const repo = this.repo;
    const user = await repo.findOne({
      where: {
        id: userId
      }
    });

    return ServiceResult.success(
      'User Profile Info', 
      200, 
      plainToInstance(UserProfileDTO, user, { excludeExtraneousValues: true })
    );
  }
}
import { Request, Response } from "express";
import { UserRegisterDTO } from "@/DTOs/UserRegisterDTO";
import { UserService } from "@/services/UserService";
import { UserLoginDTO } from "@/DTOs/UserLoginDTO";
import { BlacklistedToken } from "@/entity/BlacklistedToken";
import { AppDataSource } from "@/data-source";
import { AuthRequest } from "@/middlewares/validateToken";
import { BaseController } from "./BaseController";
import { UserProfileDTO } from "@/DTOs/UserProfileDTO";
import { ServiceResult } from "@/ServiceResult";
import { Verify } from "crypto";
import { User } from "@/entity/User";
import { Timestamp } from "typeorm";

export class UserController extends BaseController<UserRegisterDTO, UserProfileDTO> {

  constructor() {
    super(new UserService());
  }

  async signup(request: Request, response: Response): Promise<void> {

    const data: UserRegisterDTO = request.body;
    const result: UserProfileDTO = await this.service.register(data);

    this.respond(response, ServiceResult.success('You were successfully registered.', 201, result));
  }

  async login(request: Request, response: Response): Promise<void> {

    type LoginResult = {
      token: string,
      user: Partial<User>
    };

    const data: UserLoginDTO = request.body;
    const result: LoginResult = await this.service.login(data);

    this.respond(response, ServiceResult.success('You are successfully logged in.', 200, result));
  }

  async verify(request: Request, response: Response): Promise<void> {
    
    const { token } = request.params;
    await this.service.verify(token);

    response.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HRMS</title>
        </head>
        <body>
          <h1>Verification was successful. Please go to login.</h1>
        </body>
      </html>
    `);
  }
  
  async forgotPassword(request: Request, response: Response): Promise<void> {

    const { email } = request.body;
    const result: boolean = await this.service.forgotPassword(email);

    this.respond(response, ServiceResult.success('An email of password reset has been sent to you.'));
  }

  async showResetForm(request: Request, response: Response): Promise<void> {

    type TokenValidationResult = {
      user: Partial<User>, 
      expired_at: Timestamp
    };

    const { token } = request.params;
    const result: TokenValidationResult = await this.service.checkResetTokenValidity(token);

    response.send(`
      <form action="/reset-password/${token}" method="POST">
        <label>New Password:</label>
        <input type="password" name="password" required />
        <br />
        <label>Confirm Password:</label>
        <input type="password" name="confirmed_password" required />
        <br />
        <button type="submit">Reset Password</button>
      </form>
    `);
  }
  
  // Reset password
  async resetPassword(request: Request, response: Response): Promise<void> {

    const { token } = request.params;
    const { password } = request.body;

    const result: boolean = await this.service.resetPassword(token, password);

    response.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HRMS</title>
        </head>
        <body>
          <h1>You have reset your password successfully.</h1>
        </body>
      </html>
    `);
  }

  async logOut(request: Request, response: Response): Promise<void> {

    const token = request.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      response.status(400).json({
        success: false,
        message: 'No token provided!',
        data: null,
      });
    }

    const repo = AppDataSource.getRepository(BlacklistedToken);

    try {

      const tokenObj = repo.create({token: token});
      await repo.save(tokenObj);

      response.status(200).json({
        success: true,
        message: 'You have successfully logged out!',
        data: null,
      });

    } catch (exception) {

      console.error('Error blacklisting token:', exception);
      response.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later!',
        data: null,
      });
    }
  }

  async profile(request: AuthRequest, response: Response): Promise<void> {

    const userId = request.user_id;
    const result: UserProfileDTO = await this.service.getProfileInfo(request.user_id);

    this.respond(response, ServiceResult.success('User Profile', 200, result));
  }
}
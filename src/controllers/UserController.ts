import { Request, Response } from "express";
import { UserRepository } from "@/repositories/UserRepository";
import { UserRegisterDTO } from "@/DTOs/UserRegisterDTO";
import { UserService } from "@/services/UserService";
import { UserLoginDTO } from "@/DTOs/UserLoginDTO";
import { BlacklistedToken } from "@/entity/BlacklistedToken";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { AuthRequest } from "@/middlewares/validateToken";

export class UserController {

  private repository: UserRepository;

  constructor() {}

  async signup(request: Request, response: Response): Promise<void> {

    const data: UserRegisterDTO = request.body;
    const result = await UserService.register(data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async login(request: Request, response: Response): Promise<void> {

    const data: UserLoginDTO = request.body;
    const result = await UserService.login(data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  // Email verification
  async verify(request: Request, response: Response): Promise<void> {

    const { token } = request.params;
    const result = await UserService.verify(token);

    if (result.success) {

      response.status(result.code).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HRMS</title>
          </head>
          <body>
            <h1>${result.message} Please go to login.</h1>
          </body>
        </html>
      `);

    } else {
      
      response.status(result.code).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HRMS</title>
          </head>
          <body>
            <h1>${result.message}</h1>
          </body>
        </html>
      `);
    }
  }
  
  // Forgot password
  async forgotPassword(request: Request, response: Response): Promise<void> {
    const { email } = request.body;
    const result = await UserService.forgotPassword(email);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  // Show password reset form
  async showResetForm(request: Request, response: Response): Promise<void> {

    const { token } = request.params;

    const result = await UserService.checkResetTokenValidity(token);

    if (result.success) {

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

    } else {

      response.status(result.code).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HRMS</title>
          </head>
          <body>
            <h1>${result.message}</h1>
          </body>
        </html>
      `);
    }
  }
  
  // Reset password
  async resetPassword(request: Request, response: Response): Promise<void> {

    const { token } = request.params;
    const { password } = request.body;

    const result = await UserService.resetPassword(token, password);

    if (result.success) {

      response.status(result.code).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HRMS</title>
          </head>
          <body>
            <h1>${result.message}</h1>
          </body>
        </html>
      `);

    } else {

      response.status(result.code).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HRMS</title>
          </head>
          <body>
            <h1>${result.message}</h1>
          </body>
        </html>
      `);
    }
  }

  // Log Out
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

    } catch (error) {

      console.error('Error blacklisting token:', error);

      response.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later!',
        data: null,
      });
    }
  }

  async profile(request: AuthRequest, response: Response): Promise<void> {

    const userId = request.user_id;
    const result = await UserService.getProfileInfo(request.user_id);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}
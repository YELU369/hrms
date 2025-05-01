import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

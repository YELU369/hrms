import { IsEmail, Length } from 'class-validator';

export class UserLoginDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  password: string;
}

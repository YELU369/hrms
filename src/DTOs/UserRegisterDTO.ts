import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @IsNotEmpty()
  name : string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  @IsNotEmpty()
  password: string;
}

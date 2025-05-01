import { Match } from '@/validators/Match';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserRegisterDTO {

  @Expose()
  @IsString()
  @IsNotEmpty()
  name : string;

  @Expose()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @Expose()
  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  @Match('password', { message: 'Confirm password must match password.' })
  confirmed_password: string;
}

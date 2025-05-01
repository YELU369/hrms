import { Match } from '@/validators/Match';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordResetDTO {

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be 6-20 characters' })
  @Match('password', { message: 'Confirm password must match password.' })
  confirmed_password: string;
}

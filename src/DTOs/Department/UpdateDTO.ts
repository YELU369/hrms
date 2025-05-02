import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateDTO {

  id!: number;
  
  @IsString()
  @IsNotEmpty()
  name : string;

  @IsString()
  description : string;
}
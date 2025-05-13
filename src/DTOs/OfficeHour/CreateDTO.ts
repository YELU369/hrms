import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDTO {

  @IsString()
  @IsNotEmpty()
  work_from: string;

  @IsString()
  @IsNotEmpty()
  work_to: string;
}
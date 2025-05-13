import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDTO {

  id!: number;

  @IsString()
  @IsNotEmpty()
  work_from: string;

  @IsString()
  @IsNotEmpty()
  work_to: string;
}
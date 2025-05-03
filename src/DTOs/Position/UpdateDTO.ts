import { Department } from '@/entity/Department';
import { Position } from '@/entity/Position';
import { ExistsValidator } from '@/validators/ExistsValidator';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Validate } from 'class-validator';

export class UpdateDTO {

  id!: number;
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  is_manager: boolean;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Department, 'id'])
  department_id: number;
}
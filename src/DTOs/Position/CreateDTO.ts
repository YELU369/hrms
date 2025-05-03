import { Position } from '@/entity/Position';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { ExistsValidator } from '@/validators/ExistsValidator';
import { Department } from '@/entity/Department';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';

export class CreateDTO {

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [Position, 'title'])
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

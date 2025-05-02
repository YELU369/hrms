import { Department } from '@/entity/Department';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsNotEmpty, IsString, Validate,  } from 'class-validator';

export class CreateDTO {

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [Department, 'name'])
  name : string;

  @IsString()
  description : string;
}
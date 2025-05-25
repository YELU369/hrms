import { DepartmentManager } from '@/entity/DepartmentManager';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsDate, IsInt, IsNotEmpty, Validate,  } from 'class-validator';

export class UpdateDTO {
  id!: number;

  @IsNotEmpty()
  @IsDate()
  date_from: Date;

  @IsInt()
  @IsNotEmpty()
  department_id: number; 

  @IsInt()
  @IsNotEmpty()
  employee_id: number;
}
import { DepartmentManager } from '@/entity/DepartmentManager';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsDate, IsInt, IsNotEmpty, Validate,  } from 'class-validator';

export class CreateDTO {

  @IsNotEmpty()
  @IsDate()
  date_from: Date;

  @IsInt()
  @IsNotEmpty()
  @Validate(UniqueValidator, [DepartmentManager, 'department_id', 'date_from'])
  department_id: number; 

  @IsInt()
  @IsNotEmpty()
  @Validate(UniqueValidator, [DepartmentManager, 'employee_id', 'date_from'])
  employee_id: number;
}
import { ExistsValidator } from '@/validators/ExistsValidator';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType } from '@/entity/LeaveType';
import { Employee } from '@/entity/Employee';

export class CreateDTO {

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [LeaveType, 'id'])
  leave_type_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Employee, 'id'])
  employee_id!: number;

  @Type(() => Date)
  @IsNotEmpty()
  start_from!: Date;

  @Type(() => Date)
  @IsNotEmpty()
  end_to!: Date;

  @IsNumber()
  @IsNotEmpty()
  total_days!: number;

  used_days?: number;
}

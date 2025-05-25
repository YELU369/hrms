import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, Validate } from 'class-validator';
import { LeaveType } from '@/entity/LeaveType';

export class CreateDTO {
  
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [LeaveType, 'name'])
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  is_paid: boolean;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total_days: number;
}

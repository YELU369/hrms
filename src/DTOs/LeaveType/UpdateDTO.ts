import { UniqueValidator } from '@/validators/UniqueValidator';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, Validate } from 'class-validator';
import { LeaveType } from '@/entity/LeaveType';

export class UpdateDTO {

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
  max_days_per_year: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  carry_over_days: number;
}
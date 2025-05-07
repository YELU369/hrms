import { Position } from '@/entity/Position';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { ExistsValidator } from '@/validators/ExistsValidator';
import { IsDate, IsNotEmpty, IsNumber, IsPositive, Validate } from 'class-validator';
import { PositionSalary } from '@/entity/PositionSalary';
import { Type } from 'class-transformer';

export class UpdateDTO {

  id!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Validate(UniqueValidator, [PositionSalary, 'min_salary'])
  min_salary: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Validate(UniqueValidator, [PositionSalary, 'max_salary'])
  max_salary: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_from: Date;

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Position, 'id'])
  position_id: number;
}

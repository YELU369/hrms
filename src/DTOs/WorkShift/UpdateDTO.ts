import { ExistsValidator } from '@/validators/ExistsValidator';
import { IsArray, IsNotEmpty, IsNumber, Validate, ValidateNested } from 'class-validator';
import { UpdateDTO as WorkShiftDetailUpdateDTO } from './Detail/UpdateDTO';
import { WorkSchedule } from '@/entity/WorkSchedule';
import { Type } from 'class-transformer';

export class UpdateDTO {

  id!: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [WorkSchedule, 'id'])
  work_schedule_id: number;

  @Type(() => Date)
  @IsNotEmpty()
  start_from!: Date;

  @Type(() => Date)
  end_to?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftDetailUpdateDTO)
  details!: WorkShiftDetailUpdateDTO[];
}

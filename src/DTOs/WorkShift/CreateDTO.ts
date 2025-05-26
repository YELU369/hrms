import { ExistsValidator } from '@/validators/ExistsValidator';
import { IsArray, IsNotEmpty, IsNumber, Validate, ValidateNested } from 'class-validator';
import { CreateDTO as WorkShiftDetailCreateDTO } from './Detail/CreateDTO';
import { WorkSchedule } from '@/entity/WorkSchedule';
import { Type } from 'class-transformer';

export class CreateDTO {

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
  @Type(() => WorkShiftDetailCreateDTO)
  details!: WorkShiftDetailCreateDTO[];
}

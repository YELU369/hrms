import { IsArray, IsNotEmpty, IsString, Validate, ValidateNested } from 'class-validator';
import { CreateDTO as WorkScheduleDetailCreateDTO } from "@/DTOs/WorkSchedule/Detail/CreateDTO";
import { Type } from 'class-transformer';
import { WorkSchedule } from '@/entity/WorkSchedule';
import { UniqueValidator } from '@/validators/UniqueValidator';

export class CreateDTO {

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [WorkSchedule, 'title'])
  title!: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDetailCreateDTO)
  days!: WorkScheduleDetailCreateDTO[];
}

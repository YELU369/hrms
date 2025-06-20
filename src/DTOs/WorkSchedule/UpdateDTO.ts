import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDTO as WorkScheduleDetailUpdateDTO } from "@/DTOs/WorkSchedule/Detail/UpdateDTO";

export class UpdateDTO {

  id!: number;
  
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDetailUpdateDTO)
  days!: WorkScheduleDetailUpdateDTO[];
}

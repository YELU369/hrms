import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { Holiday } from '@/entity/Holiday';

export class UpdateDTO {

  id!: number;
  
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Type(() => Date)
  @IsNotEmpty()
  start_from!: Date;

  @Type(() => Date)
  end_to?: Date;

  @IsString()
  description: string;
}

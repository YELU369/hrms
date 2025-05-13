import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDTO {

  id!: number;
  
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Type(() => Date)
  @IsNotEmpty()
  start_from!: Date;

  @Type(() => Date)
  end_to: Date;

  @IsString()
  description: string;
}
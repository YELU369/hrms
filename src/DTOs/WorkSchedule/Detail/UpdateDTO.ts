import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDTO {

  id!: number;
  
  @IsIn([1, 2, 3, 4, 5, 6, 7])
  day_number!: number;

  @IsBoolean()
  is_off!: boolean;

  @IsString()
  work_from!: string;

  @IsString()
  work_to!: string;
}

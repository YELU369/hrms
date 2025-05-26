import { IsBoolean, IsIn, IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';

export class CreateDTO {

  @IsIn([1, 2, 3, 4, 5, 6, 7])
  day_number!: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  @IsBoolean()
  is_off!: boolean;

  @ValidateIf(o => !o.is_off)
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'work_from must be in HH:mm format' })
  work_from!: string;

  @ValidateIf(o => !o.is_off)
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'work_to must be in HH:mm format' })
  work_to!: string;
}

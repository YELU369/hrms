import { Position } from '@/entity/Position';
import { UniqueValidator } from '@/validators/UniqueValidator';
import { ExistsValidator } from '@/validators/ExistsValidator';
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, Validate } from 'class-validator';
import { Employee } from '@/entity/Employee';
import { Type } from 'class-transformer';

export class UpdateDTO {

  id!: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @Validate(UniqueValidator, [Employee, 'code'])
  code: string;

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [Employee, 'nrc'])
  nrc: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Validate(UniqueValidator, [Employee, 'email'])
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(UniqueValidator, [Employee, 'phone'])
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Position, 'id'])
  position_id: number;

  @Type(() => Date)
  @IsNotEmpty()
  joined_date: Date;

  employment_type: 'Full-time' | 'Part-time' | 'Contract';

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  salary: number;
}

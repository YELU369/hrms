import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Timestamp } from 'typeorm';

export class ListDTO {

  @Expose()
  name : string;

  @Expose()
  description : string;

  @Expose()
  updated_at: Timestamp;
}
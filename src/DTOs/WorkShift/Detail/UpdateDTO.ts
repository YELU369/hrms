import { Employee } from "@/entity/Employee";
import { WorkShift } from "@/entity/WorkShift";
import { ExistsValidator } from "@/validators/ExistsValidator";
import { IsNumber, IsNotEmpty, Validate } from "class-validator";

export class UpdateDTO {

  id!: number;

  @IsNumber()
  @Validate(ExistsValidator, [WorkShift, 'id'])
  work_shift_id?: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Employee, 'id'])
  employee_id: number;
}
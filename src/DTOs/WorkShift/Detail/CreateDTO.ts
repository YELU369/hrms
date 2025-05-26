import { Employee } from "@/entity/Employee";
import { ExistsValidator } from "@/validators/ExistsValidator";
import { IsNumber, IsNotEmpty, Validate } from "class-validator";

export class CreateDTO {

  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistsValidator, [Employee, 'id'])
  employee_id: number;
}
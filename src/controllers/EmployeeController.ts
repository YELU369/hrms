import { CreateDTO as EmployeeCreateDTO } from "@/DTOs/Employee/CreateDTO";
import { UpdateDTO as EmployeeUpdateDTO } from "@/DTOs/Employee/UpdateDTO";
import { EmployeeService } from "@/services/EmployeeService";
import { BaseController } from "@/controllers/BaseController";

export class EmployeeController extends BaseController<EmployeeCreateDTO, EmployeeUpdateDTO> {

  constructor() {
    super(new EmployeeService());
  }
}

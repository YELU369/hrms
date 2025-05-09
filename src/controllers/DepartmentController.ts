import { CreateDTO as DepartmentCreateDTO } from "@/DTOs/Department/CreateDTO";
import { UpdateDTO as DepartmentUpdateDTO } from "@/DTOs/Department/UpdateDTO";
import { DepartmentService } from "@/services/DepartmentService";
import { BaseController } from "@/controllers/BaseController";

export class DepartmentController extends BaseController<DepartmentCreateDTO, DepartmentUpdateDTO> {

  constructor() {
    super(new DepartmentService());
  }
}

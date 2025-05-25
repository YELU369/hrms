import { CreateDTO as DepartmentManagerCreateDTO } from "@/DTOs/Department/Manager/CreateDTO";
import { UpdateDTO as DepartmentManagerUpdateDTO } from "@/DTOs/Department/Manager/UpdateDTO";
import { DepartmentManagerService } from "@/services/DepartmentManagerService";
import { BaseController } from "@/controllers/BaseController";

export class DepartmentManagerController extends BaseController<DepartmentManagerCreateDTO, DepartmentManagerUpdateDTO> {

  constructor() {
    super(new DepartmentManagerService());
  }
}

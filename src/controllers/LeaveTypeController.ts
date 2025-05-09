import { CreateDTO as LeaveTypeCreateDTO } from "@/DTOs/LeaveType/CreateDTO";
import { UpdateDTO as LeaveTypeUpdateDTO } from "@/DTOs/LeaveType/UpdateDTO";
import { LeaveTypeService } from "@/services/LeaveTypeService";
import { BaseController } from "@/controllers/BaseController";

export class LeaveTypeController extends BaseController<LeaveTypeCreateDTO, LeaveTypeUpdateDTO> {

  constructor() {
    super(new LeaveTypeService());
  }
}

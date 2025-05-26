import { CreateDTO as LeaveBalanceCreateDTO } from "@/DTOs/LeaveBalance/CreateDTO";
import { UpdateDTO as LeaveBalanceUpdateDTO } from "@/DTOs/LeaveBalance/UpdateDTO";
import { LeaveBalanceService } from "@/services/LeaveBalanceService";
import { BaseController } from "@/controllers/BaseController";

export class LeaveBalanceController extends BaseController<LeaveBalanceCreateDTO, LeaveBalanceUpdateDTO> {

  constructor() {
    super(new LeaveBalanceService());
  }
}

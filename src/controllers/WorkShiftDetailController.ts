import { CreateDTO as WorkShiftDetailCreateDTO } from "@/DTOs/WorkShift/Detail/CreateDTO";
import { UpdateDTO as WorkShiftDetailUpdateDTO } from "@/DTOs/WorkShift/Detail/UpdateDTO";
import { WorkShiftDetailService } from "@/services/WorkShiftDetailService";
import { BaseController } from "@/controllers/BaseController";

export class WorkShiftDetailController extends BaseController<WorkShiftDetailCreateDTO, WorkShiftDetailUpdateDTO> {

  constructor() {
    super(new WorkShiftDetailService());
  }
}

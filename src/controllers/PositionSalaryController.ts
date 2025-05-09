import { CreateDTO as PositionSalaryCreateDTO } from "@/DTOs/Position/Salary/CreateDTO";
import { UpdateDTO as PositionSalaryUpdateDTO } from "@/DTOs/Position/Salary/UpdateDTO";
import { PositionSalaryService } from "@/services/PositionSalaryService";
import { BaseController } from "@/controllers/BaseController";

export class PositionSalaryController extends BaseController<PositionSalaryCreateDTO, PositionSalaryUpdateDTO> {

  constructor() {
    super(new PositionSalaryService());
  }
}

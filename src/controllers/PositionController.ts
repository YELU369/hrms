import { CreateDTO as PositionCreateDTO } from "@/DTOs/Position/CreateDTO";
import { UpdateDTO as PositionUpdateDTO } from "@/DTOs/Position/UpdateDTO";
import { PositionService } from "@/services/PositionService";
import { BaseController } from "@/controllers/BaseController";

export class PositionController extends BaseController<PositionCreateDTO, PositionUpdateDTO> {

  constructor() {
    super(new PositionService());
  }
}

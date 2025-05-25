import { CreateDTO as HolidayCreateDTO } from "@/DTOs/Holiday/CreateDTO";
import { UpdateDTO as HolidayUpdateDTO } from "@/DTOs/Holiday/UpdateDTO";
import { HolidayService } from "@/services/HolidayService";
import { BaseController } from "@/controllers/BaseController";

export class HolidayController extends BaseController<HolidayCreateDTO, HolidayUpdateDTO> {

  constructor() {
    super(new HolidayService());
  }
}

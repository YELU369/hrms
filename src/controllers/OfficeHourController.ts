import { CreateDTO as OfficeHourCreateDTO } from "@/DTOs/OfficeHour/CreateDTO";
import { UpdateDTO as OfficeHourUpdateDTO } from "@/DTOs/OfficeHour/UpdateDTO";
import { OfficeHourService } from "@/services/OfficeHourService";
import { BaseController } from "@/controllers/BaseController";

export class OfficeHourController extends BaseController<OfficeHourCreateDTO, OfficeHourUpdateDTO> {

  constructor() {
    super(new OfficeHourService());
  }
}

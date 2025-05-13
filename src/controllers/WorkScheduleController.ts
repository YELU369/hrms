import { CreateDTO as WorkScheduleCreateDTO } from "@/DTOs/WorkSchedule/CreateDTO";
import { UpdateDTO as WorkScheduleUpdateDTO } from "@/DTOs/WorkSchedule/UpdateDTO";
import { WorkScheduleService } from "@/services/WorkScheduleService";
import { BaseController } from "@/controllers/BaseController";
import { AuthRequest } from "@/middlewares/validateToken";
import { WorkScheduleFacade } from "@/facades/WorkScheduleFacade";
import { ServiceResult } from "@/ServiceResult";
import { Response } from "express";

export class WorkScheduleController extends BaseController<WorkScheduleCreateDTO, WorkScheduleUpdateDTO> {

  constructor() {
    super(new WorkScheduleService());
  }

  async storeWithDetail(request: AuthRequest, response: Response): Promise<void> {
    
    const data: WorkScheduleCreateDTO = request.body;
    const userId = Number(request.user_id);

    try {
      
      const facade = new WorkScheduleFacade();
      await facade.store(data, userId);

      this.respond(response, ServiceResult.success(`The work schedule was successfully created.`));
      
    } catch (exception) {
      throw exception;
    }
  }
}

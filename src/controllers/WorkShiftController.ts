import { CreateDTO as WorkShiftCreateDTO } from "@/DTOs/WorkShift/CreateDTO";
import { UpdateDTO as WorkShiftUpdateDTO } from "@/DTOs/WorkShift/UpdateDTO";
import { WorkShiftService } from "@/services/WorkShiftService";
import { BaseController } from "@/controllers/BaseController";
import { AuthRequest } from "@/middlewares/validateToken";
import { WorkShiftFacade } from "@/facades/WorkShiftFacade";
import { ServiceResult } from "@/ServiceResult";
import { Response } from "express";

export class WorkShiftController extends BaseController<WorkShiftCreateDTO, WorkShiftUpdateDTO> {

  constructor() {
    super(new WorkShiftService());
  }

  async store(request: AuthRequest, response: Response): Promise<void> {
    
    const data: WorkShiftCreateDTO = request.body;
    const userId = Number(request.user_id);

    try {
      
      const facade = new WorkShiftFacade();
      await facade.store(data, userId);

      this.respond(response, ServiceResult.success(`The work shift was successfully created.`));
      
    } catch (exception) {
      throw exception;
    }
  }

  async update(request: AuthRequest, response: Response): Promise<void> {
    
    const { id } = request.params;
    const data: WorkShiftCreateDTO = request.body;
    const userId = Number(request.user_id);

    try {
      
      const facade = new WorkShiftFacade();
      await facade.update(Number(id), data, userId);

      this.respond(response, ServiceResult.success(`The work shift was successfully updated.`));
      
    } catch (exception) {
      throw exception;
    }
  }
}

import { CreateDTO as LeaveTypeCreateDTO } from "@/DTOs/LeaveType/CreateDTO";
import { UpdateDTO as LeaveTypeUpdateDTO } from "@/DTOs/LeaveType/UpdateDTO";
import { AuthRequest } from "@/middlewares/validateToken";
import { LeaveTypeService } from "@/services/LeaveTypeService";
import { Response } from "express";

export class LeaveTypeController {

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await LeaveTypeService.getList(request.query, page, limit);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: LeaveTypeCreateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await LeaveTypeService.create(data, userId);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const result = await LeaveTypeService.getDetailInfo(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const data: LeaveTypeUpdateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await LeaveTypeService.update(parseInt(id), userId, data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    const result = await LeaveTypeService.delete(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}

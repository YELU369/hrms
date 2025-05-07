import { CreateDTO as SalaryCreateDTO } from "@/DTOs/Position/Salary/CreateDTO";
import { UpdateDTO as SalaryUpdateDTO } from "@/DTOs/Position/Salary/UpdateDTO";
import { AuthRequest } from "@/middlewares/validateToken";
import { PositionSalaryService } from "@/services/PositionSalaryService";
import { Response } from "express";

export class PositionSalaryController {

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await PositionSalaryService.getList(request.query, page, limit);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: SalaryCreateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await PositionSalaryService.create(data, userId);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const result = await PositionSalaryService.getDetailInfo(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const data: SalaryUpdateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await PositionSalaryService.update(parseInt(id), userId, data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    const result = await PositionSalaryService.delete(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}

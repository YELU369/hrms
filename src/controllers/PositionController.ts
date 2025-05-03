import { CreateDTO as PositionCreateDTO } from "@/DTOs/Position/CreateDTO";
import { UpdateDTO as PositionUpdateDTO } from "@/DTOs/Position/UpdateDTO";
import { AuthRequest } from "@/middlewares/validateToken";
import { PositionService } from "@/services/PositionService";
import { Response } from "express";

export class PositionController {

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await PositionService.getList(request.query, page, limit);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: PositionCreateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await PositionService.create(data, userId);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const result = await PositionService.getDetailInfo(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const data: PositionUpdateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await PositionService.update(parseInt(id), userId, data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    const result = await PositionService.delete(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}

import { CreateDTO as EmployeeCreateDTO } from "@/DTOs/Employee/CreateDTO";
import { UpdateDTO as EmployeeUpdateDTO } from "@/DTOs/Employee/UpdateDTO";
import { AuthRequest } from "@/middlewares/validateToken";
import { EmployeeService } from "@/services/EmployeeService";
import { Response } from "express";

export class EmployeeController {

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await EmployeeService.getList(request.query, page, limit);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: EmployeeCreateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await EmployeeService.create(data, userId);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const result = await EmployeeService.getDetailInfo(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const data: EmployeeUpdateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await EmployeeService.update(parseInt(id), userId, data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    const result = await EmployeeService.delete(parseInt(id));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}

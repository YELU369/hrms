import { AppDataSource } from "@/data-source";
import { CreateDTO as DeptCreateDTO } from "@/DTOs/Department/CreateDTO";
import { UpdateDTO as DeptUpdateDTO } from "@/DTOs/Department/UpdateDTO";
import { Department } from "@/entity/Department";
import { User } from "@/entity/User";
import { Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { AuthRequest } from "@/middlewares/validateToken";
import { DepartmentService } from "@/services/DepartmentService";
import { Request, Response } from "express";

export class DepartmentController {

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const result = await DepartmentService.getList(request.query, page, limit);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: DeptCreateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await DepartmentService.create(data, userId);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { departmentId } = request.params;
    const result = await DepartmentService.getDetailInfo(parseInt(departmentId));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { departmentId } = request.params;
    const data: DeptUpdateDTO = request.body;
    const userId = Number(request.user_id);

    const result = await DepartmentService.update(parseInt(departmentId), userId, data);

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { departmentId } = request.params;

    const result = await DepartmentService.delete(parseInt(departmentId));

    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
}

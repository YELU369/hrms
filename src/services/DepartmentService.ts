import { BaseService } from "@/services/BaseService";
import { Department } from "@/entity/Department";
import { DepartmentRepository, DepartmentSearchParams } from "@/repositories/DepartmentRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager, FindManyOptions } from "typeorm";
import { UserService } from "./UserService";

export class DepartmentService extends BaseService<Department> {

  public repo: DepartmentRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new DepartmentRepository(manager));
  }

  async getList(searchParams: DepartmentSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Department>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['creator', 'updater']): Promise<Partial<Department>> {

    const result = await super.getById(id, fields, []);

    if (relations.includes('creator') && result.created_by != null) {
      const userService = new UserService();
      result.creator = await userService.getById(result.created_by, ['id', 'name'], []);
    }
  
    if (relations.includes('updater') && result.updated_by != null) {
      const userService = new UserService();
      result.updater = await userService.getById(result.updated_by, ['id', 'name'], []);
    }
  
    const { created_by, updated_by, ...rest } = result;
    return rest;
  }
}

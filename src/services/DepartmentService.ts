import { BaseService } from "@/services/BaseService";
import { Department } from "@/entity/Department";
import { DepartmentRepository, DepartmentSearchParams } from "@/repositories/DepartmentRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { FindManyOptions } from "typeorm";
import { User } from "@/entity/User";

export class DepartmentService extends BaseService<Department> {

  public repo: DepartmentRepository;

  constructor() {
    super(new DepartmentRepository());
  }

  async getList(searchParams: DepartmentSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Department>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, relations: string[] = ['created_by', 'updated_by']): Promise<Department> {

    const result = await super.getById(id, relations);
    
    if (result.created_by) {
      result.created_by = {
        id: result.created_by.id,
        name: result.created_by.name,
      } as User;
    }

    if (result.updated_by) {
      result.updated_by = {
        id: result.updated_by.id,
        name: result.updated_by.name,
      } as User;
    }
    
    return result;
  }
}

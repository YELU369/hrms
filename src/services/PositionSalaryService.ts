import { BaseService } from "@/services/BaseService";
import { PositionSalary } from "@/entity/PositionSalary";
import { PositionSalaryRepository, PositionSalarySearchParams } from "@/repositories/PositionSalaryRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { FindManyOptions } from "typeorm";
import { User } from "@/entity/User";

export class PositionSalaryService extends BaseService<PositionSalary> {

  public repo: PositionSalaryRepository;

  constructor() {
    super(new PositionSalaryRepository());
  }

  async getList(searchParams: PositionSalarySearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<PositionSalary>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, relations: string[] = ['position', 'created_by', 'updated_by']): Promise<PositionSalary> {
    
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

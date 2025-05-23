import { BaseService } from "@/services/BaseService";
import { PositionSalary } from "@/entity/PositionSalary";
import { PositionSalaryRepository, PositionSalarySearchParams } from "@/repositories/PositionSalaryRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager, FindManyOptions } from "typeorm";
import { User } from "@/entity/User";
import { UserService } from "./UserService";

export class PositionSalaryService extends BaseService<PositionSalary> {

  public repo: PositionSalaryRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new PositionSalaryRepository(manager));
  }

  async getList(searchParams: PositionSalarySearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<PositionSalary>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['position', 'creator', 'updater']): Promise<Partial<PositionSalary>> {
    
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

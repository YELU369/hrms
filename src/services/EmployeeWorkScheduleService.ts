import { BaseService } from "@/services/BaseService";
import { EmployeeWorkSchedule } from "@/entity/EmployeeWorkSchedule";
import { EmployeeWorkScheduleRepository, EmployeeWorkScheduleSearchParams } from "@/repositories/EmployeeWorkScheduleRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { User } from "@/entity/User";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";

export class EmployeeWorkScheduleService extends BaseService<EmployeeWorkSchedule> {

  public repo: EmployeeWorkScheduleRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new EmployeeWorkScheduleRepository(manager));
  }

  async getList(searchParams: EmployeeWorkScheduleSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<EmployeeWorkSchedule>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['employee', 'schedule',  'creator', 'updater']): Promise<Partial<EmployeeWorkSchedule>> {
    
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

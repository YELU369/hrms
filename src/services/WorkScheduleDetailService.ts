import { BaseService } from "@/services/BaseService";
import { WorkScheduleDetail } from "@/entity/WorkScheduleDetail";
import { WorkScheduleDetailRepository, WorkScheduleDetailSearchParams } from "@/repositories/WorkScheduleDetailRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { User } from "@/entity/User";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";

export class WorkScheduleDetailService extends BaseService<WorkScheduleDetail> {

  public repo: WorkScheduleDetailRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new WorkScheduleDetailRepository(manager));
  }

  async getList(searchParams: WorkScheduleDetailSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkScheduleDetail>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['creator', 'updater']): Promise<Partial<WorkScheduleDetail>> {
    
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

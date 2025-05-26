import { BaseService } from "@/services/BaseService";
import { WorkShiftDetail } from "@/entity/WorkShiftDetail";
import { WorkShiftDetailRepository, WorkShiftDetailSearchParams } from "@/repositories/WorkShiftDetailRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";

export class WorkShiftDetailService extends BaseService<WorkShiftDetail> {

  public repo: WorkShiftDetailRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new WorkShiftDetailRepository(manager));
  }

  async getList(searchParams: WorkShiftDetailSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkShiftDetail>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['employee', 'workshift',  'creator', 'updater']): Promise<Partial<WorkShiftDetail>> {
    
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

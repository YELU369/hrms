import { BaseService } from "@/services/BaseService";
import { LeaveType } from "@/entity/LeaveType";
import { LeaveTypeRepository, LeaveTypeSearchParams } from "@/repositories/LeaveTypeRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager, FindManyOptions } from "typeorm";
import { User } from "@/entity/User";
import { UserService } from "./UserService";

export class LeaveTypeService extends BaseService<LeaveType> {

  public repo: LeaveTypeRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new LeaveTypeRepository(manager));
  }

  async getList(searchParams: LeaveTypeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<LeaveType>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['creator', 'updater']): Promise<Partial<LeaveType>> {
    
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

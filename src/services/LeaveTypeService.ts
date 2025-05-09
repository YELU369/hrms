import { BaseService } from "@/services/BaseService";
import { LeaveType } from "@/entity/LeaveType";
import { LeaveTypeRepository, LeaveTypeSearchParams } from "@/repositories/LeaveTypeRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { FindManyOptions } from "typeorm";
import { User } from "@/entity/User";

export class LeaveTypeService extends BaseService<LeaveType> {

  public repo: LeaveTypeRepository;

  constructor() {
    super(new LeaveTypeRepository());
  }

  async getList(searchParams: LeaveTypeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<LeaveType>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, relations: string[] = ['created_by', 'updated_by']): Promise<LeaveType> {
    
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

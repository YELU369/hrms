import { BaseService } from "@/services/BaseService";
import { Holiday } from "@/entity/Holiday";
import { HolidaySearchParams, HolidayRepository } from "@/repositories/HolidayRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";

export class HolidayService extends BaseService<Holiday> {

  public repo: HolidayRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new HolidayRepository(manager));
  }

  async getList(searchParams: HolidaySearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Holiday>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['creator', 'updater']): Promise<Partial<Holiday>> {
    
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

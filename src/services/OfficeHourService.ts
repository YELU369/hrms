import { BaseService } from "@/services/BaseService";
import { OfficeHour } from "@/entity/OfficeHour";
import { OfficeHourRepository } from "@/repositories/OfficeHourRepository";
import { User } from "@/entity/User";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";

export class OfficeHourService extends BaseService<OfficeHour> {

  public repo: OfficeHourRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new OfficeHourRepository(manager));
  }

  async getList(page: number = 0, limit: number = 100): Promise<PaginationResult<OfficeHour>> {
    return await this.repo.getList(page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['creator', 'updater']): Promise<Partial<OfficeHour>> {
    
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

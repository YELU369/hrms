import { BaseService } from "@/services/BaseService";
import { WorkSchedule } from "@/entity/WorkSchedule";
import { WorkScheduleDetailSearchParams, WorkScheduleRepository } from "@/repositories/WorkScheduleRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { User } from "@/entity/User";
import { EntityManager } from "typeorm";
import { WorkScheduleDetailService } from "./WorkScheduleDetailService";
import { UserService } from "./UserService";

export class WorkScheduleService extends BaseService<WorkSchedule> {

  public repo: WorkScheduleRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new WorkScheduleRepository(manager));
  }

  async getList(searchParams: WorkScheduleDetailSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkSchedule>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['details', 'creator', 'updater']): Promise<Partial<WorkSchedule>> {
    
    const result = await super.getById(id, fields, []);
  
    if (relations.includes('details')) {

      const workScheduleDetailService = new WorkScheduleDetailService();
      let details = await workScheduleDetailService.getAll({
        select: ['id', 'day_number', 'is_off'],
        where: { work_schedule_id: result.id },
        order: { day_number: 'ASC' },
        relations: ['officeHour'],
      });
  
      result.details = details.map((detail: any) => {
        if (detail.officeHour) {
          const { created_at, updated_at, created_by, updated_by, ...rest } = detail.officeHour;
          detail.officeHour = rest;
        }
        return detail;
      });
    }
  
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

import { BaseService } from "@/services/BaseService";
import { WorkShift } from "@/entity/WorkShift";
import { WorkShiftRepository, WorkShiftSearchParams } from "@/repositories/WorkShiftRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";
import { WorkShiftDetailService } from "./WorkShiftDetailService";
import { WorkScheduleService } from "./WorkScheduleService";

export class WorkShiftService extends BaseService<WorkShift> {

  public repo: WorkShiftRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new WorkShiftRepository(manager));
  }

  async getList(searchParams: WorkShiftSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkShift>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['schedule', 'details',  'creator', 'updater']): Promise<Partial<WorkShift>> {
    
    const result = await super.getById(id, fields, []);

    if (relations.includes('details')) {
    
      const workShiftDetailService = new WorkShiftDetailService();
      let details = await workShiftDetailService.getAll({
        select: ['id'],
        where: { work_shift_id: result.id },
        order: { employee_id: 'ASC' },
        relations: ['employee'],
      });
  
      result.details = details.map((detail: any) => {
        if (detail.employee) {
          const { created_at, updated_at, created_by, updated_by, ...rest } = detail.employee;
          detail.employee = rest;
        }
        return detail;
      });
    }
    
    if (relations.includes('schedule') && result.work_schedule_id != null) {
      const workSchedule = new WorkScheduleService();
      result.schedule = await workSchedule.getById(result.work_schedule_id, ['id', 'title', 'description'], []);
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

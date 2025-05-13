import { BaseRepository } from "@/repositories/BaseRepository";
import { EmployeeWorkSchedule } from "@/entity/EmployeeWorkSchedule";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface EmployeeWorkScheduleSearchParams {
  work_schedule_id?: number
}

export class EmployeeWorkScheduleRepository extends BaseRepository<EmployeeWorkSchedule> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(EmployeeWorkSchedule, manager);
  }

  async getList(searchParams: EmployeeWorkScheduleSearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<EmployeeWorkSchedule>> {
    
    const baseQuery = this.repo.createQueryBuilder('employeeWorkSchedule')
                              .innerJoin('employeeWorkSchedule.employee', 'employee')
                              .innerJoin('employeeWorkSchedule.schedule', 'schedule')
                              .innerJoin('employee.position', 'position')
                              .select([
                                'employeeWorkSchedule.id', 
                                'employee.id', 
                                'employee.first_name', 
                                'employee.last_name', 
                                'employee.code', 
                                'employee.updated_at', 
                                'position.id', 
                                'position.title',  
                                'schedule.id', 
                                'schedule.title'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.work_schedule_id, query =>
                          query.andWhere('employeeWorkSchedule.work_schedule_id = :work_schedule_id', { work_schedule_id: `${searchParams.work_schedule_id}` })
                        )

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

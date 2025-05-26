import { BaseRepository } from "@/repositories/BaseRepository";
import { WorkShift } from "@/entity/WorkShift";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface WorkShiftSearchParams {
  work_schedule_id?: number
}

export class WorkShiftRepository extends BaseRepository<WorkShift> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(WorkShift, manager);
  }

  async getList(searchParams: WorkShiftSearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkShift>> {
    
    const baseQuery = this.repo.createQueryBuilder('workShift')
                              .innerJoin('workShift.schedule', 'schedule')
                              .select([
                                'workShift.id', 
                                'workShift.start_from',
                                'workShift.end_to',
                                'workShift.updated_at',
                                'schedule.id', 
                                'schedule.title'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.work_schedule_id, query =>
                          query.andWhere('workShift.work_schedule_id = :work_schedule_id', { work_schedule_id: `${searchParams.work_schedule_id}` })
                        )

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseRepository } from "@/repositories/BaseRepository";
import { WorkScheduleDetail } from "@/entity/WorkScheduleDetail";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface WorkScheduleDetailSearchParams {
  work_schedule_id?: number, 
  office_hour_id?: number, 
  is_off?: boolean, 
  day_number?: number, 
}

export class WorkScheduleDetailRepository extends BaseRepository<WorkScheduleDetail> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(WorkScheduleDetail, manager);
  }

  async getList(searchParams: WorkScheduleDetailSearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkScheduleDetail>> {
    
    const baseQuery = this.repo.createQueryBuilder('workScheduleDetail')
                              .leftJoin('workScheduleDetail.office_hour_id', 'officeHour')
                              .select([
                                'workScheduleDetail.id', 
                                'workScheduleDetail.day_number', 
                                'workScheduleDetail.is_off', 
                                'workScheduleDetail.updated_at', 
                                'officeHour.work_from', 
                                'officeHour.work_to'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.office_hour_id, query =>
                          query.andWhere('workScheduleDetail.office_hour_id = :office_hour_id', { office_hour_id: `${searchParams.office_hour_id}` })
                        )
                        .when(!!searchParams.work_schedule_id, query =>
                          query.andWhere('workScheduleDetail.work_schedule_id = :work_schedule_id', { work_schedule_id: `${searchParams.work_schedule_id}` })
                        )
                        .when(!!searchParams.is_off, query =>
                          query.andWhere('workScheduleDetail.is_off = :is_off', { is_off: `${searchParams.is_off}` })
                        )
                        .when(!!searchParams.day_number, query =>
                          query.andWhere('workScheduleDetail.day_number = :day_number', { day_number: `${searchParams.day_number}` })
                        );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

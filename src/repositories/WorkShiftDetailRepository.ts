import { BaseRepository } from "@/repositories/BaseRepository";
import { WorkShiftDetail } from "@/entity/WorkShiftDetail";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface WorkShiftDetailSearchParams {
  work_shift_id?: number
}

export class WorkShiftDetailRepository extends BaseRepository<WorkShiftDetail> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(WorkShiftDetail, manager);
  }

  async getList(searchParams: WorkShiftDetailSearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkShiftDetail>> {
    
    const baseQuery = this.repo.createQueryBuilder('workShiftDetail')
                              .innerJoin('workShiftDetail.employee', 'employee')
                              .innerJoin('workShiftDetail.workshift', 'workshift')
                              .select([
                                'workShiftDetail.id',
                                'workshift.id', 
                                'workshift.start_from',
                                'workshift.end_to',
                                'employee.id', 
                                'employee.first_name',
                                'employee.last_name', 
                                'employee.code',
                                'workShiftDetail.updated_at',
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.work_shift_id, query =>
                          query.andWhere('workShiftDetail.work_shift_id = :work_shift_id', { work_shift_id: `${searchParams.work_shift_id}` })
                        )

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseRepository } from "@/repositories/BaseRepository";
import { WorkSchedule } from "@/entity/WorkSchedule";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface WorkScheduleDetailSearchParams {
  keyword?: string, 
}

export class WorkScheduleRepository extends BaseRepository<WorkSchedule> {

  public manager: EntityManager;
  
  constructor(manager?: EntityManager) {
    super(WorkSchedule, manager);
  }

  async getList(searchParams: WorkScheduleDetailSearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<WorkSchedule>> {
    
    const baseQuery = this.repo.createQueryBuilder('workSchedule')
                              .select([
                                'workSchedule.id', 
                                'workSchedule.title', 
                                'workSchedule.start_from', 
                                'workSchedule.end_to', 
                                'workSchedule.description', 
                                'workSchedule.updated_at'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.keyword, query =>
                          query.andWhere('workSchedule.title LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                            .orWhere('workSchedule.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseRepository } from "@/repositories/BaseRepository";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { LeaveType } from "@/entity/LeaveType";
import { EntityManager } from "typeorm";

export interface LeaveTypeSearchParams {
  keyword?: string, 
  is_paid?: boolean
}

export class LeaveTypeRepository extends BaseRepository<LeaveType> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(LeaveType, manager);
  }

  async getList(searchParams: LeaveTypeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<LeaveType>> {
  
    const baseQuery = this.repo.createQueryBuilder('leaveType')
                              .select([
                                'leaveType.id', 
                                'leaveType.name', 
                                'leaveType.description', 
                                'leaveType.is_paid', 
                                'leaveType.max_days_per_year', 
                                'leaveType.carry_over_days', 
                                'leaveType.updated_at'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.keyword, query =>
                          query.andWhere('leaveType.name LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                            .orWhere('leaveType.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        )
                        .when(!!searchParams.is_paid, query =>
                          query.andWhere('leaveType.is_paid = :is_paid', { is_paid: `${searchParams.is_paid}` })
                        );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

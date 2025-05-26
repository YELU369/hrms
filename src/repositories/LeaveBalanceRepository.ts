import { BaseRepository } from "@/repositories/BaseRepository";
import { LeaveBalance } from "@/entity/LeaveBalance";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface LeaveBalanceSearchParams {
  employee_id?: number, 
  leave_type_id?: number, 
}

export class LeaveBalanceRepository extends BaseRepository<LeaveBalance> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(LeaveBalance, manager);
  }

  async getList(searchParams: LeaveBalanceSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<LeaveBalance>> {
  
    const baseQuery = this.repo.createQueryBuilder('leaveBalance')
                              .innerJoin('leaveBalance.leaveType', 'leaveType')
                              .innerJoin('leaveBalance.employee', 'employee')
                              .select([
                                'leaveBalance.id', 
                                'leaveBalance.start_from',
                                'leaveBalance.end_to',
                                'leaveBalance.total_days',
                                'leaveBalance.used_days',
                                'leaveType.id', 
                                'leaveType.name', 
                                'employee.id', 
                                'employee.first_name',
                                'employee.last_name',
                                'employee.code', 
                                'leaveBalance.updated_at', 
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.employee_id, query =>
                      query.andWhere('leaveBalance.employee_id = :employee_id', { employee_id: `${searchParams.employee_id}` })
                    )
                    .when(!!searchParams.leave_type_id, query =>
                      query.andWhere('leaveBalance.leave_type_id = :leave_type_id', { leave_type_id: `${searchParams.leave_type_id}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

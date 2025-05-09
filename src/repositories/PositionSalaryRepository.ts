import { BaseRepository } from "@/repositories/BaseRepository";
import { PositionSalary } from "@/entity/PositionSalary";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";

export interface PositionSalarySearchParams {
  position_id?: number, 
}

export class PositionSalaryRepository extends BaseRepository<PositionSalary> {
  
  constructor() {
    super(PositionSalary);
  }

  async getList(searchParams: PositionSalarySearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<PositionSalary>> {
  
    const baseQuery = this.repo.createQueryBuilder('salary')
                              .innerJoin('salary.position', 'position')
                              .leftJoin('salary.updated_by', 'updater')
                              .select([
                                'salary.id', 
                                'salary.min_salary', 
                                'salary.max_salary', 
                                'salary.start_from', 
                                'salary.updated_at', 
                                'position.id', 
                                'position.title', 
                                'updater.id', 
                                'updater.name'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.position_id, query =>
                      query.andWhere('salary.position_id = :position_id', { position_id: `${searchParams.position_id}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

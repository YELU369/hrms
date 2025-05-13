import { BaseRepository } from "@/repositories/BaseRepository";
import { PositionSalary } from "@/entity/PositionSalary";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface PositionSalarySearchParams {
  position_id?: number, 
}

export class PositionSalaryRepository extends BaseRepository<PositionSalary> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(PositionSalary, manager);
  }

  async getList(searchParams: PositionSalarySearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<PositionSalary>> {
  
    const baseQuery = this.repo.createQueryBuilder('salary')
                              .innerJoin('salary.position', 'position')
                              .select([
                                'salary.id', 
                                'salary.min_salary', 
                                'salary.max_salary', 
                                'salary.start_from', 
                                'salary.updated_at', 
                                'position.id', 
                                'position.title'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.position_id, query =>
                      query.andWhere('salary.position_id = :position_id', { position_id: `${searchParams.position_id}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseRepository } from "@/repositories/BaseRepository";
import { Position } from "@/entity/Position";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface PositionSearchParams {
  keyword?: string, 
  department_id?: number, 
  is_manager?: boolean
}

export class PositionRepository extends BaseRepository<Position> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(Position, manager);
  }

  async getList(searchParams: PositionSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Position>> {
  
    const baseQuery = this.repo.createQueryBuilder('position')
                              .innerJoin('position.department', 'department')
                              .select([
                                'position.id', 
                                'position.title', 
                                'position.description', 
                                'position.is_manager', 
                                'position.updated_at', 
                                'department.id', 
                                'department.name'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.keyword, query =>
                          query.andWhere('position.title LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                            .orWhere('position.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        )
                        .when(!!searchParams.department_id, query =>
                          query.andWhere('position.department_id = :department_id', { department_id: `${searchParams.department_id}` })
                        )
                        .when(!!searchParams.is_manager, query =>
                          query.andWhere('position.is_manager = :is_manager', { is_manager: `${searchParams.is_manager}` })
                        );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

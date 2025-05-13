import { Department } from "@/entity/Department";
import { BaseRepository } from "./BaseRepository";
import { Paginator, PaginationResult } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface DepartmentSearchParams {
  keyword?: string
}

export class DepartmentRepository extends BaseRepository<Department> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(Department, manager);
  }

  async getList(searchParams: DepartmentSearchParams, page = 0, limit = 100): Promise<PaginationResult<Department>> {

    const baseQuery = this.repo.createQueryBuilder('dept')
                              .select([
                                'dept.id', 
                                'dept.name', 
                                'dept.description', 
                                'dept.updated_at'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
      .when(!!searchParams.keyword, query =>
        query.andWhere('dept.name LIKE :keyword OR dept.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
      );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return paginator.paginate();
  }
}

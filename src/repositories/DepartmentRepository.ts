import { Department } from "@/entity/Department";
import { BaseRepository } from "./BaseRepository";
import { Paginator, PaginationResult } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";

export interface DepartmentSearchParams {
  keyword?: string
}

export class DepartmentRepository extends BaseRepository<Department> {
  
  constructor() {
    super(Department);
  }

  async getList(searchParams: DepartmentSearchParams, page = 0, limit = 100): Promise<PaginationResult<Department>> {

    const baseQuery = this.repo.createQueryBuilder('dept')
                              .leftJoin('dept.updated_by', 'updater')
                              .select([
                                'dept.id', 
                                'dept.name', 
                                'dept.description', 
                                'dept.updated_at', 
                                'updater.id', 
                                'updater.name'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
      .when(!!searchParams.keyword, query =>
        query.andWhere('dept.name LIKE :keyword OR dept.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
      );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return paginator.paginate();
  }
}

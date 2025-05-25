import { BaseRepository } from "@/repositories/BaseRepository";
import { DepartmentManager } from "@/entity/DepartmentManager";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface DepartmentManagerSearchParams {
  employee_id?: number, 
  department_id?: number, 
}

export class DepartmentManagerRepository extends BaseRepository<DepartmentManager> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(DepartmentManager, manager);
  }

  async getList(searchParams: DepartmentManagerSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<DepartmentManager>> {
  
    const baseQuery = this.repo.createQueryBuilder('departmentManager')
                              .innerJoin('departmentManager.department', 'department')
                              .innerJoin('departmentManager.employee', 'employee')
                              .select([
                                'departmentManager.id', 
                                'departmentManager.date_from',
                                'department.id', 
                                'department.name', 
                                'employee.id', 
                                'employee.first_name',
                                'employee.last_name',
                                'employee.code', 
                                'departmentManager.updated_at', 
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.employee_id, query =>
                      query.andWhere('departmentManager.employee_id = :employee_id', { employee_id: `${searchParams.employee_id}` })
                    )
                    .when(!!searchParams.department_id, query =>
                      query.andWhere('departmentManager.department_id = :department_id', { department_id: `${searchParams.department_id}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseRepository } from "@/repositories/BaseRepository";
import { Employee } from "@/entity/Employee";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface EmployeeSearchParams {
  keyword?: string, 
  position_id?: number, 
  employment_type?: 'Full-time' | 'Part-time' | 'Contract', 
  joined_date?: string, 
}

export class EmployeeRepository extends BaseRepository<Employee> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(Employee, manager);
  }

  async getList(searchParams: EmployeeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Employee>> {
  
    const baseQuery = this.repo.createQueryBuilder('employee')
                              .innerJoin('employee.position', 'position')
                              .select([
                                'employee.id', 
                                'employee.first_name', 
                                'employee.last_name', 
                                'employee.code', 
                                'employee.nrc', 
                                'employee.email', 
                                'employee.phone', 
                                'employee.employment_type', 
                                'employee.joined_date', 
                                'employee.updated_at', 
                                'position.id', 
                                'position.title'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.keyword, query =>
                      query.andWhere('employee.first_name LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.last_name LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.code LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.nrc LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.email LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.phone LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                    )
                    .when(!!searchParams.position_id, query =>
                      query.andWhere('employee.position_id = :position_id', { position_id: `${searchParams.position_id}` })
                    )
                    .when(!!searchParams.employment_type, query =>
                      query.andWhere('employee.employment_type = :employment_type', { employment_type: `${searchParams.employment_type}` })
                    )
                    .when(!!searchParams.joined_date, query =>
                      query.andWhere('employee.joined_date = :joined_date', { joined_date: `${searchParams.joined_date}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

import { BaseService } from "@/services/BaseService";
import { DepartmentManager } from "@/entity/DepartmentManager";
import { DepartmentManagerRepository, DepartmentManagerSearchParams } from "@/repositories/DepartmentManagerRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";
import { DepartmentService } from "./DepartmentService";
import { EmployeeService } from "./EmployeeService";

export class DepartmentManagerService extends BaseService<DepartmentManager> {

  public repo: DepartmentManagerRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new DepartmentManagerRepository(manager));
  }

  async getList(searchParams: DepartmentManagerSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<DepartmentManager>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['department', 'employee', 'creator', 'updater']): Promise<Partial<DepartmentManager>> {
    
    const result = await super.getById(id, fields, []);

    if (relations.includes('department') && result.department_id != null) {
      const deptService = new DepartmentService();
      result.department = await deptService.getById(result.department_id, ['id', 'name'], []);
    }

    if (relations.includes('employee') && result.employee_id != null) {
      const empService = new EmployeeService();
      result.employee = await empService.getById(result.employee_id, ['id', 'first_name', 'last_name', 'code'], []);
    }
    
    if (relations.includes('creator') && result.created_by != null) {
      const userService = new UserService();
      result.creator = await userService.getById(result.created_by, ['id', 'name'], []);
    }
  
    if (relations.includes('updater') && result.updated_by != null) {
      const userService = new UserService();
      result.updater = await userService.getById(result.updated_by, ['id', 'name'], []);
    }
  
    const { created_by, updated_by, ...rest } = result;
    return rest;
  }
}

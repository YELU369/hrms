import { BaseService } from "@/services/BaseService";
import { Position } from "@/entity/Position";
import { PositionRepository, PositionSearchParams } from "@/repositories/PositionRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { User } from "@/entity/User";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";
import { DepartmentService } from "./DepartmentService";
import { PositionSalaryService } from "./PositionSalaryService";
import { EmployeeService } from "./EmployeeService";

export class PositionService extends BaseService<Position> {

  public repo: PositionRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new PositionRepository(manager));
  }

  async getList(searchParams: PositionSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Position>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['department', 'creator', 'updater']): Promise<Partial<Position>> {
    
    const result = await super.getById(id, fields, []);
    
    if (relations.includes('department') && result.department_id != null) {
      const deptService = new DepartmentService();
      result.department = await deptService.getById(result.department_id, ['id', 'name']);
    }

    if (relations.includes('salaries')) {
      const salaryService = new PositionSalaryService();
      result.salaries = await salaryService.getAll({
        select: ['id', 'start_from', 'min_salary', 'max_salary'], 
        where: { position_id: result.id },
        order: { start_from: 'DESC' }}
      );
    }

    if (relations.includes('employees')) {
      const employeeService = new EmployeeService();
      result.employees = await employeeService.getAll({
        select: ['id', 'first_name', 'last_name', 'code'], 
        where: { position_id: result.id },
        order: { joined_date: 'DESC' }}
      );
    }

    if (relations.includes('creator') && result.created_by != null) {
      const userService = new UserService();
      result.creator = await userService.getById(result.created_by, ['id', 'name']);
    }
  
    if (relations.includes('updater') && result.updated_by != null) {
      const userService = new UserService();
      result.updater = await userService.getById(result.updated_by, ['id', 'name']);
    }
  
    const { created_by, updated_by, ...rest } = result;
    return rest;
  }
}

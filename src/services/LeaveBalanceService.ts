import { BaseService } from "@/services/BaseService";
import { LeaveBalance } from "@/entity/LeaveBalance";
import { LeaveBalanceRepository, LeaveBalanceSearchParams } from "@/repositories/LeaveBalanceRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { EntityManager } from "typeorm";
import { UserService } from "./UserService";
import { EmployeeService } from "./EmployeeService";
import { LeaveTypeService } from "./LeaveTypeService";

export class LeaveBalanceService extends BaseService<LeaveBalance> {

  public repo: LeaveBalanceRepository;
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(new LeaveBalanceRepository(manager));
  }

  async getList(searchParams: LeaveBalanceSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<LeaveBalance>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['leaveType', 'employee', 'creator', 'updater']): Promise<Partial<LeaveBalance>> {
    
    const result = await super.getById(id, fields, []);

    if (relations.includes('leaveType') && result.leave_type_id != null) {
      const leaveTypeService = new LeaveTypeService();
      result.leaveType = await leaveTypeService.getById(result.leave_type_id, ['id', 'name'], []);
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

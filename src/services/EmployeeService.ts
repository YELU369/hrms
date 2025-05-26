import { AppDataSource } from "@/data-source";
import { CreateDTO as EmployeeCreateDTO } from "@/DTOs/Employee/CreateDTO";
import { UpdateDTO as EmployeeUpdateDTO } from "@/DTOs/Employee/UpdateDTO";
import { UserRegisterDTO } from "@/DTOs/UserRegisterDTO";
import { Employee } from "@/entity/Employee";
import { EmployeeSalary } from "@/entity/EmployeeSalary";
import { EmployeeUser } from "@/entity/EmployeeUser";
import { User } from "@/entity/User";
import { PaginationResult } from "@/helpers/Paginator";
import { ServiceResult } from "@/ServiceResult";
import { UserService } from "./UserService";
import { EntityManager, FindManyOptions } from "typeorm";
import { BaseService } from "./BaseService";
import { EmployeeRepository } from "@/repositories/EmployeeRepository";
import { PositionService } from "./PositionService";
import { WorkShiftDetailService } from "./WorkShiftDetailService";
import { WorkShiftDetail } from "@/entity/WorkShiftDetail";
import { WorkShiftService } from "./WorkShiftService";
import { WorkScheduleService } from "./WorkScheduleService";

export interface EmployeeSearchParams {
  keyword?: string, 
  position_id?: number, 
  employment_type?: 'Full-time' | 'Part-time' | 'Contract', 
  joined_date?: string, 
}

export class EmployeeService extends BaseService<Employee> {

  public repo: EmployeeRepository;
  public manager: EntityManager;
  
  constructor(manager?: EntityManager) {
    super(new EmployeeRepository(manager));
  }

  async getList(searchParams: EmployeeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Employee>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async store(data: EmployeeCreateDTO, userId: number): Promise<Employee> {
    
    const queryRunner = AppDataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {

      const employee = await super.store(data, userId);
  
      const userData: UserRegisterDTO = {
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        password: employee.email,
        confirmed_password: employee.email
      };
      const userService = new UserService();
      const userResult = await userService.register(userData);
      
      const empUserRepo = AppDataSource.getRepository(EmployeeUser);
      const binding = empUserRepo.create({
        employee_id: employee.id,
        user_id: userResult.id,
        creator: userResult,
        updater: userResult,
      });
      await empUserRepo.save(binding);
      
      const empSalary = AppDataSource.getRepository(EmployeeSalary);
      const salary = empSalary.create({
        employee: employee,
        salary: data.salary,
        start_from: employee.joined_date,
        creator: userResult,
        updater: userResult,
      });
      await empSalary.save(salary);

      queryRunner.commitTransaction();
      return employee;
  
    } catch (exception) {

      console.log('Employee Service - Create: ', exception);
      queryRunner.rollbackTransaction();
      throw exception;
      
    } finally {

      await queryRunner.release();
    }
  }  

  async getWorkShiftInfo(employeeId: number): Promise<any> {

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    const workShiftDetailService = new WorkShiftDetailService(); 
    const workShiftService = new WorkShiftService();
    const workShiftDetail = await workShiftDetailService.findOneBy({ employee_id: employeeId });

    if (!workShiftDetail) {
      throw new Error('Work shift detail not found for the employee');
    }

    const workShift = await workShiftService.getById(
      workShiftDetail.work_shift_id, 
      ['id', 'work_schedule_id', 'start_from', 'end_to'], 
    );

    if (!workShift.work_schedule_id) {
      throw new Error('Work shift does not have an associated work schedule');
    }

    const workScheduleService = new WorkScheduleService();
    const workSchedule = await workScheduleService.getById(workShift.work_schedule_id, ['title', 'description']) as any;
    workSchedule.start_from = workShift.start_from;
    workSchedule.end_to = workShift.end_to;

    return workSchedule;
  }

  async getById(id: number, fields: string[] = [], relations: string[] = ['position', 'workShiftDetail', 'creator', 'updater']): Promise<Partial<Employee>> {
      
    const result = await super.getById(id, fields, []);

    if (relations.includes('position') && result.position_id != null) {
      const positionService = new PositionService();
      result.position = await positionService.getById(result.position_id, ['id', 'title', 'department_id'], ['department']);

      if (result.position) {
        delete result.position.department_id;
      }
    }

    let work_shift_info: any = undefined;
    if (relations.includes('workShiftDetail')) {
      work_shift_info = await this.getWorkShiftInfo(id) as any || undefined; 
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

    return {
      ...rest,
      ...(relations.includes('workShiftDetail')? { work_shift_info } : {}),
    };
  }
}
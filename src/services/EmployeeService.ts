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

  async getById(id: number, fields: string[] = [], relations: string[] = ['position', 'creator', 'updater']): Promise<Partial<Employee>> {
      
    const result = await super.getById(id, fields, []);

    if (relations.includes('position') && result.position_id != null) {
      const positionService = new PositionService();
      result.position = await positionService.getById(result.position_id, ['id', 'title'], []);
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
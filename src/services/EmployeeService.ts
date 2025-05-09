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
import { FindManyOptions } from "typeorm";
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
  
  constructor() {
    super(new EmployeeRepository());
  }

  async getList(searchParams: EmployeeSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Employee>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async store(data: EmployeeCreateDTO, userId: number): Promise<Employee> {
  
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
        created_by: userResult,
        updated_by: userResult,
      });
      await empUserRepo.save(binding);
      
      const empSalary = AppDataSource.getRepository(EmployeeSalary);
      const salary = empSalary.create({
        employee: employee,
        salary: data.salary,
        start_from: employee.joined_date,
        created_by: userResult,
        updated_by: userResult,
      });
      await empSalary.save(salary);
  
      return employee;
  
    } catch (exception) {

      console.log('Employee Service - Create: ', exception);
      throw exception;
    }
  }  

  async getById(id: number, relations: string[] = ['position', 'created_by', 'updated_by']): Promise<Employee> {
      
    const result = await super.getById(id, relations);

    if (result.created_by) {
      result.created_by = {
        id: result.created_by.id,
        name: result.created_by.name,
      } as User;
    }

    if (result.updated_by) {
      result.updated_by = {
        id: result.updated_by.id,
        name: result.updated_by.name,
      } as User;
    }

    return result;
  }
}
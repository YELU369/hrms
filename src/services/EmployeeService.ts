import { AppDataSource } from "@/data-source";
import { CreateDTO as EmployeeCreateDTO } from "@/DTOs/Employee/CreateDTO";
import { UpdateDTO as EmployeeUpdateDTO } from "@/DTOs/Employee/UpdateDTO";
import { UserRegisterDTO } from "@/DTOs/UserRegisterDTO";
import { Employee } from "@/entity/Employee";
import { EmployeeSalary } from "@/entity/EmployeeSalary";
import { EmployeeUser } from "@/entity/EmployeeUser";
import { Position } from "@/entity/Position";
import { User } from "@/entity/User";
import { WorkSchedule } from "@/entity/WorkSchedule";
import { WorkScheduleDetail } from "@/entity/WorkScheduleDetail";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { ServiceResult } from "@/ServiceResult";
import { UserService } from "./UserService";
import { PositionSalary } from "@/entity/PositionSalary";

export interface EmployeeListType {
  code: number,
  success: boolean,
  message: string,
  data: PaginationResult<Employee>[],
}

export interface EmployeeSearchParams {
  keyword?: string, 
  position_id?: number, 
  employment_type?: 'Full-time' | 'Part-time' | 'Contract', 
  joined_date?: string, 
}

export class EmployeeService {

  private static repo = AppDataSource.getRepository(Employee);
  private static userRepo = AppDataSource.getRepository(User);
  private static positionRepo = AppDataSource.getRepository(Position);

  static async getList(searchParams: EmployeeSearchParams = {}, page: number = 0, limit: number = 100): Promise<EmployeeListType> {

    const baseQuery = this.repo.createQueryBuilder('employee')
                              .innerJoin('employee.position', 'position')
                              .leftJoin('employee.updated_by', 'updater')
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
                                'position.title', 
                                'updater.id', 
                                'updater.name'
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
    const result = await paginator.paginate();
    
    return ServiceResult.success('Employees List', 200, result);
  }

  static async create(data: EmployeeCreateDTO, userId: number): Promise<ServiceResult> {

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      return ServiceResult.error('Invalid user!', 403);
    }
  
    const position = await this.positionRepo.findOneBy({ id: data.position_id });
    if (!position) {
      return ServiceResult.error('Invalid position!', 403);
    }
  
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {

      const employee = queryRunner.manager.create(Employee, {
        first_name: data.first_name,
        last_name: data.last_name,
        code: data.code,
        nrc: data.nrc,
        email: data.email,
        phone: data.phone,
        employment_type: data.employment_type,
        joined_date: data.joined_date,
        position: position,
        created_by: user,
        updated_by: user,
      });
  
      await queryRunner.manager.save(Employee, employee);
  
      const userData: UserRegisterDTO = {
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        password: employee.email,
        confirmed_password: employee.email
      };
  
      const userResult = await UserService.register(userData, queryRunner.manager);
      if (!userResult.success) {
        throw {
          status: userResult.code,
          message: userResult.message
        };
      }
  
      const binding = queryRunner.manager.create(EmployeeUser, {
        employee_id: employee.id,
        user_id: userResult.data.id,
        created_by: user,
        updated_by: user,
      });
  
      const salary = queryRunner.manager.create(EmployeeSalary, {
        employee: employee,
        salary: data.salary,
        start_from: employee.joined_date,
        created_by: user,
        updated_by: user,
      });
  
      await queryRunner.manager.save(EmployeeUser, binding);
      await queryRunner.manager.save(EmployeeSalary, salary);
      await queryRunner.manager.save(User, userResult.data);
  
      await queryRunner.commitTransaction();
      return ServiceResult.success('Employee was successfully stored.', 201);
  
    } catch (error) {

      console.log('Employee Service - Create: ', error);
      await queryRunner.rollbackTransaction();
      return ServiceResult.error('Something went wrong. Please try again later.');

    } finally {
      await queryRunner.release();
    }
  }  

  static async getDetailInfo(id: number): Promise<ServiceResult> {

    try {
      
      const employee = await this.repo.createQueryBuilder('employee')
                                      .innerJoin('employee.position', 'position')
                                      .leftJoin('employee.updated_by', 'updater')
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
                                        'position.title', 
                                        'updater.id', 
                                        'updater.name'
                                      ])
                                      .where('employee.id = :id', { id: id })
                                      .getOne();
      if (!employee) {
        return ServiceResult.error('Employee not found!', 404);
      }
  
      return ServiceResult.success('Employee Show', 200, employee);

    } catch (error) {

      console.log('Employee Service - View: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async update(id: number, userId: number, data: EmployeeUpdateDTO): Promise<ServiceResult> {

    const employee = await this.repo.findOneBy({ id: id });
    if (!employee) {
      return ServiceResult.error('Employee not found!', 404);
    }

    const position = await this.positionRepo.findOneBy({ id: data.position_id });
    if (!position) {
      return ServiceResult.error('Position not found!', 404);
    }

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      return ServiceResult.error('Invalid user!', 403);
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      Object.assign(employee, {
        first_name: data.first_name ?? employee.first_name,
        last_name: data.last_name ?? employee.last_name,
        code: data.code ?? employee.code,
        nrc: data.nrc ?? employee.nrc,
        email: data.email ?? employee.email,
        phone: data.phone ?? employee.phone,
        employment_type: data.employment_type ?? employee.employment_type,
        joined_date: data.joined_date ?? employee.joined_date,
        position,
        updated_by: user
      });

      await queryRunner.manager.save(Employee, employee);

      const bindingRepo = queryRunner.manager.getRepository(EmployeeUser);
      const binding = await bindingRepo.findOne({
        where: { employee: { id: employee.id } },
        relations: ['user']
      });

      if (binding?.user) {
        binding.user.name = `${employee.first_name} ${employee.last_name}`;
        binding.user.email = employee.email;
        await queryRunner.manager.save(User, binding.user);
      }

      const salaryRepo = queryRunner.manager.getRepository(EmployeeSalary);
      const employeeSalary = await salaryRepo.createQueryBuilder('salary')
                                            .innerJoin('salary.employee', 'employee')
                                            .where('employee.id = :id', { id: employee.id })
                                            .orderBy('salary.start_from', 'DESC')
                                            .getOne();

      if (employeeSalary) {
        employeeSalary.salary = data.salary;
        employeeSalary.start_from = employee.joined_date;
        await queryRunner.manager.save(EmployeeSalary, employeeSalary);
      }

      await queryRunner.commitTransaction();
      return ServiceResult.success('Employee was successfully updated.');

    } catch (error) {

      await queryRunner.rollbackTransaction();
      console.log('Employee Service - Update:', error);
      return ServiceResult.error('Something went wrong. Please try again later.');

    } finally {
      await queryRunner.release();
    }
  }

  static async delete(id: number): Promise<ServiceResult> {

    try {

      const employee = await this.repo.findOne({
        where: { id: id }
      });
  
      if (!employee) {
        return ServiceResult.error('Employee not found!', 404);
      }
      
      await this.repo.remove(employee);

      return ServiceResult.success('Employee was successfully deleted.');

    } catch (error) {

      console.log('Employee Service - Delete: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }
}
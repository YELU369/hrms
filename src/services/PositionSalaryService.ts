import { AppDataSource } from "@/data-source";
import { CreateDTO as SalaryCreateDTO } from "@/DTOs/Position/Salary/CreateDTO";
import { UpdateDTO as SalaryUpdateDTO } from "@/DTOs/Position/Salary/UpdateDTO";
import { Department } from "@/entity/Department";
import { Position } from "@/entity/Position";
import { PositionSalary } from "@/entity/PositionSalary";
import { User } from "@/entity/User";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { ServiceResult } from "@/ServiceResult";

export interface PositionSalaryListType {
  code: number,
  success: boolean,
  message: string,
  data: PaginationResult<Position>[],
}

export interface PositionSalarySearchParams {
  position_id?: number, 
}

export class PositionSalaryService {

  private static repo = AppDataSource.getRepository(PositionSalary);
  private static userRepo = AppDataSource.getRepository(User);
  private static positionRepo = AppDataSource.getRepository(Position);
  private static deptRepo = AppDataSource.getRepository(Department);

  static async getList(searchParams: PositionSalarySearchParams = {}, page: number = 0, limit: number = 100): Promise<PositionSalaryListType> {

    const baseQuery = this.repo.createQueryBuilder('salary')
                    .innerJoin('salary.position', 'position')
                    .leftJoin('salary.updated_by', 'updater')
                    .select([
                      'salary.id', 
                      'salary.min_salary', 
                      'salary.max_salary', 
                      'salary.start_from', 
                      'salary.updated_at', 
                      'position.id', 
                      'position.title', 
                      'updater.id', 
                      'updater.name'
                    ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.position_id, query =>
                      query.andWhere('salary.position_id = :position_id', { position_id: `${searchParams.position_id}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    const result = await paginator.paginate();

    return ServiceResult.success('Position Salaries List', 200, result);
  }

  static async create(data: SalaryCreateDTO, userId: number): Promise<ServiceResult> {

    try {

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      const position = await this.positionRepo.findOneBy({ id: data.position_id });
      if (!position) {
        return ServiceResult.error('Invalid position!', 403);
      }

      const Position = this.repo.create({
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        start_from: data.start_from,
        position: position,
        created_by: user,
        updated_by: user,
      });

      await this.repo.save(Position);

      return ServiceResult.success('Salary was successfully stored.', 201);

    } catch (error) {

      console.log('Position Salary Service - Create: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async getDetailInfo(id: number): Promise<ServiceResult> {

    try {
      
      const salary = await this.repo.createQueryBuilder('salary')
                                      .innerJoin('salary.position', 'position')
                                      .leftJoin('salary.updated_by', 'updater')
                                      .select([
                                        'salary.id', 
                                        'salary.min_salary', 
                                        'salary.max_salary', 
                                        'salary.start_from', 
                                        'salary.updated_at', 
                                        'position.id', 
                                        'position.title', 
                                        'updater.id', 
                                        'updater.name'
                                      ])
                                      .where('salary.id = :id', { id: id })
                                      .getOne();
      if (!salary) {
        return ServiceResult.error('Salary not found!', 404);
      }

      const formattedPosition = {
        ...salary,
        position: {
          id: salary.position.id,
          name: salary.position.title
        }, 
        updated_by: {
          id: salary.updated_by.id,
          name: salary.updated_by.name
        }
      };
  
      return ServiceResult.success('Position Salary Show', 200, formattedPosition);

    } catch (error) {

      console.log('Position Salary Service - View: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async update(id: number, userId: number, data: SalaryUpdateDTO): Promise<ServiceResult> {

    try {

      const salary = await this.repo.findOneBy({ id: id });
      if (!salary) {
        return ServiceResult.error('Salary not found!', 404);
      }

      const position = await this.positionRepo.findOneBy({ id: data.position_id });
      if (!position) {
        return ServiceResult.error('Position not found!', 404);
      }

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      salary.min_salary = data.min_salary ?? salary.min_salary;
      salary.max_salary = data.max_salary ?? salary.max_salary;
      salary.start_from = data.start_from ?? salary.start_from;
      salary.position = position;
      salary.updated_by = user;

      await this.repo.save(salary);
      return ServiceResult.success('Salary was successfully updated.');

    } catch (error) {
      
      console.log('Position Salary Service - Update: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async delete(id: number): Promise<ServiceResult> {

    try {

      const salary = await this.repo.findOne({
        where: { id: id }
      });
  
      if (!salary) {
        return ServiceResult.error('Salary not found!', 404);
      }
      
      await this.repo.remove(salary);

      return ServiceResult.success('Position was successfully deleted.');

    } catch (error) {

      console.log('Position Salary Service - Delete: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }
}
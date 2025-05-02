import { AppDataSource } from "@/data-source";
import { CreateDTO as DeptCreateDTO } from "@/DTOs/Department/CreateDTO";
import { UpdateDTO as DeptUpdateDTO } from "@/DTOs/Department/UpdateDTO";
import { Department } from "@/entity/Department";
import { User } from "@/entity/User";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { ServiceResult } from "@/ServiceResult";

export interface DeptListType {
  code: number,
  success: boolean,
  message: string,
  data: PaginationResult<Department>[],
}

export interface DeptSearchParams {
  keyword?: string
}

export class DepartmentService {

  private static repo = AppDataSource.getRepository(Department);
  private static userRepo = AppDataSource.getRepository(User);

  static async getList(searchParams: DeptSearchParams = {}, page: number = 0, limit: number = 100): Promise<DeptListType> {

    const baseQuery = this.repo.createQueryBuilder('dept')
                    .leftJoin('dept.updated_by', 'updater')
                    .select([
                      'dept.id', 
                      'dept.name', 
                      'dept.description', 
                      'dept.updated_at', 
                      'updater.id', 
                      'updater.name'
                    ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.keyword, query =>
                      query.andWhere('dept.name LIKE :name', { name: `%${searchParams.keyword}%` })
                        .orWhere('dept.description LIKE :name', { name: `%${searchParams.keyword}%` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    const result = await paginator.paginate();

    const formattedResult = result.list.map(department => {
      return {
        ...department,
        updated_by: {
          id: department.updated_by.id,
          name: department.updated_by.name
        }
      };
    });

    return ServiceResult.success('Departments List', 200, formattedResult);
  }

  static async create(data: DeptCreateDTO, userId: number): Promise<ServiceResult> {

    try {

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      const department = this.repo.create({
        name: data.name,
        description: data.description,
        created_by: user,
        updated_by: user,
      });

      await this.repo.save(department);

      return ServiceResult.success('Department was successfully stored.', 201);

    } catch (error) {

      console.log('Department Service - Create: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async getDetailInfo(departmentId: number): Promise<ServiceResult> {

    try {
      
      const department = await this.repo.createQueryBuilder('dept')
                                      .leftJoinAndSelect('dept.updated_by', 'updater')
                                      .select([
                                        'dept.id',
                                        'dept.name',
                                        'dept.description',
                                        'dept.updated_at',
                                        'updater.id',
                                        'updater.name'
                                      ])
                                      .where('dept.id = :id', { id: departmentId })
                                      .getOne();
      if (!department) {
        return ServiceResult.error('Department not found!');
      }

      const formattedDepartment = {
        ...department,
        updated_by: {
          id: department.updated_by.id,
          name: department.updated_by.name
        }
      };
  
      return ServiceResult.success('Department Show', 200, formattedDepartment);

    } catch (error) {

      console.log('Department Service - View: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async update(departmentId: number, userId: number, data: DeptUpdateDTO): Promise<ServiceResult> {

    try {

      const department = await this.repo.findOneBy({ id: departmentId });
      if (!department) {
        return ServiceResult.error('Department not found!');
      }

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      department.name = data.name ?? department.name;
      department.description = data.description ?? department.description;
      department.updated_by = user;

      await this.repo.save(department);
      return ServiceResult.success('Department was successfully updated.');

    } catch (error) {
      
      console.log('Department Service - Update: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async delete(departmentId: number): Promise<ServiceResult> {

    try {

      const department = await this.repo.findOne({
        where: { id: departmentId }
      });
  
      if (!department) {
        return ServiceResult.error('Department not found!');
      }
      
      await this.repo.remove(department);

      return ServiceResult.success('Department was successfully deleted.');

    } catch (error) {

      console.log('Department Service - Delete: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }
}
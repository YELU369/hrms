import { AppDataSource } from "@/data-source";
import { CreateDTO as PositionCreateDTO } from "@/DTOs/Position/CreateDTO";
import { UpdateDTO as PositionUpdateDTO } from "@/DTOs/Position/UpdateDTO";
import { Department } from "@/entity/Department";
import { Position } from "@/entity/Position";
import { User } from "@/entity/User";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { ServiceResult } from "@/ServiceResult";

export interface PositionListType {
  code: number,
  success: boolean,
  message: string,
  data: PaginationResult<Position>[],
}

export interface PositionSearchParams {
  keyword?: string, 
  department_id?: number, 
  is_manager?: boolean
}

export class PositionService {

  private static repo = AppDataSource.getRepository(Position);
  private static userRepo = AppDataSource.getRepository(User);
  private static deptRepo = AppDataSource.getRepository(Department);

  static async getList(searchParams: PositionSearchParams = {}, page: number = 0, limit: number = 100): Promise<PositionListType> {

    const baseQuery = this.repo.createQueryBuilder('position')
                    .innerJoin('position.department', 'department')
                    .leftJoin('position.updated_by', 'updater')
                    .select([
                      'position.id', 
                      'position.title', 
                      'position.description', 
                      'position.is_manager', 
                      'position.updated_at', 
                      'department.id', 
                      'department.name', 
                      'updater.id', 
                      'updater.name'
                    ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.keyword, query =>
                      query.andWhere('position.title LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('position.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                    )
                    .when(!!searchParams.department_id, query =>
                      query.andWhere('position.department_id = :department_id', { department_id: `${searchParams.department_id}` })
                    )
                    .when(!!searchParams.is_manager, query =>
                      query.andWhere('position.is_manager = :is_manager', { is_manager: `${searchParams.is_manager}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    const result = await paginator.paginate();

    const formattedResult = result.list.map(position => {
      return {
        ...position,
        department: {
          id: position.department.id,
          name: position.department.name
        }, 
        updated_by: {
          id: position.updated_by.id,
          name: position.updated_by.name
        }
      };
    });

    return ServiceResult.success('Positions List', 200, formattedResult);
  }

  static async create(data: PositionCreateDTO, userId: number): Promise<ServiceResult> {

    try {

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      const department = await this.deptRepo.findOneBy({ id: data.department_id });
      if (!department) {
        return ServiceResult.error('Invalid department!', 403);
      }

      const position = this.repo.create({
        title: data.title,
        is_manager: data.is_manager,
        description: data.description,
        department: department,
        created_by: user,
        updated_by: user,
      });

      await this.repo.save(position);

      return ServiceResult.success('Position was successfully stored.', 201);

    } catch (error) {

      console.log('Position Service - Create: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async getDetailInfo(id: number): Promise<ServiceResult> {

    try {
      
      const position = await this.repo.createQueryBuilder('position')
                                      .innerJoin('position.department', 'department')
                                      .leftJoin('position.updated_by', 'updater')
                                      .select([
                                        'position.id', 
                                        'position.title', 
                                        'position.description', 
                                        'position.is_manager', 
                                        'position.updated_at', 
                                        'department.id', 
                                        'department.name', 
                                        'updater.id', 
                                        'updater.name'
                                      ])
                                      .where('position.id = :id', { id: id })
                                      .getOne();
      if (!position) {
        return ServiceResult.error('Position not found!', 404);
      }

      const formattedPosition = {
        ...position,
        department: {
          id: position.department.id,
          name: position.department.name
        }, 
        updated_by: {
          id: position.updated_by.id,
          name: position.updated_by.name
        }
      };
  
      return ServiceResult.success('Position Show', 200, formattedPosition);

    } catch (error) {

      console.log('Position Service - View: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async update(id: number, userId: number, data: PositionUpdateDTO): Promise<ServiceResult> {

    try {

      const position = await this.repo.findOneBy({ id: id });
      if (!position) {
        return ServiceResult.error('Position not found!', 404);
      }

      const department = await this.deptRepo.findOneBy({ id: data.department_id });
      if (!department) {
        return ServiceResult.error('Department not found!', 404);
      }

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      position.title = data.title ?? position.title;
      position.is_manager = data.is_manager ?? position.is_manager;
      position.description = data.description ?? position.description;
      position.department = department;
      position.updated_by = user;

      await this.repo.save(position);
      return ServiceResult.success('Position was successfully updated.');

    } catch (error) {
      
      console.log('Position Service - Update: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async delete(id: number): Promise<ServiceResult> {

    try {

      const position = await this.repo.findOne({
        where: { id: id }
      });
  
      if (!position) {
        return ServiceResult.error('Position not found!', 404);
      }
      
      await this.repo.remove(position);

      return ServiceResult.success('Position was successfully deleted.');

    } catch (error) {

      console.log('Position Service - Delete: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }
}
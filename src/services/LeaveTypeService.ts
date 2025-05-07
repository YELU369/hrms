import { AppDataSource } from "@/data-source";
import { CreateDTO as LeaveTypeCreateDTO } from "@/DTOs/LeaveType/CreateDTO";
import { UpdateDTO as LeaveTypeUpdateDTO } from "@/DTOs/LeaveType/UpdateDTO";
import { LeaveType } from "@/entity/LeaveType";
import { User } from "@/entity/User";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { ServiceResult } from "@/ServiceResult";

export interface LeaveTypeListType {
  code: number,
  success: boolean,
  message: string,
  data: PaginationResult<LeaveType>[],
}

export interface LeaveTypeSearchParams {
  keyword?: string, 
  is_paid?: boolean
}

export class LeaveTypeService {

  private static repo = AppDataSource.getRepository(LeaveType);
  private static userRepo = AppDataSource.getRepository(User);

  static async getList(searchParams: LeaveTypeSearchParams = {}, page: number = 0, limit: number = 100): Promise<LeaveTypeListType> {

    const baseQuery = this.repo.createQueryBuilder('leaveType')
                    .leftJoin('leaveType.updated_by', 'updater')
                    .select([
                      'leaveType.id', 
                      'leaveType.name', 
                      'leaveType.description', 
                      'leaveType.is_paid', 
                      'leaveType.max_days_per_year', 
                      'leaveType.carry_over_days', 
                      'leaveType.updated_at', 
                      'updater.id', 
                      'updater.name'
                    ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.keyword, query =>
                      query.andWhere('leaveType.name LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('leaveType.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                    )
                    .when(!!searchParams.is_paid, query =>
                      query.andWhere('leaveType.is_paid = :is_paid', { is_paid: `${searchParams.is_paid}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    const result = await paginator.paginate();
    
    return ServiceResult.success('Leave Types List', 200, result);
  }

  static async create(data: LeaveTypeCreateDTO, userId: number): Promise<ServiceResult> {

    try {

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      const leaveType = this.repo.create({
        name: data.name,
        description: data.description,
        is_paid: data.is_paid,
        max_days_per_year: data.max_days_per_year,
        carry_over_days: data.carry_over_days,
        created_by: user,
        updated_by: user,
      });

      await this.repo.save(leaveType);

      return ServiceResult.success('Leave type was successfully stored.', 201);

    } catch (error) {

      console.log('Leave Type Service - Create: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async getDetailInfo(id: number): Promise<ServiceResult> {

    try {
      
      const leaveType = await this.repo.createQueryBuilder('leaveType')
                                      .leftJoin('leaveType.updated_by', 'updater')
                                      .select([
                                        'leaveType.id', 
                                        'leaveType.name', 
                                        'leaveType.description', 
                                        'leaveType.is_paid', 
                                        'leaveType.max_days_per_year', 
                                        'leaveType.carry_over_days', 
                                        'leaveType.updated_at', 
                                        'updater.id', 
                                        'updater.name'
                                      ])
                                      .where('leaveType.id = :id', { id: id })
                                      .getOne();
      if (!leaveType) {
        return ServiceResult.error('Leave type not found!', 404);
      }
  
      return ServiceResult.success('Leave Type Show', 200, leaveType);

    } catch (error) {

      console.log('Leave Type Service - View: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async update(id: number, userId: number, data: LeaveTypeUpdateDTO): Promise<ServiceResult> {

    try {

      const leaveType = await this.repo.findOneBy({ id: id });
      if (!leaveType) {
        return ServiceResult.error('Leave type not found!', 404);
      }

      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        return ServiceResult.error('Invalid user!', 403);
      }

      leaveType.name = data.name ?? leaveType.name;
      leaveType.description = data.description ?? leaveType.description;
      leaveType.is_paid = data.is_paid ?? leaveType.is_paid;
      leaveType.max_days_per_year = data.max_days_per_year ?? leaveType.max_days_per_year;
      leaveType.carry_over_days = data.carry_over_days ?? leaveType.carry_over_days;
      leaveType.updated_by = user;

      await this.repo.save(leaveType);
      return ServiceResult.success('Leave type was successfully updated.');

    } catch (error) {
      
      console.log('Leave Type Service - Update: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }

  static async delete(id: number): Promise<ServiceResult> {

    try {

      const leaveType = await this.repo.findOne({
        where: { id: id }
      });
  
      if (!leaveType) {
        return ServiceResult.error('Leave type not found!', 404);
      }
      
      await this.repo.remove(leaveType);

      return ServiceResult.success('Leave type was successfully deleted.');

    } catch (error) {

      console.log('Leave Type Service - Delete: ', error);
      return ServiceResult.error('Something went wrong. Please try again later.');
    }
  }
}
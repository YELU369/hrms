import { BaseRepository } from "@/repositories/BaseRepository";
import { Holiday } from "@/entity/Holiday";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export interface HolidaySearchParams {
  keyword?: string, 
  start_from?: Date,
  end_to?: Date,
}

export class HolidayRepository extends BaseRepository<Holiday> {

  public manager: EntityManager;
  
  constructor(manager?: EntityManager) {
    super(Holiday, manager);
  }

  async getList(searchParams: HolidaySearchParams, page: number = 0, limit: number = 100): Promise<PaginationResult<Holiday>> {
    
    const baseQuery = this.repo.createQueryBuilder('holiday')
                              .select([
                                'holiday.id', 
                                'holiday.title', 
                                'holiday.start_from', 
                                'holiday.end_to', 
                                'holiday.description', 
                                'holiday.updated_at'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                        .when(!!searchParams.keyword, query =>
                          query.andWhere('holiday.title LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                            .orWhere('holiday.description LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        )
                        .when(!!searchParams.start_from, query =>
                          query.andWhere('holiday.start_from >= :DATE(start_from)', { start_from: `${searchParams.start_from}` })
                        )
                        .when(!!searchParams.end_to, query =>
                          query.andWhere('holiday.end_to >= :DATE(end_to)', { end_to: `${searchParams.end_to}` })
                        );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

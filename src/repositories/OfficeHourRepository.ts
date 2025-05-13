import { BaseRepository } from "@/repositories/BaseRepository";
import { OfficeHour } from "@/entity/OfficeHour";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";
import { EntityManager } from "typeorm";

export class OfficeHourRepository extends BaseRepository<OfficeHour> {
  
  public manager: EntityManager;

  constructor(manager?: EntityManager) {
    super(OfficeHour, manager);
  }

  async getList(searchParams: any, page: number = 0, limit: number = 100): Promise<PaginationResult<OfficeHour>> {
    
    const baseQuery = this.repo.createQueryBuilder('officeHour')
                              .select([
                                'officeHour.id', 
                                'officeHour.work_from', 
                                'officeHour.work_to', 
                                'officeHour.updated_at'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery);

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

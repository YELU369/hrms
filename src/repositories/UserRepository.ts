import { BaseRepository } from "@/repositories/BaseRepository";
import { User } from "@/entity/User";
import { PaginationResult, Paginator } from "@/helpers/Paginator";
import { QueryBuilderWrapper } from "@/helpers/QueryBuilderWrapper";

export interface UserSearchParams {
  keyword?: string, 
  is_verified?: boolean
}

export class UserRepository extends BaseRepository<User> {
  
  constructor() {
    super(User);
  }

  async getList(searchParams: UserSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<User>> {
  
    const baseQuery = this.repo.createQueryBuilder('user')
                              .select([
                                'user.id', 
                                'user.name', 
                                'user.email', 
                                'user.is_verified'
                              ]);

    const wrapper = new QueryBuilderWrapper(baseQuery)
                    .when(!!searchParams.keyword, query =>
                      query.andWhere('user.name LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                        .orWhere('employee.email LIKE :keyword', { keyword: `%${searchParams.keyword}%` })
                    )
                    .when(!!searchParams.is_verified, query =>
                      query.andWhere('user.is_verified = :is_verified', { is_verified: `${searchParams.is_verified}` })
                    );

    const paginator = new Paginator(wrapper.getQuery(), page, limit);
    return await paginator.paginate();
  }
}

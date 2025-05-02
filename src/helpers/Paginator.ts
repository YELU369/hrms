import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  lastPage: number;
}

export class Paginator<T extends ObjectLiteral> {
  private readonly query: SelectQueryBuilder<T>;
  private readonly page: number;
  private readonly limit: number;

  constructor(query: SelectQueryBuilder<T>, page = 1, limit = 100) {
    this.query = query;
    this.page = page > 0 ? page : 1;
    this.limit = limit > 0 ? limit : 10;
  }

  async paginate(): Promise<PaginationResult<T>> {
    const [list, total] = await this.query
      .skip((this.page - 1) * this.limit)
      .take(this.limit)
      .getManyAndCount();

    return {
      list,
      total,
      page: this.page,
      lastPage: Math.ceil(total / this.limit),
    };
  }
}

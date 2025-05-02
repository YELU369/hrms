import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class QueryBuilderWrapper<T extends ObjectLiteral> {

  constructor(private query: SelectQueryBuilder<T>) {}

  when(condition: boolean, callback: (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>): this {
    if (condition) {
      this.query = callback(this.query);
    }
    return this;
  }

  getQuery(): SelectQueryBuilder<T> {
    return this.query;
  }
}
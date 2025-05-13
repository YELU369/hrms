import { BaseRepository } from "@/repositories/BaseRepository";
import { ObjectLiteral, DeepPartial, FindManyOptions, FindOptionsWhere, EntityManager } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseService<T extends ObjectLiteral> {
  
  protected repo: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repo = repository;
  }

  async getAll(options: FindManyOptions<T> = {}): Promise<Partial<T>[]> {
    return await this.repo.getAll(options);
  }

  async getById(id: number, fields: string[] = [], relations: string[] = []): Promise<Partial<T>> {
    return await this.repo.getById(id, fields, relations);
  }

  async store(data: DeepPartial<T>, userId: number): Promise<T> {
    return await this.repo.store(data, userId);
  }

  async update(id: number, data: DeepPartial<T>, userId: number): Promise<T> {
    return await this.repo.update(id, data, userId);
  }

  async delete(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }

  async findOneBy(fields: FindOptionsWhere<T>): Promise<T | null> {
    return await this.repo.findOneBy(fields);
  }

  async findManyBy(fields: FindOptionsWhere<T>, options: FindManyOptions<T> = {}): Promise<T[]> {
    return await this.repo.findManyBy(fields, options);
  }

  async exists(fields: FindOptionsWhere<T>): Promise<boolean> {
    return await this.repo.exists(fields);
  }

  async insert(dataArray: QueryDeepPartialEntity<T>[]): Promise<boolean> {
    return await this.repo.insert(dataArray);
  }

  async storeOrNew(where: FindOptionsWhere<T>, data: DeepPartial<T>, userId?: number): Promise<T> {
    return await this.repo.storeOrNew(where, data, userId);
  }
}

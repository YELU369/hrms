import { BaseRepository } from "@/repositories/BaseRepository";
import { ObjectLiteral, DeepPartial, FindManyOptions, FindOptionsWhere } from "typeorm";

export class BaseService<T extends ObjectLiteral> {
  
  protected repo: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repo = repository;
  }

  async getAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return await this.repo.getAll(options);
  }

  async getById(id: number, relations: string[] = []): Promise<T> {
    return await this.repo.getById(id, relations);
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
}

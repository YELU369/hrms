import { BaseService } from "@/services/BaseService";
import { Position } from "@/entity/Position";
import { PositionRepository, PositionSearchParams } from "@/repositories/PositionRepository";
import { PaginationResult } from "@/helpers/Paginator";
import { FindManyOptions } from "typeorm";
import { User } from "@/entity/User";

export class PositionService extends BaseService<Position> {

  public repo: PositionRepository;

  constructor() {
    super(new PositionRepository());
  }

  async getList(searchParams: PositionSearchParams = {}, page: number = 0, limit: number = 100): Promise<PaginationResult<Position>> {
    return await this.repo.getList(searchParams, page, limit);
  }

  async getAll(options: FindManyOptions<Position> = {}): Promise<Position[]> {
    return await this.repo.getAll(options);
  }

  async getById(id: number, relations: string[] = ['department', 'salaries', 'employees', 'created_by', 'updated_by']): Promise<Position> {
    
    const result = await this.repo.getById(id, relations);

    if (result.created_by) {
      result.created_by = {
        id: result.created_by.id,
        name: result.created_by.name,
      } as User;
    }

    if (result.updated_by) {
      result.updated_by = {
        id: result.updated_by.id,
        name: result.updated_by.name,
      } as User;
    }

    return result;
  }

  async store(data: Partial<Position>, userId: number): Promise<Position> {
    return await this.repo.store(data, userId);
  }

  async update(id: number, data: Partial<Position>, userId: number): Promise<Position> {
    return await this.repo.update(id, data, userId);
  }

  async delete(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }
}

import { Repository, FindManyOptions, DeepPartial, ObjectLiteral, FindOptionsWhere, EntityTarget, QueryFailedError, QueryRunner, EntityManager, FindOneOptions, FindOptionsSelectByString, FindOptionsSelect } from "typeorm";
import { AppDataSource } from "@/data-source";
import { NotFoundException } from "@/exceptions/NotFoundException";
import { User } from "@/entity/User";
import { UserService } from "@/services/UserService";
import { BadRequestException } from "@/exceptions/BadRequestException";
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends ObjectLiteral> {

  protected repo: Repository<T>;
  protected manager?: EntityManager;

  constructor(entity: EntityTarget<T>, manager?: EntityManager) {
    this.manager = manager;
    this.repo = manager
      ? manager.getRepository(entity)
      : AppDataSource.getRepository(entity);
  }

  private async customStore(data: DeepPartial<T>): Promise<T> {

    if (this.manager) {

      const entity = this.manager.withRepository(this.repo).create(data);
      return await this.manager.withRepository(this.repo).save(entity);

    } else {

      const entity = this.repo.create(data);
      return await this.repo.save(entity);
    }
  }

  private async customUpdate(id: number, data: DeepPartial<T>): Promise<T> {

    const entity = await this.getById(id);
    Object.assign(entity, data);

    if (this.manager) {
      return await this.manager.withRepository(this.repo).save(entity);
    }
    return await this.repo.save(entity);
  }

  async getAll(options: FindManyOptions<T> = {}): Promise<Partial<T>[]> {

    try {

      return await this.repo.find(options);

    } catch (exception) {

      console.error(`${this.constructor.name} - getAll:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async getById(id: number, fields: string[] = [], relations: string[] = []): Promise<T> {

    const options: FindOneOptions<T> = {
      where: { id } as any,
    };

    if (fields.length > 0) {
      options.select = fields.reduce((acc, field) => {
        acc[field as keyof T] = true;
        return acc;
      }, {} as Record<keyof T, true>) as unknown as FindOptionsSelect<T>;
    }
  
    if (relations.length > 0) {
      options.relations = relations;
    }

    try {

      const entity = await this.repo.findOne(options);

      if (!entity) {
        throw new NotFoundException(`${this.constructor.name.replace('Repository', '')} not found!`);
      }

      return entity;

    } catch (exception) {

      console.error(`${this.constructor.name} - getById:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async store(data: DeepPartial<T>, userId?: number): Promise<T> {

    try {

      if (!data) throw new NotFoundException('Payload not found!'); 

      if (userId) {

        const user = await AppDataSource.getRepository(User).findOneBy({id: userId});
        if (!user) throw new NotFoundException('Creator user not found!'); 
        
        data = {
          ...data,
          created_by: user,
          updated_by: user,
        };
      } 

      return this.customStore(data);

    } catch (exception) {
      
      console.error(`${this.constructor.name} - store:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async update(id: number, data: DeepPartial<T>, userId?: number): Promise<T> {

    try {

      if (userId) {
        
        const user = await AppDataSource.getRepository(User).findOneBy({id: userId});
        if (!user) throw new NotFoundException('Updater user not found!');

        data = {
          ...data,
          updated_by: user,
        };
      }

      return this.customUpdate(id, data);

    } catch (exception) {

      console.error(`${this.constructor.name} - update:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async delete(id: number): Promise<boolean> {

    try {

      const entity = await this.getById(id);
      await this.repo.remove(entity);

      return true;

    } catch (exception) {

      console.error(`${this.constructor.name} - delete:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async findOneBy(fields: FindOptionsWhere<T>): Promise<T | null> {

    try {

      return await this.repo.findOne({ where: fields });

    } catch (exception) {

      console.error(`${this.constructor.name} - findOneByFields:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async findManyBy(fields: FindOptionsWhere<T>, options: FindManyOptions<T> = {}): Promise<T[]> {

    try {

      return await this.repo.find({ where: fields, ...options });

    } catch (exception) {

      console.error(`${this.constructor.name} - findManyByFields:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async exists(fields: FindOptionsWhere<T>): Promise<boolean> {
    
    try {

      const count = await this.repo.count({ where: fields });
      return count > 0;

    } catch (exception) {
      
      console.error(`${this.constructor.name} - exists:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async storeOrNew(where: FindOptionsWhere<T>, data: DeepPartial<T>, userId?: number): Promise<T> {

    try {

      let entity = await this.repo.findOne({ where });

      if (entity) {
        return entity;
      }

      return await this.store(data, userId);

    } catch (exception) {

      console.error(`${this.constructor.name} - storeOrNew:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  async insert(dataArray: QueryDeepPartialEntity<T>[]): Promise<boolean> {

    try {

      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new BadRequestException('Payload must be a non-empty array.');
      }

      await this.repo.insert(dataArray);

      return true;

    } catch (exception) {
      
      console.error(`${this.constructor.name} - insert:`, exception);
      const message = this.getMySQLERRORMessage(exception);
      throw new BadRequestException(message);
    }
  }

  getMySQLERRORMessage(error: any): string {

    if (!error || !error.code) {
      return 'Unknown database error';
    }

    switch (error.errno) {
      case 1062: // Duplicate entry
        return 'Duplicate entry. The value you are trying to insert already exists.';
      case 1451: // Cannot delete or update a parent row
        return 'Cannot delete this item because it is being referenced elsewhere.';
      case 1452: // Cannot add or update child row: a foreign key constraint fails
        return 'Invalid reference. The related record does not exist.';
      case 1048: // Column cannot be null
        return `A required field is missing: ${error.sqlMessage}`;
      case 1054: // Unknown column
        return `Database field error: ${error.sqlMessage}`;
      case 1146: // Table doesn't exist
        return `A required database table is missing: ${error.sqlMessage}`;
      case 1364: // Field doesn't have a default value
        return `Missing required value: ${error.sqlMessage}`;
      case 1216: // Foreign key constraint fails (parent)
      case 1217: // Foreign key constraint fails (child)
        return 'Foreign key constraint error. Check related entities.';
      default:
        return `Database error [${error.errno}]: ${error.sqlMessage || error.message}`;
    }
  }
}

import { Repository, FindManyOptions, DeepPartial, ObjectLiteral, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "@/data-source";
import { NotFoundException } from "@/exceptions/NotFoundException";
import { User } from "@/entity/User";
import { UserService } from "@/services/UserService";

export class BaseRepository<T extends ObjectLiteral> {
  
  protected repo: Repository<T>;

  constructor(entity: { new (): T }) {
    this.repo = AppDataSource.getRepository(entity);
  }

  async getAll(options: FindManyOptions<T> = {}): Promise<T[]> {

    try {

      return await this.repo.find(options);

    } catch (exception) {

      console.error(`${this.constructor.name} - getAll:`, exception);
      throw exception;
    }
  }

  async getById(id: number, relations: string[] = []): Promise<T> {

    try {

      const entity = await this.repo.findOne({
        where: { id } as any,
        relations,
      });

      if (!entity) {
        throw new NotFoundException(`${this.constructor.name.replace('Repository', '')} not found!`);
      }

      return entity;

    } catch (exception) {

      console.error(`${this.constructor.name} - getById:`, exception);
      throw exception;
    }
  }

  async store(data: DeepPartial<T>, userId?: number): Promise<T> {

    console.log('USERID', userId);
    try {

      if (userId) {

        const user = await AppDataSource.getRepository(User).findOneBy({id: userId});
        if (!user) throw new NotFoundException('Creator user not found!'); 
        
        const entity = this.repo.create({
          ...data,
          created_by: user,
          updated_by: user,
        });

        return await this.repo.save(entity);

      } else {

        const entity = this.repo.create(data);
        return await this.repo.save(entity);
      }

    } catch (exception) {

      console.error(`${this.constructor.name} - create:`, exception);
      throw exception;
    }
  }

  async update(id: number, data: DeepPartial<T>, userId?: number): Promise<T> {

    try {

      if (userId) {
        
        const user = await AppDataSource.getRepository(User).findOneBy({id: userId});
        if (!user) throw new NotFoundException('Updater user not found!');

        const entity = await this.getById(id);  
        Object.assign(entity, {
          ...data,
          updated_by: user,
        });

        return await this.repo.save(entity);
        
      } else {

        const entity = await this.getById(id);  
        Object.assign(entity, data);

        return await this.repo.save(entity);
      }

    } catch (exception) {

      console.error(`${this.constructor.name} - update:`, exception);
      throw exception;
    }
  }

  async delete(id: number): Promise<boolean> {

    try {

      const entity = await this.getById(id);
      await this.repo.remove(entity);

      return true;

    } catch (exception) {

      console.error(`${this.constructor.name} - delete:`, exception);
      throw exception;
    }
  }

  async findOneBy(fields: FindOptionsWhere<T>): Promise<T | null> {

    try {

      return await this.repo.findOne({ where: fields });

    } catch (exception) {

      console.error(`${this.constructor.name} - findOneByFields:`, exception);
      throw exception;
    }
  }

  async findManyBy(fields: FindOptionsWhere<T>, options: FindManyOptions<T> = {}): Promise<T[]> {

    try {

      return await this.repo.find({ where: fields, ...options });

    } catch (exception) {

      console.error(`${this.constructor.name} - findManyByFields:`, exception);
      throw exception;
    }
  }

  async exists(fields: FindOptionsWhere<T>): Promise<boolean> {
    
    try {

      const count = await this.repo.count({ where: fields });
      return count > 0;

    } catch (exception) {
      
      console.error(`${this.constructor.name} - exists:`, exception);
      throw exception;
    }
  }
}

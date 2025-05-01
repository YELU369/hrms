import { Repository } from 'typeorm';
import { User } from "../entity/User";
import { AppDataSource } from '../data-source';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }
}
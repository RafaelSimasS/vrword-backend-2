import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = 'IUserRepository';

export interface IUserRepository {
  create(data: { email: string; password: string }): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}

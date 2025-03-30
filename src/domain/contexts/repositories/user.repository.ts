import { User } from '../aggregate/user.aggregate';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  save(user: User): Promise<void>;
}

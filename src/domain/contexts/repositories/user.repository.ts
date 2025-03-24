import { User } from '../aggregate/user.aggregate';

export interface IUserRepository {
  create(user: User): Promise<void>;
}

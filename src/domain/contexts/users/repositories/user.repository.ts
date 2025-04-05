import { User } from '../aggregate/user.aggregate';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  save(user: User): Promise<void>;
  existsUserByEmail(email: string): Promise<boolean>;
  findSecureAuthData(userId: string): Promise<User | null>;
  findAuthDataWithMFA(userId: string): Promise<User | null>;
  findAuthDataWithPassword(email: string): Promise<User | null>;
  findUserInfo(userId: string): Promise<User | null>;
  updateUserStatus(userId: string, status: string): Promise<void>;
}

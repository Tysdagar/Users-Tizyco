export interface IPasswordSecurityService {
  secure(password: string): string;
  check(password: string, savedPassword: string): boolean;
}

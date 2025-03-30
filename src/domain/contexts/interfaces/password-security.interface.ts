export const PASSWORD_SECURITY_SERVICE = Symbol('IPasswordSecurityService');
export interface IPasswordSecurityService {
  secure(password: string): Promise<string>;
  check(password: string, savedPassword: string): Promise<boolean>;
}

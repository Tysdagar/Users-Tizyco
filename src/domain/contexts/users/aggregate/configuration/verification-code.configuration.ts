import { VerificationUserData } from '../../types/user';

export class VerificationCodeGenerator {
  public static generate(userId: string): VerificationUserData {
    return {
      userId,
      code: this.code,
      expiresDate: this.expiresDate,
    };
  }

  public static checkIsExpired(expiresDate: Date): boolean {
    return Date.now() > expiresDate.getTime();
  }

  private static get code(): string {
    return Math.random().toString(36).substring(2, 14).toUpperCase();
  }

  private static get expiresDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 15); // Expira en 15 minutos
  }
}

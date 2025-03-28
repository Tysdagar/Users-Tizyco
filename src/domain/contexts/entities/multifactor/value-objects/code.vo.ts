/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { type MultifactorCodeData } from 'src/domain/contexts/types/user';

export class Code extends ValueObject<MultifactorCodeData> {
  private static readonly StandardTTL = 50;

  private constructor(code: number) {
    super({ code, TTL: Code.StandardTTL });
  }

  validate(value: MultifactorCodeData): boolean {
    return true;
  }

  public static create() {
    return new Code(Code.generateSixDigitCode());
  }

  private static generateSixDigitCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

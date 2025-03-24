import { randomUUID } from 'crypto';
import { Authentication } from '../entities/user-authentication.entity';
import { UserInformation } from '../entities/user-information.entity';
import { Multifactor } from '../entities/user-multifactor.entity';
import { ValueObjectErrorCollector } from 'src/domain/common/utils/vo-error-collector.util';

export class User {
  private constructor(
    private readonly userId: string,
    private readonly authentication: Authentication,
    private readonly information?: UserInformation,
    private readonly multifactors?: Multifactor[],
  ) {
    this.userId = userId;
    this.authentication = authentication;
    this.information = information;
    this.multifactors = multifactors;

    ValueObjectErrorCollector.triggerValidation();
  }

  public static create(email: string, password: string): User {
    return new User(randomUUID(), Authentication.create(email, password));
  }
}

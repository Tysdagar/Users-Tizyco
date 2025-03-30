import { User } from '../aggregate/user.aggregate';
import {
  IPasswordSecurityService,
  PASSWORD_SECURITY_SERVICE,
} from '../interfaces/password-security.interface';
import {
  ILoginAttemptService,
  LOGIN_ATTEMPTS_SERVICE,
} from '../interfaces/login-attempts.interface';
import { EntityService } from 'src/domain/common/abstract/entity-service.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';

@Injectable()
export class UserService extends EntityService<User> {
  constructor(
    @Inject(PASSWORD_SECURITY_SERVICE)
    private readonly passwordService: IPasswordSecurityService,
    @Inject(LOGIN_ATTEMPTS_SERVICE)
    private readonly loginAttemptsService: ILoginAttemptService,
    @Inject(EVENT_BUS) eventBus: IEventBus,
  ) {
    super(eventBus);
  }

  public async register(email: string, password: string): Promise<User> {
    return this.executeAsync(async () => {
      return await User.create(this.passwordService, email, password);
    });
  }

  public verifyAccount(): void {
    return this.executeSync(() => {
      this.entity.verify();
    });
  }

  public async login(password: string): Promise<void> {
    return this.executeAsync(async () => {
      await this.entity.tryLogin(
        this.loginAttemptsService,
        this.passwordService,
        password,
      );
    });
  }

  public validateMultifactorCode(code: number): void {
    return this.executeSync(() => {
      this.entity.validateMultifactorCode(code);
    });
  }
}

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
import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';
import {
  IVerificationUserService,
  VERIFICATION_USER_SERVICE,
} from '../interfaces/verification-account.interface';

@Injectable({ scope: Scope.REQUEST })
export class UserService extends EntityService<User> {
  constructor(
    @Inject(PASSWORD_SECURITY_SERVICE)
    private readonly passwordService: IPasswordSecurityService,
    @Inject(LOGIN_ATTEMPTS_SERVICE)
    private readonly loginAttemptsService: ILoginAttemptService,
    @Inject(VERIFICATION_USER_SERVICE)
    private readonly verificationUserService: IVerificationUserService,
    @Inject(EVENT_BUS) eventBus: IEventBus,
  ) {
    super(eventBus);
  }

  public async register(email: string, password: string): Promise<User> {
    return this.executeAsync(async () => {
      const user = await User.create(this.passwordService, email, password);
      this.configureEntity(user);
      return user;
    });
  }

  public async requestVerification() {
    return this.executeAsync(async () => {
      await this.entity.requestVerification(this.verificationUserService);
    });
  }

  public async verifyAccount(code: string): Promise<void> {
    return await this.executeAsync(async () => {
      await this.entity.verify(this.verificationUserService, code);
    });
  }

  public async login(password: string): Promise<void> {
    return this.executeAsync(async () => {
      await this.entity.login(
        this.loginAttemptsService,
        this.passwordService,
        password,
      );
    });
  }

  public validateMultifactorCode(code: number): void {
    return this.execute(() => {
      this.entity.validateMultifactorCode(code);
    });
  }
}

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
import {
  IVerificationUserService,
  VERIFICATION_USER_SERVICE,
} from '../interfaces/verification-account.interface';
import { UserAuthenticatedData } from '../types/user';

@Injectable()
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

  public initialize(entity: User): this {
    this.configureEntity(entity);
    return this;
  }

  public async register(email: string, password: string): Promise<User> {
    return this.execute(async () => {
      const user = await User.create(this.passwordService, email, password);
      this.configureEntity(user);
      return user;
    });
  }

  public async requestVerification() {
    return this.execute(async () => {
      await this.entity.requestVerification(this.verificationUserService);
    });
  }

  public async verifyAccount(code: string): Promise<void> {
    return await this.execute(async () => {
      await this.entity.verify(this.verificationUserService, code);
    });
  }

  public async authenticate(password: string): Promise<UserAuthenticatedData> {
    return this.execute(async () => {
      return await this.entity.authenticate(
        this.loginAttemptsService,
        this.passwordService,
        password,
      );
    });
  }

  public async validateMultifactorCode(code: number): Promise<void> {
    return await this.execute(() => {
      this.entity.validateMultifactorCode(code);
    });
  }
}

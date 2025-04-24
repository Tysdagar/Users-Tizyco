import { User } from '../aggregate/user.aggregate';
import {
  IPasswordSecurityService,
  PASSWORD_SECURITY_SERVICE,
} from '../interfaces/password-security.interface';
import {
  ISecureLoginService,
  SECURE_LOGIN_SERVICE,
} from '../interfaces/secure-login.interface';
import { EntityService } from 'src/domain/common/abstract/entity-service.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';
import {
  IVerificationUserService,
  VERIFICATION_USER_SERVICE,
} from '../interfaces/verification-user.interface';
import { UserAuthenticatedData } from '../types/user';
import { Multifactor } from '../entities/multifactor/user-multifactor.entity';
import {
  IUserBlockerService,
  USER_BLOCKER_SERVICE,
} from '../interfaces/user-blocker.interface';

@Injectable()
export class UserService extends EntityService<User> {
  constructor(
    @Inject(PASSWORD_SECURITY_SERVICE)
    private readonly passwordService: IPasswordSecurityService,
    @Inject(USER_BLOCKER_SERVICE)
    private readonly userBlockerService: IUserBlockerService,
    @Inject(SECURE_LOGIN_SERVICE)
    private readonly secureLoginService: ISecureLoginService,
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
      await this.entity.verifyUser(this.verificationUserService, code);
    });
  }

  public async authenticate(password: string): Promise<UserAuthenticatedData> {
    return this.execute(async () => {
      return await this.entity.authenticate(
        this.secureLoginService,
        this.passwordService,
        this.userBlockerService,
        password,
      );
    });
  }

  public async createMultifactorMethod(
    method: string,
    contact: string,
  ): Promise<Multifactor> {
    return this.execute(() => {
      return this.entity.addMultifactorMethod(method, contact);
    });
  }

  public async validateMultifactorCode(code: number): Promise<void> {
    return await this.execute(() => {
      this.entity.validateMultifactorCode(code);
    });
  }
}

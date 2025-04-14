import { EntityService } from 'src/domain/common/abstract/entity-service.abstract';
import { UserAuthenticatedData } from '../../users/types/user';
import {
  ITokenManagerService,
  TOKEN_MANAGER_SERVICE,
} from '../interfaces/token-manager.interface';
import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';
import {
  IUserSessionsManagerService,
  USER_SESSIONS_MANAGER_SERVICE,
} from '../interfaces/session-manager.interface';
import { AccessTokenData } from '../types/session';
import { UserSessions } from '../aggregate/user-sessions.aggregate';
import {
  FINGERPRINT_SERVICE,
  IFingerPrintService,
} from '../interfaces/device-info.interface';

@Injectable({ scope: Scope.REQUEST })
export class UserSessionsService extends EntityService<UserSessions> {
  constructor(
    @Inject(FINGERPRINT_SERVICE)
    private readonly fingerPrintService: IFingerPrintService,
    @Inject(USER_SESSIONS_MANAGER_SERVICE)
    private readonly userSessionsManagerService: IUserSessionsManagerService,
    @Inject(TOKEN_MANAGER_SERVICE)
    private readonly tokenManagerService: ITokenManagerService,
    @Inject(EVENT_BUS)
    eventBus: IEventBus,
  ) {
    super(eventBus);
  }

  public initialize(userSessions: UserSessions): this {
    this.configureEntity(userSessions);
    return this;
  }

  public async login(
    userData: UserAuthenticatedData,
  ): Promise<AccessTokenData> {
    return await this.execute(async () => {
      return await this.entity.startSession(
        this.tokenManagerService,
        this.userSessionsManagerService,
        this.fingerPrintService,
        userData,
      );
    });
  }

  public async logout(): Promise<void> {
    await this.execute(async () => {
      await this.entity.finishSession(
        this.userSessionsManagerService,
        this.fingerPrintService,
      );
    });
  }
}

import { EntityService } from 'src/domain/common/abstract/entity-service.abstract';
import { ExposedUserData } from '../../users/types/user';
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
    private readonly deviceInfoService: IFingerPrintService,
    @Inject(USER_SESSIONS_MANAGER_SERVICE)
    private readonly userSessionsManagerService: IUserSessionsManagerService,
    @Inject(TOKEN_MANAGER_SERVICE)
    private readonly tokenManagerService: ITokenManagerService,
    @Inject(EVENT_BUS)
    eventBus: IEventBus,
  ) {
    super(eventBus);
  }

  private async initialize(userId: string) {
    return await this.execute(async () => {
      const sessions = await this.userSessionsManagerService.getAll(userId);
      const userSessions = UserSessions.build(userId, sessions);
      this.configureEntity(userSessions);
    });
  }

  public async login(userData: ExposedUserData): Promise<AccessTokenData> {
    return await this.execute(async () => {
      await this.initialize(userData.userId);
      return await this.entity.startSession(
        this.tokenManagerService,
        this.userSessionsManagerService,
        this.deviceInfoService,
        userData,
      );
    });
  }
}

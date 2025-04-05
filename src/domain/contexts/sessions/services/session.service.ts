import { EntityService } from 'src/domain/common/abstract/entity-service.abstract';
import { Session } from '../aggregate/session.aggregate';
import { ExposedUserData } from '../../users/types/user';
import {
  ITokenManagerService,
  TOKEN_MANAGER_SERVICE,
} from '../interfaces/token-manager.interface';
import { Inject } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';

export class SessionService extends EntityService<Session> {
  constructor(
    @Inject(TOKEN_MANAGER_SERVICE)
    private readonly tokenManagerService: ITokenManagerService,
    @Inject(EVENT_BUS)
    eventBus: IEventBus,
  ) {
    super(eventBus);
  }

  public async create(userData: ExposedUserData) {
    return await this.execute(() => {
      return Session.create(this.tokenManagerService, userData);
    });
  }
}

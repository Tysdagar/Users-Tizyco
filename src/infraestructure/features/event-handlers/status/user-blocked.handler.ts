import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserBlockedEvent } from 'src/domain/contexts/users/aggregate/events/status/user-blocked.event';
import {
  ISecureLoginService,
  SECURE_LOGIN_SERVICE,
} from 'src/domain/contexts/users/interfaces/secure-login.interface';
import {
  IUserBlockerService,
  USER_BLOCKER_SERVICE,
} from 'src/domain/contexts/users/interfaces/user-blocker.interface';

@EventsHandler(UserBlockedEvent)
export class UserBlockedEventHandler
  implements IEventHandler<UserBlockedEvent>
{
  constructor(
    @Inject(USER_BLOCKER_SERVICE)
    private readonly userBlockerService: IUserBlockerService,
    @Inject(SECURE_LOGIN_SERVICE)
    private readonly secureLoginService: ISecureLoginService,
  ) {}

  public async handle(event: UserBlockedEvent): Promise<void> {
    await this.userBlockerService.blockUser(event.userId);
    await this.secureLoginService.resetAttempts(event.userId);
  }
}

import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUnblockedEvent } from 'src/domain/contexts/users/aggregate/events/status/user-unblocked.event';
import {
  ISecureLoginService,
  SECURE_LOGIN_SERVICE,
} from 'src/domain/contexts/users/interfaces/secure-login.interface';

@EventsHandler(UserUnblockedEvent)
export class UserUnblockedEventHandler
  implements IEventHandler<UserUnblockedEvent>
{
  constructor(
    @Inject(SECURE_LOGIN_SERVICE)
    private readonly loginAttemptService: ISecureLoginService,
  ) {}

  public async handle(event: UserUnblockedEvent): Promise<void> {
    await this.loginAttemptService.resetAttempts(event.userId);
  }
}

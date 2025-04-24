import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAuthenticatedEvent } from 'src/domain/contexts/users/aggregate/events/auth/user-authenticated.event';
import {
  ISecureLoginService,
  SECURE_LOGIN_SERVICE,
} from 'src/domain/contexts/users/interfaces/secure-login.interface';

@EventsHandler(UserAuthenticatedEvent)
export class UserAuthenticatedEventHandler
  implements IEventHandler<UserAuthenticatedEvent>
{
  constructor(
    @Inject(SECURE_LOGIN_SERVICE)
    private readonly loginAttemptService: ISecureLoginService,
  ) {}

  public async handle(event: UserAuthenticatedEvent): Promise<void> {
    await this.loginAttemptService.resetAttempts(event.userId);
  }
}

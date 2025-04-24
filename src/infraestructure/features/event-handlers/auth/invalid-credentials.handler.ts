import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserInvalidCredentialsEvent } from 'src/domain/contexts/users/aggregate/events/auth/invalid-credentials.event';
import {
  ISecureLoginService,
  SECURE_LOGIN_SERVICE,
} from 'src/domain/contexts/users/interfaces/secure-login.interface';

@EventsHandler(UserInvalidCredentialsEvent)
export class UserInvalidCredentialsEventHandler
  implements IEventHandler<UserInvalidCredentialsEvent>
{
  constructor(
    @Inject(SECURE_LOGIN_SERVICE)
    private readonly loginAttemptService: ISecureLoginService,
  ) {}

  public async handle(event: UserInvalidCredentialsEvent): Promise<void> {
    await this.loginAttemptService.recordFailedAttempt(event.userId);
  }
}

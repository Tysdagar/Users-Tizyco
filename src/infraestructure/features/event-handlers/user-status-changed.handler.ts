import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserStatusChangedEvent } from 'src/domain/contexts/aggregate/events/user-status-changed.event';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/contexts/repositories/user.repository';

@EventsHandler(UserStatusChangedEvent)
export class UserStatusChangedEventHandler
  implements IEventHandler<UserStatusChangedEvent>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  public async handle(event: UserStatusChangedEvent): Promise<void> {
    await this.userRepository.updateUserStatus(event.userId, event.status);
  }
}

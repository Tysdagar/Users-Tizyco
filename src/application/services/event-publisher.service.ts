import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';
import { User } from 'src/domain/contexts/aggregate/user.aggregate';
import { RegisteredUserEvent } from '../events/register-user.event';
import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

@Injectable()
export class UserEventPublisher {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  public registered(user: User) {
    this.publish(new RegisteredUserEvent(user.id, user.email));
  }

  private publish(event: IEvent): void {
    this.eventBus.publish(event);
  }
}

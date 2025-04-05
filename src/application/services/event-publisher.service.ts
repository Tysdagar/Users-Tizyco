import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_BUS,
  IEventBus,
} from 'src/domain/common/interfaces/concepts/event-bus.interface';
import { RegisteredUserEvent } from '../events/registered-user.event';
import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';
import { RequestedUserVerificationEvent } from '../events/requested-user-verification.event';
import { VerifiedUserEvent } from '../events/verified-user.event';
import { LoggedUserEvent } from '../events/logged_user.event';
import { SessionUserData } from 'src/domain/contexts/types/user';

@Injectable()
export class UserEventPublisher {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  public registered(userId: string, email: string) {
    this.publish(new RegisteredUserEvent(userId, email));
  }

  public requestedVerification(userId: string) {
    this.publish(new RequestedUserVerificationEvent(userId));
  }

  public verified(userId: string) {
    this.publish(new VerifiedUserEvent(userId));
  }

  public logged(userSessionData: SessionUserData) {
    this.publish(new LoggedUserEvent(userSessionData));
  }

  private publish(event: IEvent): void {
    this.eventBus.publish(event);
  }
}

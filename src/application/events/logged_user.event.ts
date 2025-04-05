import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';
import { type SessionUserData } from 'src/domain/contexts/types/user';

export class LoggedUserEvent implements IEvent {
  ocurredOn: Date;

  constructor(public readonly userSessionData: SessionUserData) {
    this.userSessionData = userSessionData;
    this.ocurredOn = new Date();
  }
}

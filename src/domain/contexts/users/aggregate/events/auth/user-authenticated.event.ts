import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

export class UserAuthenticatedEvent implements IEvent {
  ocurredOn: Date;

  constructor(public readonly userId: string) {
    this.userId = userId;
    this.ocurredOn = new Date();
  }
}

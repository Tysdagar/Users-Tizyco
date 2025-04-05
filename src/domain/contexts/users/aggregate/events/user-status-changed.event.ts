import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

export class UserStatusChangedEvent implements IEvent {
  ocurredOn: Date;

  constructor(
    public readonly userId: string,
    public readonly status: string,
  ) {
    this.userId = userId;
    this.status = status;
    this.ocurredOn = new Date();
  }
}

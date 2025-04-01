import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

export class InitalizedUserVerificationEvent implements IEvent {
  ocurredOn: Date;

  constructor(
    public readonly userId: string,
    public readonly code: string,
  ) {
    this.userId = userId;
    this.code = code;
    this.ocurredOn = new Date();
  }
}

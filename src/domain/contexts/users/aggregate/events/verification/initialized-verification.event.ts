import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

export class InitalizedUserVerificationEvent implements IEvent {
  ocurredOn: Date;

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {
    this.userId = userId;
    this.email = email;
    this.ocurredOn = new Date();
  }
}

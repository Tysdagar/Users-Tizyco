import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';
import { Multifactor } from '../../entities/multifactor/user-multifactor.entity';

export class MultifactorInitializedEvent implements IEvent {
  ocurredOn: Date;

  constructor(
    public readonly userId: string,
    public readonly multifactor: Multifactor,
  ) {
    this.userId = userId;
    this.multifactor = multifactor;
    this.ocurredOn = new Date();
  }
}

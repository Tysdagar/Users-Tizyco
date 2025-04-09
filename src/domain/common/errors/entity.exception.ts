import { DomainException } from './configuration/domain.exception';
import { getKeyFromValue } from '../utils/utils';
import { EntitiesTriggersExceptions } from 'src/domain/common/enums/entities-exceptions.enum';

export class DomainEntityException<
  TEntityExceptionMessages extends object,
> extends DomainException {
  private readonly _errorKey: keyof TEntityExceptionMessages;

  constructor(
    private readonly entityTrigger: EntitiesTriggersExceptions,
    exceptionMessages: TEntityExceptionMessages,
    selectedMessage: TEntityExceptionMessages[keyof TEntityExceptionMessages],
  ) {
    super(selectedMessage as string);
    this._errorKey = getKeyFromValue(exceptionMessages, selectedMessage);
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      entityTrigger: this.entityTrigger,
      errorKey: this._errorKey,
    };
  }

  public matchesErrorKey(errorKey: keyof TEntityExceptionMessages) {
    return this._errorKey === errorKey;
  }
}

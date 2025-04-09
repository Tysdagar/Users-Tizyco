import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { MultifactorExceptionMessages } from './multifactor-exceptions.enum';
import { EntitiesTriggersExceptions } from '../../../../../common/enums/entities-exceptions.enum';

export class MultifactorException extends DomainEntityException<
  typeof MultifactorExceptionMessages
> {
  constructor(errorKey: keyof typeof MultifactorExceptionMessages) {
    const message = MultifactorExceptionMessages[errorKey];
    super(
      EntitiesTriggersExceptions.MULTIFACTOR,
      MultifactorExceptionMessages,
      message,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

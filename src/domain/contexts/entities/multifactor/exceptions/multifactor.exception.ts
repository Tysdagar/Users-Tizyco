import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { EntitiesTriggersExceptions } from 'src/domain/contexts/enums/entities-exceptions.enum';
import { MultifactorExceptionMessages } from './multifactor-exceptions.enum';

export class MultifactorException extends DomainEntityException<
  typeof MultifactorExceptionMessages
> {
  constructor(message: MultifactorExceptionMessages) {
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

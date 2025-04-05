import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { InformationExceptionMessages } from './information-exceptions';
import { EntitiesTriggersExceptions } from '../../../enums/entities-exceptions.enum';

export class InformationException extends DomainEntityException<
  typeof InformationExceptionMessages
> {
  constructor(errorKey: keyof typeof InformationExceptionMessages) {
    const message = InformationExceptionMessages[errorKey];
    super(
      EntitiesTriggersExceptions.INFORMATION,
      InformationExceptionMessages,
      message,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { EntitiesTriggersExceptions } from 'src/domain/contexts/enums/entities-exceptions.enum';
import { InformationExceptionMessages } from './information-exceptions';

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

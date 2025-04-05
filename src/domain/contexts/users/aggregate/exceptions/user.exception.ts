import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { UserExceptionMessages } from './user-exceptions.enum';
import { EntitiesTriggersExceptions } from '../../enums/entities-exceptions.enum';

export class UserException extends DomainEntityException<
  typeof UserExceptionMessages
> {
  constructor(messageKey: keyof typeof UserExceptionMessages) {
    const selectedMessage = UserExceptionMessages[messageKey];
    super(
      EntitiesTriggersExceptions.USER,
      UserExceptionMessages,
      selectedMessage,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

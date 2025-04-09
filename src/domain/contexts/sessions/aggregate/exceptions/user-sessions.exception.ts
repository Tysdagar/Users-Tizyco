import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { UserSessionsExceptionMessages } from './user-sessions-exceptions.enum';
import { EntitiesTriggersExceptions } from 'src/domain/common/enums/entities-exceptions.enum';

export class UserSessionsException extends DomainEntityException<
  typeof UserSessionsExceptionMessages
> {
  constructor(messageKey: keyof typeof UserSessionsExceptionMessages) {
    const selectedMessage = UserSessionsExceptionMessages[messageKey];
    super(
      EntitiesTriggersExceptions.USER_SESSIONS,
      UserSessionsExceptionMessages,
      selectedMessage,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

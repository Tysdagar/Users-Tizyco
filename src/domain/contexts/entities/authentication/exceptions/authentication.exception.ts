import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { EntitiesTriggersExceptions } from 'src/domain/contexts/enums/entities-exceptions.enum';
import { AuthenticationExceptionMessages } from './authentication-exceptions.enum';

export class AuthenticationException extends DomainEntityException<
  typeof AuthenticationExceptionMessages
> {
  constructor(messageKey: keyof typeof AuthenticationExceptionMessages) {
    const selectedMessage = AuthenticationExceptionMessages[messageKey];
    super(
      EntitiesTriggersExceptions.AUTHENTICATION,
      AuthenticationExceptionMessages,
      selectedMessage,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

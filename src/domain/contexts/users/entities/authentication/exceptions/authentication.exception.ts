import { DomainEntityException } from 'src/domain/common/errors/entity.exception';
import { AuthenticationExceptionMessages } from './authentication-exceptions.enum';
import { EntitiesTriggersExceptions } from '../../../enums/entities-exceptions.enum';

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

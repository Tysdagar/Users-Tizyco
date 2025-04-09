import { ExceptionFactoryBase } from 'src/domain/common/abstract/exception-factory.abstract';
import { UserSessionsException } from './user-sessions.exception';
import { UserSessionsExceptionMessages } from './user-sessions-exceptions.enum';

class UserSessionsExceptionFactory extends ExceptionFactoryBase<
  typeof UserSessionsExceptionMessages,
  typeof UserSessionsException
> {
  constructor() {
    super(UserSessionsExceptionMessages, UserSessionsException, 'Sesiones');
  }
}

export const USER_SESSIONS_EXCEPTION_FACTORY =
  new UserSessionsExceptionFactory();

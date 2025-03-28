import { AuthenticationExceptionMessages } from './authentication-exceptions.enum';
import { AuthenticationException } from './authentication.exception';
import { ExceptionFactoryBase } from 'src/domain/common/abstract/exception-factory.abstract';

class AuthenticationExceptionFactory extends ExceptionFactoryBase<
  typeof AuthenticationExceptionMessages,
  typeof AuthenticationException
> {
  constructor() {
    super(
      AuthenticationExceptionMessages,
      AuthenticationException,
      'Autenticacion',
    );
  }
}

export const AUTH_EXCEPTION_FACTORY = new AuthenticationExceptionFactory();

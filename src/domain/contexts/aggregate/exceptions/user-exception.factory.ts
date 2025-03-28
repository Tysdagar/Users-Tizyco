import { UserException } from './user.exception';
import { UserExceptionMessages } from './user-exceptions.enum';
import { ExceptionFactoryBase } from 'src/domain/common/abstract/exception-factory.abstract';

class UserExceptionFactory extends ExceptionFactoryBase<
  typeof UserExceptionMessages,
  typeof UserException
> {
  constructor() {
    super(UserExceptionMessages, UserException, 'Usuario');
  }
}

export const USER_EXCEPTION_FACTORY = new UserExceptionFactory();

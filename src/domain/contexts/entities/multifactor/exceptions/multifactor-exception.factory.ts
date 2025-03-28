import { ExceptionFactoryBase } from 'src/domain/common/abstract/exception-factory.abstract';
import { MultifactorExceptionMessages } from './multifactor-exceptions.enum';
import { MultifactorException } from './multifactor.exception';

export class MultifactorExceptionFactory extends ExceptionFactoryBase<
  typeof MultifactorExceptionMessages,
  typeof MultifactorException
> {
  constructor() {
    super(MultifactorExceptionMessages, MultifactorException, 'Multifactor');
  }
}

export const MULTIFACTOR_EXCEPTION_FACTORY = new MultifactorExceptionFactory();

import { ExceptionFactoryBase } from 'src/domain/common/abstract/exception-factory.abstract';
import { InformationExceptionMessages } from './information-exceptions';
import { InformationException } from './information.exception';

export class InformationExceptionFactory extends ExceptionFactoryBase<
  typeof InformationExceptionMessages,
  typeof InformationException
> {
  constructor() {
    super(
      InformationExceptionMessages,
      InformationException,
      'Informacion Personal',
    );
  }
}

export const INFO_EXCEPTION_FACTORY = new InformationExceptionFactory();

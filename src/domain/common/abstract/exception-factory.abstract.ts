import { DomainEntityException } from '../errors/entity.exception';
import { ValidationException } from '../errors/validation.exception';

export abstract class ExceptionFactoryBase<
  Messages extends Record<string, string>,
  Exception extends new (message: string) => DomainEntityException<Messages>,
> {
  constructor(
    private readonly messages: Messages,
    private readonly exceptionRef: Exception,
    private readonly field: string,
  ) {
    this.messages = messages;
    this.exceptionRef = exceptionRef;
    this.field = field;
  }

  public throw(errorKey: keyof Messages): never | Exception {
    const message = this.messages[errorKey];
    throw new this.exceptionRef(message);
  }

  public throwValidation(errorKey: keyof Messages): never {
    const message = this.messages[errorKey];
    throw new ValidationException([{ field: this.field, message }]);
  }
}

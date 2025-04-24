import { DomainEntityException } from '../errors/entity.exception';
import { ValidationException } from '../errors/validation.exception';

export abstract class ExceptionFactoryBase<
  Messages extends Record<string, string>,
  Exception extends new (
    message: keyof Messages,
  ) => DomainEntityException<Messages>,
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

  public new(errorKey: keyof Messages): never | Exception {
    throw new this.exceptionRef(errorKey);
  }

  public throwValidation(errorKey: keyof Messages): never | Exception {
    const message = this.messages[errorKey];
    throw new ValidationException([{ field: this.field, message }]);
  }
}

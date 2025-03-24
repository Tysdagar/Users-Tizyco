import { Inject, Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core/injector';
import { Command, Query } from '@nestjs/cqrs';
import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { ValidationError } from 'src/domain/common/errors/validation.error';
import {
  IValidationService,
  VALIDATORS,
} from 'src/domain/common/interfaces/validation-service.interface';

/**
 * Validation service to execute request validation using custom validators.
 * This service works with commands or queries and ensures the validity of the requests.
 *
 * @template Request - Type of the request, extending `Command` or `Query`.
 */
@Injectable()
export class ValidationService<Request extends Command<any> | Query<any>>
  implements IValidationService<Request>
{
  /**
   * The validator associated with the current request type.
   */
  private validator: CustomValidator<Request>;

  /**
   * Initializes the service with a map of validators and a module reference for dependency injection.
   *
   * @param validators - A map of request types to their corresponding validator types.
   * @param moduleRef - The module reference used to resolve dependencies dynamically.
   */
  constructor(
    @Inject(VALIDATORS)
    private readonly validators: Map<
      Type<Request>,
      Type<CustomValidator<Request>>
    >,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Sets the request type by associating it with its validator.
   *
   * @param request - The request instance to validate.
   * @throws {Error} If no validator is found for the request type.
   */
  public async setRequestType(request: Request): Promise<void> {
    const requestType = request.constructor as Type<Request>;
    const validator = this.validators.get(requestType);

    if (!validator) {
      throw new Error(`No validator found for ${requestType.name}`);
    }

    this.validator = await this.moduleRef.get(validator, { strict: false });
  }

  /**
   * Executes the validation guard for the provided request.
   * Throws a `ValidationError` if validation fails.
   *
   * @param request - The request instance to validate.
   * @throws {ValidationError} If the request fails validation.
   */
  public async executeValidationGuard(request: Request): Promise<void> {
    try {
      await this.setRequestType(request);

      const isInvalid = await this.validator.validate(request);

      if (isInvalid) {
        throw new ValidationError(this.validator.getFailures());
      }
    } finally {
      this.validator.cleanFailures();
    }
  }

  /**
   * Retrieves validated data from the executed validator.
   *
   * @template Data - The type of the validated data.
   * @returns The validated data.
   */
  public retrieveValidatedData<Data>(): Data {
    return this.validator.getValidatedData<Data>();
  }
}

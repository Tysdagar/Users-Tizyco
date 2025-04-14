import { IUseCase } from 'src/domain/common/interfaces/concepts/use-case';
import {
  ConfiguredServicesCollection,
  IValidationService,
} from 'src/domain/common/interfaces/services/validation-service.interface';

export abstract class UseCase<
  TRequest,
  TResult,
  TServices extends ConfiguredServicesCollection = ConfiguredServicesCollection,
> implements IUseCase<TRequest, TResult>
{
  protected services: TServices;

  constructor(
    private readonly validationService: IValidationService<TRequest>,
  ) {}

  public async execute(request: TRequest): Promise<TResult> {
    await this.validationService.executeValidationGuard(request);

    const services =
      this.validationService.retrieveConfiguredDomainServices<TServices>();

    if (services) {
      this.services = services;
    }

    return this.handle(request);
  }

  protected abstract handle(request: TRequest): Promise<TResult>;
}

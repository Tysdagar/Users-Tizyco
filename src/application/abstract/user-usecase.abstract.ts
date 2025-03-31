import { IUseCase } from 'src/domain/common/interfaces/concepts/use-case';
import { IValidationService } from 'src/domain/common/interfaces/services/validation-service.interface';
import { User } from 'src/domain/contexts/aggregate/user.aggregate';
import { UserService } from 'src/domain/contexts/services/user.service';

export abstract class UserUseCase<TRequest, TResult>
  implements IUseCase<TRequest, TResult>
{
  constructor(
    private readonly validationService: IValidationService<TRequest>,
    protected readonly userService: UserService,
  ) {}

  public async execute(request: TRequest): Promise<TResult> {
    await this.validationService.executeValidationGuard(request);

    const user = this.validationService.retrieveValidatedData<User>();

    if (user) {
      this.userService.configureEntity(user);
    }

    return this.handle(request);
  }

  protected abstract handle(request: TRequest): Promise<TResult>;
}

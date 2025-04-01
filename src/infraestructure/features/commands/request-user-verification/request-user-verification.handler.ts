import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestUserVerificationCommand } from './request-user-verification.command';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { RequestUserVerificationRequest } from 'src/application/use-cases/request-verification/request-user-verification.request';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-verification/request-user-verification.usecase';

@CommandHandler(RequestUserVerificationCommand)
export class RequestUserVerificationCommandHandler
  implements ICommandHandler<RequestUserVerificationCommand>
{
  constructor(
    private readonly requestVerificationUseCase: RequestUserVerificationUseCase,
  ) {}

  public async execute(
    command: RequestUserVerificationCommand,
  ): Promise<Response<string>> {
    const { userId } = command.request;

    const request = new RequestUserVerificationRequest(userId);

    return await this.requestVerificationUseCase.execute(request);
  }
}

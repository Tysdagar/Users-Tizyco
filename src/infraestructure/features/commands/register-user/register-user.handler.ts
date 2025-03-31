import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { RegisterUserRequest } from 'src/application/use-cases/register-user/register-user.request';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  public async execute(
    command: RegisterUserCommand,
  ): Promise<Response<string>> {
    const { email, password, confirmatePassword } = command.request;

    const request = new RegisterUserRequest(
      email,
      password,
      confirmatePassword,
    );

    return await this.registerUseCase.execute(request);
  }
}

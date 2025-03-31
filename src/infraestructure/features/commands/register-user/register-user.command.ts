import { Command } from '@nestjs/cqrs';
import { RegisterUserBody } from './register-user.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';

export class RegisterUserCommand extends Command<Response<string>> {
  constructor(public readonly request: RegisterUserBody) {
    super();
  }
}

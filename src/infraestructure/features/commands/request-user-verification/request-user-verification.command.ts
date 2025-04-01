import { Command } from '@nestjs/cqrs';
import { RequestUserVerificationBody } from './request-user-verification.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';

export class RequestUserVerificationCommand extends Command<Response<string>> {
  constructor(public readonly request: RequestUserVerificationBody) {
    super();
  }
}

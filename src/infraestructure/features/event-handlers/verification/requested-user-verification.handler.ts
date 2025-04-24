import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InitalizedUserVerificationEvent } from 'src/domain/contexts/users/aggregate/events/verification/initialized-verification.event';
import {
  IVerificationUserService,
  VERIFICATION_USER_SERVICE,
} from 'src/domain/contexts/users/interfaces/verification-user.interface';

@EventsHandler(InitalizedUserVerificationEvent)
export class RequestedUserVerificationHandler
  implements IEventHandler<InitalizedUserVerificationEvent>
{
  constructor(
    @Inject(VERIFICATION_USER_SERVICE)
    private readonly verificationUserService: IVerificationUserService,
  ) {}

  public async handle(event: InitalizedUserVerificationEvent): Promise<void> {
    await this.verificationUserService.initializeUserVerification(event.userId);
    console.log(event.userId);
  }
}

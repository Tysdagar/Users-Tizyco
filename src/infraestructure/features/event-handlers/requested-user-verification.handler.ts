import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InitalizedUserVerificationEvent } from 'src/domain/contexts/users/aggregate/events/requested-verification.event';

@EventsHandler(InitalizedUserVerificationEvent)
export class RequestedUserVerificationHandler
  implements IEventHandler<InitalizedUserVerificationEvent>
{
  public async handle(event: InitalizedUserVerificationEvent): Promise<void> {
    await Promise.all([
      console.log(
        `Usuario: ${event.userId}, Código Verificador: ${event.code}`,
      ),
    ]);
  }
}

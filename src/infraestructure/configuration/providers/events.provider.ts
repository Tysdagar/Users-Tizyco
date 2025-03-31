import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { IEventBus } from 'src/domain/common/interfaces/concepts/event-bus.interface';
import { IEvent } from 'src/domain/common/interfaces/concepts/event.interface';

@Injectable()
export class NestEventBus implements IEventBus {
  constructor(private readonly eventBus: EventBus) {}

  public publish(event: IEvent): void {
    this.eventBus.publish(event);
  }

  public publishAll(events: IEvent[]): void {
    this.eventBus.publishAll(events);
  }
}

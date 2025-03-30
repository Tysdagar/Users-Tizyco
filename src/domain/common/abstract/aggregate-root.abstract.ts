import { IEventBus } from '../interfaces/concepts/event-bus.interface';
import { IEvent } from '../interfaces/concepts/event.interface';

export abstract class AggregateRoot {
  private readonly domainEvents: IEvent[] = [];
  private readonly _id: string;

  protected constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  protected addEvent(event: IEvent): void {
    this.domainEvents.push(event);
  }

  private clearDomainEvents() {
    this.domainEvents.length = 0;
  }

  public publishEvents(eventBus: IEventBus): void {
    for (const event of this.domainEvents) {
      eventBus.publish(event);
    }

    this.clearDomainEvents();
  }
}

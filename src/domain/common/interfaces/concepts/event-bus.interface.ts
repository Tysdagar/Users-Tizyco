import { IEvent } from './event.interface';

export const EVENT_BUS = Symbol('IEventBus');

export interface IEventBus {
  publish(event: IEvent): void;
  publishAll(events: IEvent[]): void;
}

import { DomainException } from '../errors/configuration/domain.exception';
import { IEventBus } from '../interfaces/concepts/event-bus.interface';
import { AggregateRoot } from './aggregate-root.abstract';

export abstract class EntityService<T extends AggregateRoot> {
  private _entity: T;

  constructor(protected readonly eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  public configureEntity(entity: T): void {
    if (this._entity) {
      throw new DomainException(
        `La entidad '${this.getEntityName()}' ya ha sido configurada en el servicio.`,
      );
    }
    this._entity = entity;
  }

  private ensureConfigured(): void {
    if (!this._entity) {
      throw new DomainException(
        `La entidad para el '${this.getEntityName()}' no ha sido configurada para interactuar con el servicio.`,
      );
    }
  }

  public get entity() {
    this.ensureConfigured();
    return this._entity;
  }

  private getEntityName(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      (this._entity
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Object.getPrototypeOf(this._entity).constructor.name
        : this.constructor.name) || 'Entidad desconocida'
    );
  }

  protected async execute<TResult>(
    executer: () => TResult | Promise<TResult>,
  ): Promise<TResult> {
    try {
      return await executer();
    } finally {
      this.entity.publishEvents(this.eventBus);
    }
  }
}

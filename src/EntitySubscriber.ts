import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import { EventSubscriber } from "typeorm";
import type { Broadcaster, BroadcastMessage } from "./interfaces/Broadcaster";

@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface<any> {
  private broadcaster: Broadcaster;

  /**
   * Constructor accepts a Broadcaster instance for broadcasting updates.
   * @param broadcaster - An object implementing the Broadcaster interface.
   */
  constructor(broadcaster: Broadcaster) {
    this.broadcaster = broadcaster;
    console.log("EntitySubscriber initialized with Broadcaster");
  }

  /**
   * Specifies which entity this subscriber listens to.
   * Returning null means it listens to all entities.
   */
  listenTo(): string | Function {
    console.log("EntitySubscriber is listening to all entities");
    // Using type assertion to satisfy TypeScript's type checker
    return null as unknown as string | Function;
  }

  afterInsert(event: InsertEvent<any>): void {
    const { entity, metadata } = event;
    this.broadcastUpdate("insert", metadata.name, entity);
  }

  afterUpdate(event: UpdateEvent<any>): void {
    const { entity, metadata } = event;
    this.broadcastUpdate("update", metadata.name, entity);
  }

  afterRemove(event: RemoveEvent<any>): void {
    const { entity, metadata } = event;
    this.broadcastUpdate("remove", metadata.name, entity);
  }

  /**
   * Broadcasts entity updates using the Broadcaster instance.
   * @param action - The type of action (insert, update, remove).
   * @param entityName - The name of the entity.
   * @param entity - The entity instance.
   */
  private broadcastUpdate(
    action: string,
    entityName: string,
    entity: any
  ): void {
    console.log(`Entity update: ${action} on ${entityName}`, entity);
    const message: BroadcastMessage = {
      type: "entityUpdate",
      action,
      entityName,
      data: entity,
    };
    this.broadcaster.broadcastEntityUpdate(message);
  }
}

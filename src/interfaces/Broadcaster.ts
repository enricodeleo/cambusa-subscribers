export interface Broadcaster {
  broadcastEntityUpdate(message: BroadcastMessage): void;
}

export interface BroadcastMessage {
  type: string;
  action: string;
  entityName: string;
  data: any;
}

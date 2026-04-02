import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Vector3Schema extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class PlayerSchema extends Schema {
  @type("string") id: string = "";
  @type("string") userId: string = "";
  @type("string") name: string = "Anonymous";
  @type("string") avatar: string = "";
  @type("string") color: string = "#7c3aed";
  @type("string") emote: string = "idle";
  @type(Vector3Schema) position: Vector3Schema = new Vector3Schema();
  @type(Vector3Schema) rotation: Vector3Schema = new Vector3Schema();
  @type("number") lastUpdate: number = Date.now();
}

export class ChatMessageSchema extends Schema {
  @type("string") id: string = "";
  @type("string") playerId: string = "";
  @type("string") playerName: string = "";
  @type("string") content: string = "";
  @type("number") timestamp: number = Date.now();
}

export class StudyRoomState extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type([ChatMessageSchema]) messages = new ArraySchema<ChatMessageSchema>();
  @type("number") playerCount: number = 0;
}

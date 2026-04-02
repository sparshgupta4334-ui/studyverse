import { Room, Client } from "colyseus";
import { StudyRoomState, PlayerSchema, ChatMessageSchema, Vector3Schema } from "../schemas/PlayerState.js";
import { randomUUID } from "crypto";

const PLAYER_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#d97706",
  "#dc2626", "#db2777", "#0891b2", "#65a30d",
];

const MAX_CHAT_HISTORY = 50;
const POSITION_UPDATE_THROTTLE_MS = 50;

interface JoinOptions {
  userId?: string;
  name?: string;
  avatar?: string;
}

interface MoveMessage {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}

interface EmoteMessage {
  emote: string;
}

interface ChatMessage {
  content: string;
}

export class StudyRoom extends Room<StudyRoomState> {
  override maxClients = 50;

  private lastPositionUpdate = new Map<string, number>();
  private colorIndex = 0;

  override onCreate(_options: Record<string, unknown>) {
    this.setState(new StudyRoomState());
    this.setPatchRate(1000 / 20); // 20Hz state sync

    this.onMessage("move", (client, data: MoveMessage) => {
      const now = Date.now();
      const last = this.lastPositionUpdate.get(client.sessionId) ?? 0;
      if (now - last < POSITION_UPDATE_THROTTLE_MS) return;
      this.lastPositionUpdate.set(client.sessionId, now);

      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.position.x = data.x ?? player.position.x;
      player.position.y = data.y ?? player.position.y;
      player.position.z = data.z ?? player.position.z;
      player.rotation.x = data.rx ?? player.rotation.x;
      player.rotation.y = data.ry ?? player.rotation.y;
      player.rotation.z = data.rz ?? player.rotation.z;
      player.lastUpdate = now;
    });

    this.onMessage("emote", (client, data: EmoteMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      const allowed = ["idle", "walking", "sitting", "waving", "thinking"];
      if (allowed.includes(data.emote)) {
        player.emote = data.emote;
      }
    });

    this.onMessage("chat", (client, data: ChatMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const content = String(data.content ?? "").trim().slice(0, 300);
      if (!content) return;

      const msg = new ChatMessageSchema();
      msg.id = randomUUID();
      msg.playerId = client.sessionId;
      msg.playerName = player.name;
      msg.content = content;
      msg.timestamp = Date.now();

      this.state.messages.push(msg);

      // Keep chat history bounded
      while (this.state.messages.length > MAX_CHAT_HISTORY) {
        this.state.messages.splice(0, 1);
      }
    });

    console.log(`[StudyRoom] Room ${this.roomId} created`);
  }

  override onJoin(client: Client, options: JoinOptions) {
    const player = new PlayerSchema();
    player.id = client.sessionId;
    player.userId = options.userId ?? client.sessionId;
    player.name = options.name ?? `Player_${client.sessionId.slice(0, 4)}`;
    player.avatar = options.avatar ?? "";
    player.color = PLAYER_COLORS[this.colorIndex % PLAYER_COLORS.length] ?? "#7c3aed";
    player.emote = "idle";

    // Spawn at a slightly random position to avoid overlap
    const spawnX = (Math.random() - 0.5) * 8;
    const spawnZ = (Math.random() - 0.5) * 8;
    player.position = new Vector3Schema();
    player.position.x = spawnX;
    player.position.y = 0.9;
    player.position.z = spawnZ;
    player.rotation = new Vector3Schema();

    this.colorIndex++;
    this.state.players.set(client.sessionId, player);
    this.state.playerCount = this.state.players.size;

    console.log(
      `[StudyRoom] ${player.name} (${client.sessionId}) joined. Total: ${this.state.playerCount}`,
    );
  }

  override onLeave(client: Client, _consented: boolean) {
    this.state.players.delete(client.sessionId);
    this.lastPositionUpdate.delete(client.sessionId);
    this.state.playerCount = this.state.players.size;
    console.log(
      `[StudyRoom] ${client.sessionId} left. Total: ${this.state.playerCount}`,
    );
  }

  override onDispose() {
    console.log(`[StudyRoom] Room ${this.roomId} disposed`);
  }
}

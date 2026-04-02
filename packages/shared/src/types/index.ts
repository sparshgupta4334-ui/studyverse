// ─── Domain Types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: "owner" | "admin" | "member";
  user?: User;
  workspace?: Workspace;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export type ResourceType = "pdf" | "link" | "video" | "audio" | "text";
export type ResourceStatus = "pending" | "processing" | "ready" | "failed";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string | null;
  fileKey: string | null;
  status: ResourceStatus;
  workspaceId: string;
  createdAt: Date;
}

export interface ResourceChunk {
  id: string;
  content: string;
  resourceId: string;
  chunkIndex: number;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  workspaceId: string;
  createdAt: Date;
  user?: User;
}

// ─── Multiplayer / 3D World Types ────────────────────────────────────────────

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  position: Vector3;
  rotation: Vector3;
  emote: PlayerEmote;
  color: string;
}

export type PlayerEmote = "idle" | "walking" | "sitting" | "waving" | "thinking";

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
}

// ─── API Request / Response Types ────────────────────────────────────────────

export interface AIChatRequest {
  message: string;
  workspaceId: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface Citation {
  resourceId: string;
  resourceTitle: string;
  chunkContent: string;
  relevanceScore: number;
}

export interface AIChatResponse {
  response: string;
  citations: Citation[];
  conversationId: string;
}

export interface IngestRequest {
  resourceId: string;
  workspaceId: string;
  type: ResourceType;
}

export interface IngestResponse {
  jobId: string;
  status: "queued";
}

export interface SearchRequest {
  query: string;
  workspaceId: string;
  limit?: number;
}

export interface SearchResult {
  resourceId: string;
  resourceTitle: string;
  chunkContent: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

// ─── Room / Panel Types ───────────────────────────────────────────────────────

export type PanelType = "notes" | "resources" | "research" | "ai-chat" | null;

export interface WorldObject {
  id: string;
  name: string;
  position: Vector3;
  panel: PanelType;
}

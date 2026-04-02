import { z } from "zod";

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

// ─── Workspace Validators ─────────────────────────────────────────────────────

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").max(80),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

// ─── Note Validators ──────────────────────────────────────────────────────────

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().max(50_000),
  tags: z.array(z.string().max(30)).max(10).default([]),
  workspaceId: z.string().cuid(),
});

export const updateNoteSchema = createNoteSchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

// ─── Resource Validators ──────────────────────────────────────────────────────

const resourceTypeEnum = z.enum(["pdf", "link", "video", "audio", "text"]);

export const createResourceSchema = z.object({
  title: z.string().min(1).max(200),
  type: resourceTypeEnum,
  url: z.string().url().optional(),
  fileKey: z.string().optional(),
  workspaceId: z.string().cuid(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

// ─── Ingest Validators ────────────────────────────────────────────────────────

export const ingestRequestSchema = z.object({
  resourceId: z.string().cuid(),
  workspaceId: z.string().cuid(),
  type: resourceTypeEnum,
});

export type IngestRequestInput = z.infer<typeof ingestRequestSchema>;

// ─── AI Chat Validators ───────────────────────────────────────────────────────

export const aiChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  workspaceId: z.string().cuid(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20)
    .optional(),
});

export type AIChatRequestInput = z.infer<typeof aiChatRequestSchema>;

// ─── Search Validators ────────────────────────────────────────────────────────

export const searchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  workspaceId: z.string().cuid(),
  limit: z.number().int().min(1).max(50).default(10),
});

export type SearchRequestInput = z.infer<typeof searchRequestSchema>;

// ─── Player State Validator ───────────────────────────────────────────────────

export const vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const playerStateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  avatar: z.string(),
  position: vector3Schema,
  rotation: vector3Schema,
  emote: z.enum(["idle", "walking", "sitting", "waving", "thinking"]),
  color: z.string(),
});

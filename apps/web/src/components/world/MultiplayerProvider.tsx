"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWorldStore } from "@/store/useWorldStore";
import { joinStudyRoom } from "@/lib/colyseus-client";
import type { Room } from "colyseus.js";
import type { PlayerState } from "@studyverse/shared";

interface MultiplayerProviderProps {
  children: React.ReactNode;
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

export function MultiplayerProvider({
  children,
  userId,
  userName,
  userAvatar,
}: MultiplayerProviderProps) {
  const roomRef = useRef<Room | null>(null);
  const { upsertRemotePlayer, removeRemotePlayer, addChatMessage } = useWorldStore();

  const connectToRoom = useCallback(async () => {
    try {
      const room = await joinStudyRoom({
        userId,
        name: userName ?? "Anonymous",
        avatar: userAvatar ?? "",
      });

      roomRef.current = room;

      // Track players state
      room.state.players.onAdd((player: Record<string, unknown>, sessionId: string) => {
        if (sessionId === room.sessionId) return; // Skip local player

        const playerState: PlayerState = {
          id: sessionId,
          userId: String(player["userId"] ?? sessionId),
          name: String(player["name"] ?? "Player"),
          avatar: String(player["avatar"] ?? ""),
          color: String(player["color"] ?? "#7c3aed"),
          emote: (player["emote"] as PlayerState["emote"]) ?? "idle",
          position: {
            x: (player["position"] as Record<string, number>)?.x ?? 0,
            y: (player["position"] as Record<string, number>)?.y ?? 0,
            z: (player["position"] as Record<string, number>)?.z ?? 0,
          },
          rotation: {
            x: (player["rotation"] as Record<string, number>)?.x ?? 0,
            y: (player["rotation"] as Record<string, number>)?.y ?? 0,
            z: (player["rotation"] as Record<string, number>)?.z ?? 0,
          },
        };

        upsertRemotePlayer(sessionId, playerState);

        // Listen for position updates on this player
        const positionObj = player["position"] as {
          onChange?: (callback: () => void) => void;
          x?: number;
          y?: number;
          z?: number;
        } | undefined;
        positionObj?.onChange?.(() => {
          const pos = player["position"] as Record<string, number>;
          const rot = player["rotation"] as Record<string, number>;
          upsertRemotePlayer(sessionId, {
            ...playerState,
            position: { x: pos["x"] ?? 0, y: pos["y"] ?? 0, z: pos["z"] ?? 0 },
            rotation: { x: rot["x"] ?? 0, y: rot["y"] ?? 0, z: rot["z"] ?? 0 },
            emote: String(player["emote"] ?? "idle") as PlayerState["emote"],
          });
        });
      });

      room.state.players.onRemove((_player: unknown, sessionId: string) => {
        removeRemotePlayer(sessionId);
      });

      // Chat messages
      room.state.messages.onAdd((msg: Record<string, unknown>) => {
        addChatMessage({
          id: String(msg["id"] ?? ""),
          playerId: String(msg["playerId"] ?? ""),
          playerName: String(msg["playerName"] ?? ""),
          content: String(msg["content"] ?? ""),
          timestamp: Number(msg["timestamp"] ?? Date.now()),
        });
      });

      room.onLeave(() => {
        console.log("[Multiplayer] Left room");
        roomRef.current = null;
      });

      console.log("[Multiplayer] Joined study room:", room.roomId);
    } catch (err) {
      console.warn("[Multiplayer] Could not connect to Colyseus server:", err);
      // App works fine without multiplayer
    }
  }, [userId, userName, userAvatar, upsertRemotePlayer, removeRemotePlayer, addChatMessage]);

  useEffect(() => {
    void connectToRoom();

    return () => {
      roomRef.current?.leave();
    };
  }, [connectToRoom]);

  // Expose room ref for position updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as Window & { __studyRoom?: Room | null }).__studyRoom = roomRef.current;
    }
  });

  return <>{children}</>;
}

// Helper to send position updates from PlayerController
export function sendPlayerMove(x: number, y: number, z: number, ry: number) {
  const room = (window as Window & { __studyRoom?: Room | null }).__studyRoom;
  if (!room) return;
  room.send("move", { x, y, z, rx: 0, ry, rz: 0 });
}

export function sendChatMessage(content: string) {
  const room = (window as Window & { __studyRoom?: Room | null }).__studyRoom;
  if (!room) return;
  room.send("chat", { content });
}

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { PanelType, PlayerState, ChatMessage } from "@studyverse/shared";

interface WorldState {
  // Panel management
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  closePanel: () => void;

  // Local player
  localPlayer: PlayerState | null;
  setLocalPlayer: (player: PlayerState) => void;
  updateLocalPosition: (x: number, y: number, z: number) => void;

  // Remote players
  remotePlayers: Map<string, PlayerState>;
  setRemotePlayers: (players: Map<string, PlayerState>) => void;
  upsertRemotePlayer: (id: string, player: PlayerState) => void;
  removeRemotePlayer: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  isChatOpen: boolean;
  toggleChat: () => void;

  // Controls
  isPointerLocked: boolean;
  setPointerLocked: (locked: boolean) => void;
  movementEnabled: boolean;
  setMovementEnabled: (enabled: boolean) => void;
}

export const useWorldStore = create<WorldState>()(
  subscribeWithSelector((set) => ({
    activePanel: null,
    setActivePanel: (panel) =>
      set({ activePanel: panel, movementEnabled: panel === null }),
    closePanel: () => set({ activePanel: null, movementEnabled: true }),

    localPlayer: null,
    setLocalPlayer: (player) => set({ localPlayer: player }),
    updateLocalPosition: (x, y, z) =>
      set((state) => ({
        localPlayer: state.localPlayer
          ? { ...state.localPlayer, position: { x, y, z } }
          : null,
      })),

    remotePlayers: new Map(),
    setRemotePlayers: (players) => set({ remotePlayers: new Map(players) }),
    upsertRemotePlayer: (id, player) =>
      set((state) => {
        const next = new Map(state.remotePlayers);
        next.set(id, player);
        return { remotePlayers: next };
      }),
    removeRemotePlayer: (id) =>
      set((state) => {
        const next = new Map(state.remotePlayers);
        next.delete(id);
        return { remotePlayers: next };
      }),

    chatMessages: [],
    addChatMessage: (message) =>
      set((state) => ({
        chatMessages: [...state.chatMessages.slice(-99), message],
      })),
    isChatOpen: false,
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

    isPointerLocked: false,
    setPointerLocked: (locked) => set({ isPointerLocked: locked }),

    movementEnabled: true,
    setMovementEnabled: (enabled) => set({ movementEnabled: enabled }),
  })),
);

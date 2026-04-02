"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  MessageSquare,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";
import { MultiplayerProvider, sendChatMessage } from "@/components/world/MultiplayerProvider";

// Dynamic imports — no SSR for 3D components
const StudyWorld = dynamic(
  () => import("@/components/world/StudyWorld").then((m) => ({ default: m.StudyWorld })),
  { ssr: false, loading: () => <WorldLoadingScreen /> },
);

const NotesPanel = dynamic(
  () => import("@/components/panels/NotesPanel").then((m) => ({ default: m.NotesPanel })),
  { ssr: false },
);

const ResourcesPanel = dynamic(
  () => import("@/components/panels/ResourcesPanel").then((m) => ({ default: m.ResourcesPanel })),
  { ssr: false },
);

const ResearchPanel = dynamic(
  () => import("@/components/panels/ResearchPanel").then((m) => ({ default: m.ResearchPanel })),
  { ssr: false },
);

const AIChatPanel = dynamic(
  () => import("@/components/panels/AIChatPanel").then((m) => ({ default: m.AIChatPanel })),
  { ssr: false },
);

function WorldLoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#050508]">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600/20 shadow-neon-purple">
          <Sparkles size={36} className="animate-pulse text-brand-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">Entering StudyVerse</h2>
        <p className="text-gray-400">Loading your 3D study environment…</p>
        <div className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-surface-100">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-neon-cyan"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  const { activePanel, remotePlayers, isChatOpen, toggleChat, chatMessages } = useWorldStore();
  const [chatInput, setChatInput] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function handleChatSend() {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput("");
  }

  return (
    <MultiplayerProvider userName="You" userId="local_user">
      <div className="relative h-screen overflow-hidden">
        {/* 3D World Canvas */}
        <Suspense fallback={<WorldLoadingScreen />}>
          <StudyWorld />
        </Suspense>

        {/* ── HUD Overlays ── */}

        {/* Top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-glass-dark px-4 py-2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">StudyVerse</span>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/10 bg-glass-dark px-4 py-2"
          >
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              <span className="text-xs text-gray-300">Online</span>
            </div>
            <span className="text-gray-600">·</span>
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-gray-400" />
              <span className="text-xs text-gray-300">
                {remotePlayers.size + 1} in room
              </span>
            </div>
          </motion.div>
        </div>

        {/* Left sidebar — controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 transition-all duration-300 ${
            sidebarCollapsed ? "-translate-x-16" : "translate-x-0"
          }`}
        >
          <div className="ml-4 flex flex-col gap-2">
            {[
              { icon: Map, label: "World Map", action: () => {} },
              { icon: MessageSquare, label: "Chat", action: toggleChat },
              { icon: Settings, label: "Settings", action: () => {} },
              { icon: LogOut, label: "Exit", action: () => window.location.href = "/" },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-glass-dark text-gray-400 transition-all hover:border-white/20 hover:text-white"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-6 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-glass-dark text-gray-500"
          >
            {sidebarCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-glass-dark px-5 py-2.5 text-xs text-gray-400">
            <span><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">WASD</kbd> Move</span>
            <span><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Mouse</kbd> Look</span>
            <span><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Shift</kbd> Sprint</span>
            <span>Click objects to <span className="text-brand-300">interact</span></span>
          </div>
        </motion.div>

        {/* World Chat overlay */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-6 z-10 flex h-80 w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-glass-dark"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-brand-400" />
                  <span className="text-sm font-semibold text-white">World Chat</span>
                </div>
                <button onClick={toggleChat} className="text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.length === 0 && (
                  <p className="py-4 text-center text-xs text-gray-600">No messages yet</p>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <span className="font-medium text-brand-300">{msg.playerName}: </span>
                    <span className="text-gray-300">{msg.content}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-white/10 p-3">
                <input
                  className="flex-1 rounded-lg border border-white/10 bg-surface-50 px-3 py-1.5 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-500/50"
                  placeholder="Press Enter to chat..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                />
                <button
                  onClick={handleChatSend}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs text-white hover:bg-brand-500"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel overlays */}
        {activePanel === "notes" && <NotesPanel />}
        {activePanel === "resources" && <ResourcesPanel />}
        {activePanel === "research" && <ResearchPanel />}
        {activePanel === "ai-chat" && <AIChatPanel />}
      </div>
    </MultiplayerProvider>
  );
}

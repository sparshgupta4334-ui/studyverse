"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, BookOpen, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PanelOverlay } from "./PanelOverlay";
import { Button } from "@/components/ui/Button";
import type { AIChatResponse, Citation } from "@studyverse/shared";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Explain the key concepts from my uploaded materials",
  "What are the main differences between supervised and unsupervised learning?",
  "Summarize my notes on transformers",
  "How does attention mechanism work?",
];

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system_welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm your **StudyVerse AI assistant**. I can answer questions based on your uploaded resources and notes using retrieval-augmented generation (RAG).\n\nTry asking me about your study materials, or use one of the suggestions below!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "system_welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          workspaceId: "workspace_demo_01",
          conversationHistory: history,
        }),
      });

      const data = (await res.json()) as AIChatResponse | { error: string };

      if ("error" in data) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: data.response,
        citations: data.citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("[AI Chat] Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <PanelOverlay title="AI Study Assistant" icon="🤖" width="max-w-2xl">
      <div className="flex h-[600px] flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant"
                      ? "bg-brand-600 shadow-neon-purple"
                      : "bg-surface-200 border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={16} className="text-white" />
                  ) : (
                    <User size={16} className="text-gray-300" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-brand-600/80 text-white"
                        : "rounded-tl-sm border border-white/10 bg-surface-50 text-gray-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <BookOpen size={10} />
                        Sources
                      </div>
                      {msg.citations.map((citation, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-brand-500/20 bg-brand-600/10 px-3 py-2 text-xs"
                        >
                          <p className="font-medium text-brand-300">{citation.resourceTitle}</p>
                          <p className="mt-0.5 text-gray-500 line-clamp-2">{citation.chunkContent}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-gray-600">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-white/10 bg-surface-50 px-4 py-3">
                <Loader2 size={14} className="animate-spin text-brand-400" />
                <span className="text-sm text-gray-400">Thinking…</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="border-t border-white/10 px-4 py-3">
            <p className="mb-2 text-xs text-gray-500">Suggested</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-surface-50 px-3 py-1.5 text-xs text-gray-300 transition-all hover:border-brand-500/40 hover:bg-brand-600/10 hover:text-brand-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-xl border border-white/10 bg-surface-50 px-4 py-3 focus-within:border-brand-500/50">
              <textarea
                ref={inputRef}
                className="w-full resize-none bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
                placeholder="Ask about your study materials… (Enter to send, Shift+Enter for newline)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ minHeight: "20px", maxHeight: "120px" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 p-0"
              >
                <Send size={16} />
              </Button>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "system_welcome_reset",
                      role: "assistant",
                      content: "Conversation cleared. How can I help you?",
                      timestamp: new Date(),
                    },
                  ])
                }
                className="h-10 w-10 rounded-lg p-0 text-gray-600 transition-colors hover:bg-white/5 hover:text-gray-400 flex items-center justify-center"
                title="Clear conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PanelOverlay>
  );
}

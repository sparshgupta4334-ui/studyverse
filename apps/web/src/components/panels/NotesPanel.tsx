"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Tag, Trash2, Edit3, Save, X } from "lucide-react";
import { PanelOverlay } from "./PanelOverlay";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNotesStore } from "@/store/useNotesStore";
import type { Note } from "@studyverse/shared";

// Mock workspace ID — in production this comes from session/route
const MOCK_WORKSPACE_ID = "workspace_demo_01";

function generateId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function NotesPanel() {
  const { notes, selectedNoteId, addNote, updateNote, deleteNote, selectNote, setNotes } =
    useNotesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Seed demo notes on first mount
  useEffect(() => {
    if (notes.length === 0) {
      setNotes([
        {
          id: "note_demo_1",
          title: "React Three Fiber Basics",
          content:
            "React Three Fiber (R3F) is a React renderer for Three.js. It lets you build 3D scenes using declarative JSX components.\n\n## Key concepts:\n- Canvas — the WebGL context\n- Mesh — geometry + material\n- useFrame — animation loop\n- useThree — access scene internals",
          tags: ["3d", "react", "threejs"],
          userId: "user_1",
          workspaceId: MOCK_WORKSPACE_ID,
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 3600000),
        },
        {
          id: "note_demo_2",
          title: "Physics with Rapier",
          content:
            "Rapier is a fast Rust-based physics engine. @react-three/rapier wraps it for R3F.\n\n```jsx\n<Physics>\n  <RigidBody type=\"dynamic\">\n    <mesh />\n  </RigidBody>\n</Physics>\n```",
          tags: ["physics", "rapier", "game"],
          userId: "user_1",
          workspaceId: MOCK_WORKSPACE_ID,
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 86400000),
        },
      ]);
    }
  }, [notes.length, setNotes]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(", "));
  }

  function saveEdit() {
    if (!editingId) return;
    updateNote(editingId, {
      title: editTitle,
      content: editContent,
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditingId(null);
  }

  function createNote() {
    const newNote: Note = {
      id: generateId(),
      title: editTitle || "New Note",
      content: editContent,
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      userId: "user_1",
      workspaceId: MOCK_WORKSPACE_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addNote(newNote);
    setIsCreating(false);
    setEditTitle("");
    setEditContent("");
    setEditTags("");
  }

  return (
    <PanelOverlay title="Study Notes" icon="📝" width="max-w-4xl">
      <div className="flex h-full min-h-[500px]">
        {/* Sidebar */}
        <div className="flex w-72 flex-shrink-0 flex-col border-r border-white/10">
          <div className="p-4">
            <Button
              size="sm"
              className="mb-3 w-full"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setIsCreating(true);
                setEditTitle("");
                setEditContent("");
                setEditTags("");
                selectNote(null);
              }}
            >
              New Note
            </Button>
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={14} />}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => {
                    selectNote(note.id);
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-left transition-all ${
                    selectedNoteId === note.id
                      ? "border border-brand-500/40 bg-brand-600/20"
                      : "border border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-gray-200">{note.title}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{note.content.slice(0, 60)}…</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-600/20 px-2 py-0.5 text-[10px] text-brand-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {filteredNotes.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No notes found</p>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex flex-1 flex-col p-6">
          {isCreating ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-400">New Note</h3>
              <input
                className="rounded-lg border border-white/10 bg-surface-50 px-3 py-2 text-lg font-semibold text-white focus:border-brand-500/50 focus:outline-none"
                placeholder="Note title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="h-48 resize-none rounded-lg border border-white/10 bg-surface-50 px-3 py-2 text-sm text-gray-300 focus:border-brand-500/50 focus:outline-none"
                placeholder="Write your note here... (Markdown supported)"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <Input
                placeholder="Tags (comma-separated)"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                leftIcon={<Tag size={14} />}
              />
              <div className="flex gap-2">
                <Button onClick={createNote} leftIcon={<Save size={14} />}>Save Note</Button>
                <Button variant="ghost" onClick={() => setIsCreating(false)} leftIcon={<X size={14} />}>Cancel</Button>
              </div>
            </div>
          ) : selectedNote ? (
            editingId === selectedNote.id ? (
              <div className="flex flex-col gap-4">
                <input
                  className="rounded-lg border border-white/10 bg-surface-50 px-3 py-2 text-lg font-semibold text-white focus:border-brand-500/50 focus:outline-none"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="h-64 resize-none rounded-lg border border-white/10 bg-surface-50 px-3 py-2 text-sm text-gray-300 focus:border-brand-500/50 focus:outline-none"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  leftIcon={<Tag size={14} />}
                />
                <div className="flex gap-2">
                  <Button onClick={saveEdit} leftIcon={<Save size={14} />}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)} leftIcon={<X size={14} />}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-white">{selectedNote.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(selectedNote)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-white/10 hover:text-gray-300"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedNote.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-brand-600/20 px-2 py-1 text-xs text-brand-300">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="rounded-xl bg-surface-50 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                    {selectedNote.content}
                  </pre>
                </div>
                <p className="text-xs text-gray-600">
                  Last updated {selectedNote.updatedAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 text-5xl">📝</span>
              <p className="text-gray-400">Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </PanelOverlay>
  );
}

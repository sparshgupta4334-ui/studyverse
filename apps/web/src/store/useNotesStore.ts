import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@studyverse/shared";

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: string | null;

  // CRUD actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      selectedNoteId: null,
      isLoading: false,
      error: null,

      setNotes: (notes) => set({ notes }),
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n,
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
        })),
      selectNote: (id) => set({ selectedNoteId: id }),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "studyverse-notes",
      partialize: (state) => ({ notes: state.notes, selectedNoteId: state.selectedNoteId }),
    },
  ),
);

"use client";

import { useState, useEffect } from "react";
import NoteItem from "./components/NoteItem";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type Note = {
  text: string;
  completed: boolean;
  color: string;
};

const colors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
];

export default function Home() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("notes");

    if (saved) {
      const parsed = JSON.parse(saved);

      const fixed = parsed.map((n: any) => ({
        text: n.text,
        completed: n.completed ?? false,
        color: n.color ?? "bg-gray-100",
      }));

      setNotes(fixed);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const trimmed = note.trim();

    if (trimmed === "") {
      toast.error("Note cannot be empty");
      return;
    }

    if (notes.some((n) => n.text === trimmed)) {
      toast.error("Duplicate note not allowed");
      return;
    }

    if (editIndex !== null) {
      const updated = [...notes];
      updated[editIndex].text = trimmed;
      setNotes(updated);
      setEditIndex(null);
      toast.success("Note updated!");
    } else {
      const randomColor =
        colors[Math.floor(Math.random() * colors.length)];

      setNotes([
        ...notes,
        { text: trimmed, completed: false, color: randomColor },
      ]);

      toast.success("Note added!");
    }

    setNote("");
  };

  const deleteNote = (index: number) => {
    const confirmDelete = confirm("Delete this note?");
    if (!confirmDelete) return;

    setNotes(notes.filter((_, i) => i !== index));
    toast("Note deleted 🗑");
  };

  const clearAllNotes = () => {
    const confirmClear = confirm("Clear all notes?");
    if (!confirmClear) return;

    setNotes([]);
    toast("All notes cleared 🧹");
  };

  const toggleComplete = (index: number) => {
    const updated = [...notes];
    updated[index].completed = !updated[index].completed;
    setNotes(updated);
    toast.success("Task updated!");
  };

  const startEdit = (index: number) => {
    setNote(notes[index].text);
    setEditIndex(index);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center">
           To Do List
        </h1>

        <p className="text-center text-gray-400 text-sm mb-4">
          Stay productive. Stay organized.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addNote();
            }}
            placeholder="Write a note..."
          />

          <button
            onClick={addNote}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition text-white px-5 rounded-xl font-medium"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        {notes.length > 0 && (
          <button
            onClick={clearAllNotes}
            className="mb-3 text-sm text-red-500 hover:underline"
          >
            Clear all notes
          </button>
        )}

        <ul className="space-y-2">
          <AnimatePresence>
            {notes.map((n, i) => (
              <NoteItem
                key={i}
                note={n}
                onToggle={() => toggleComplete(i)}
                onEdit={() => startEdit(i)}
                onDelete={() => deleteNote(i)}
              />
            ))}
          </AnimatePresence>
        </ul>

        {notes.length === 0 && (
          <p className="text-center text-gray-400 mt-4">
            No notes yet.
            <br />
            Start adding tasks to stay organized 
          </p>
        )}

      </div>
    </main>
  );
}
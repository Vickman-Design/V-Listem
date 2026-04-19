"use client";

import { useState, useEffect } from "react";
import NoteItem from "./components/NoteItem";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type Note = {
  text: string;
  completed: boolean;
  color: string;
  reminder?: number;
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
  const [reminderTime, setReminderTime] = useState("");

  // Load notes
  useEffect(() => {
    const saved = localStorage.getItem("notes");

    if (saved) {
      const parsed = JSON.parse(saved);

      const fixed = parsed.map((n: any) => ({
        text: n.text,
        completed: n.completed ?? false,
        color: n.color ?? "bg-gray-200",
        reminder: n.reminder ?? undefined,
      }));

      setNotes(fixed);
    }

    setLoading(false);
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // 🔥 REMINDER ENGINE (SAFE + FIXED)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setNotes((prev) => {
        return prev.map((n) => {
          if (n.reminder && !n.completed && now >= n.reminder) {
            
            // browser notification
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("⏰ Reminder", {
                body: n.text,
              });
            }

            toast.success(`⏰ ${n.text}`);

            return { ...n, reminder: undefined };
          }

          return n;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addNote = () => {
    const trimmed = note.trim();

    if (!trimmed) {
      toast.error("Note cannot be empty");
      return;
    }

    if (notes.some((n) => n.text === trimmed)) {
      toast.error("Duplicate note not allowed");
      return;
    }

    const reminderTimestamp = reminderTime
      ? new Date(reminderTime).getTime()
      : undefined;

    if (editIndex !== null) {
      const updated = [...notes];
      updated[editIndex].text = trimmed;
      updated[editIndex].reminder = reminderTimestamp;

      setNotes(updated);
      setEditIndex(null);

      toast.success("Note updated!");
    } else {
      const randomColor =
        colors[Math.floor(Math.random() * colors.length)];

      setNotes([
        ...notes,
        {
          text: trimmed,
          completed: false,
          color: randomColor,
          reminder: reminderTimestamp,
        },
      ]);

      toast.success("Note added!");
    }

    setNote("");
    setReminderTime("");
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

  const enableNotifications = async () => {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      toast.success("Notifications enabled 🔔");
    } else {
      toast.error("Permission denied");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-3 sm:px-4">

      <div className="bg-white text-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-sm sm:max-w-md md:max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            To Do List
          </h1>

          <button
            onClick={enableNotifications}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
          >
            Enable Notifications
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs sm:text-sm mb-4">
          Stay productive. Stay organized.
        </p>

        {/* INPUT */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">

          <input
            className="flex-1 border border-gray-300 p-3 rounded-lg"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
          />

          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm"
          />

        </div>

        <button
          onClick={addNote}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg mb-3"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>

        {/* CLEAR */}
        {notes.length > 0 && (
          <button
            onClick={clearAllNotes}
            className="mb-3 text-sm text-red-600 hover:underline"
          >
            Clear all notes
          </button>
        )}

        {/* NOTES */}
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

        {/* EMPTY STATE */}
        {notes.length === 0 && (
          <p className="text-center text-gray-700 mt-4 text-sm">
            No notes yet. Start adding tasks to stay organized
          </p>
        )}

      </div>
    </main>
  );
}
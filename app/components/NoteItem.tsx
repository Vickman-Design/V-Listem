"use client";

import { motion } from "framer-motion";

type Note = {
  text: string;
  completed: boolean;
  color: string;
};

type Props = {
  note: Note;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
};

export default function NoteItem({
  note,
  onDelete,
  onEdit,
  onToggle,
}: Props) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`flex justify-between items-center p-3 rounded-xl shadow-sm ${note.color}`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={note.completed ?? false}
          onChange={onToggle}
        />

        <span
          className={
            note.completed ? "line-through text-gray-500" : ""
          }
        >
          {note.text}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm"
        >
          ✏️
        </button>

        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-sm"
        >
          🗑
        </button>
      </div>
    </motion.li>
  );
}
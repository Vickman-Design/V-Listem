"use client";

import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const root = document.documentElement;

    if (dark) {
      root.classList.remove("dark");
      localStorage.setItem("dark", "false");
    } else {
      root.classList.add("dark");
      localStorage.setItem("dark", "true");
    }

    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      className="text-xs px-3 py-1 rounded-lg bg-gray-800 text-white"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
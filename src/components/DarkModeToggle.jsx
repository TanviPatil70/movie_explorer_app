"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  // Set initial value: check localStorage, otherwise use system preference.
  useEffect(() => {
    const saved = localStorage.getItem("color-theme");
    if (saved === "dark") {
      setDark(true);
    } else if (saved === "light") {
      setDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
      localStorage.setItem("color-theme", prefersDark ? "dark" : "light");
    }
  }, []);
  // Toggle <html> class and save preference.
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("color-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button
      className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-yellow-300 shadow transition-colors"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
      type="button"
    >
      {dark ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}

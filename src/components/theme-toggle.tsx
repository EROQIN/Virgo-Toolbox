"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const label = useMemo(
    () => (theme === "dark" ? "切换为浅色模式" : "切换为深色模式"),
    [theme],
  );

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
        isDark
          ? "border border-white/10 bg-slate-900/70 text-slate-200 hover:border-sky-400 hover:text-white"
          : "border border-slate-300 bg-white/80 text-slate-700 hover:border-sky-400"
      }`}
    >
      <span
        aria-hidden
        className={`text-base leading-none ${
          isDark ? "text-sky-300" : "text-sky-500"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
      {isDark ? "深色" : "浅色"}
    </button>
  );
}

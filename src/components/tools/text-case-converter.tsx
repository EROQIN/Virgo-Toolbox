"use client";

import { useMemo, useState } from "react";

type Mode = "upper" | "lower" | "title" | "camel" | "snake" | "kebab";

const transformText = (text: string, mode: Mode) => {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .split(/\s+/)
        .map((word) =>
          word ? word[0]?.toUpperCase() + word.slice(1) : "",
        )
        .join(" ");
    case "camel": {
      const parts = text
        .toLowerCase()
        .split(/[\s_\-]+/)
        .filter(Boolean);
      if (parts.length === 0) return "";
      return (
        parts[0] +
        parts
          .slice(1)
          .map((word) => word[0]?.toUpperCase() + word.slice(1))
          .join("")
      );
    }
    case "snake":
      return text
        .trim()
        .replace(/[\s\-]+/g, "_")
        .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
        .replace(/_{2,}/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase();
    case "kebab":
      return text
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
    default:
      return text;
  }
};

const modes: Array<{ id: Mode; label: string; description: string }> = [
  { id: "upper", label: "全部大写", description: "HELLO WORLD" },
  { id: "lower", label: "全部小写", description: "hello world" },
  { id: "title", label: "标题格式", description: "Hello World" },
  { id: "camel", label: "驼峰格式", description: "helloWorld" },
  { id: "snake", label: "下划线格式", description: "hello_world" },
  { id: "kebab", label: "中划线格式", description: "hello-world" },
];

export default function TextCaseConverter() {
  const [source, setSource] = useState("");
  const [mode, setMode] = useState<Mode>("upper");

  const result = useMemo(() => transformText(source, mode), [source, mode]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-5 text-sm text-slate-200">
      <div className="grid gap-2 sm:grid-cols-3">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-2xl border border-white/10 px-4 py-3 text-left transition hover:border-sky-400/40 hover:bg-slate-900/70 ${
              mode === item.id
                ? "bg-sky-500/20 text-white"
                : "bg-slate-900/60 text-slate-300"
            }`}
          >
            <div className="font-semibold">{item.label}</div>
            <div className="mt-1 text-xs text-slate-400">
              示例：{item.description}
            </div>
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          原始文本
        </span>
        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="粘贴或输入需要转换的文本…"
          className="min-h-32 rounded-2xl border border-white/5 bg-slate-900/80 p-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>结果预览</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 px-3 py-1 font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
        >
          复制结果
        </button>
      </div>

      <textarea
        value={result}
        readOnly
        className="min-h-32 rounded-2xl border border-white/5 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40"
      />
    </div>
  );
}

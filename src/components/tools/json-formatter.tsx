"use client";

import { useState } from "react";

type Mode = "pretty" | "compact";

export default function JsonFormatter() {
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = (mode: Mode) => {
    if (!source.trim()) {
      setOutput("");
      setError("请输入 JSON 内容后再格式化。");
      return;
    }
    try {
      const parsed = JSON.parse(source);
      const formatted =
        mode === "pretty"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed);
      setOutput(formatted);
      setError(null);
    } catch (formatError) {
      setOutput("");
      setError(
        formatError instanceof Error
          ? formatError.message
          : "JSON 解析失败，请检查语法。",
      );
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-5 text-sm text-slate-200">
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          原始 JSON
        </span>
        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder='粘贴 JSON，例如 {"name":"Virgo"}'
          className="h-48 rounded-2xl border border-white/5 bg-slate-900/80 p-4 font-mono text-xs text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleFormat("pretty")}
          className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-sky-400"
        >
          美化
        </button>
        <button
          type="button"
          onClick={() => handleFormat("compact")}
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
        >
          压缩
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
        >
          复制结果
        </button>
        {error ? (
          <span className="text-xs text-rose-300">{error}</span>
        ) : output ? (
          <span className="text-xs text-sky-300">格式化成功，可复制使用。</span>
        ) : null}
      </div>

      <textarea
        value={output}
        readOnly
        placeholder="格式化后的结果将在此显示…"
        className="h-48 rounded-2xl border border-white/5 bg-slate-950/70 p-4 font-mono text-xs text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40"
      />
    </div>
  );
}

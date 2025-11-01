"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "encode" | "decode";

const encodeToBase64 = (value: string) => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeFromBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

const convertValue = (value: string, currentMode: Mode) => {
  if (!value) {
    return { output: "", error: null };
  }
  try {
    if (currentMode === "encode") {
      return { output: encodeToBase64(value), error: null };
    }
    return { output: decodeFromBase64(value), error: null };
  } catch {
    return { output: "", error: "当前模式不支持该内容，请检查输入。" };
  }
};

export default function Base64Encoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const conversion = useMemo(
    () => convertValue(input, mode),
    [input, mode],
  );
  const { output, error } = conversion;

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const handleCopy = async () => {
    if (!output) return;
    if (!navigator?.clipboard) {
      setCopyStatus("failed");
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-200">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`rounded-full px-3 py-1 font-medium transition ${
            mode === "encode"
              ? "bg-sky-500 text-white shadow-[0_8px_20px_rgba(14,116,144,0.38)]"
              : "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
          }`}
        >
          编码
        </button>
        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`rounded-full px-3 py-1 font-medium transition ${
            mode === "decode"
              ? "bg-sky-500 text-white shadow-[0_8px_20px_rgba(14,116,144,0.38)]"
              : "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
          }`}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={
          mode === "encode"
            ? "输入或粘贴需要编码的内容…"
            : "粘贴需要解码的 Base64 字符串…"
        }
        className="min-h-32 rounded-2xl border border-white/5 bg-slate-900/80 p-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          {output.length ? `输出共 ${output.length} 个字符` : "结果将实时显示在下方"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!output}
          className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-sky-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copyStatus === "copied"
            ? "已复制"
            : copyStatus === "failed"
              ? "复制失败"
              : "复制结果"}
        </button>
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="结果将在此显示…"
        className="min-h-32 rounded-2xl border border-white/5 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40"
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const averageReadingSpeed = 200; // 平均阅读速度：每分钟 200 词

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim()
      ? text
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, "").length;
    const lines = text.length ? text.split(/\r?\n/).length : 0;
    const readingMinutes =
      words === 0 ? 0 : Math.max(1, Math.ceil(words / averageReadingSpeed));

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      readingMinutes,
    };
  }, [text]);

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-200">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="在此输入或粘贴文本，系统将自动统计…"
        className="h-40 rounded-2xl border border-white/5 bg-slate-900/80 p-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <StatPill label="词数" value={stats.words} />
        <StatPill label="字符数" value={stats.characters} />
        <StatPill
          label="字符数（不含空白）"
          value={stats.charactersNoSpaces}
        />
        <StatPill label="行数" value={stats.lines} />
        <StatPill
          label="预计阅读时间"
          value={
            stats.readingMinutes
              ? `${stats.readingMinutes} 分钟`
              : stats.words
                ? "< 1 分钟"
                : "暂无数据"
          }
        />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

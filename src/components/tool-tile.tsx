'use client';

import Link from "next/link";
import { useIsDarkTheme } from "@/components/theme-provider";
import type { ToolDefinition } from "@/data/tools";

export default function ToolTile({ tool }: { tool: ToolDefinition }) {
  const isDark = useIsDarkTheme();

  const tileClass = isDark
    ? "border-white/10 bg-slate-900/55 text-slate-200 shadow-[0_30px_90px_rgba(8,47,73,0.55)]"
    : "border-slate-200/70 bg-white/90 text-slate-700 shadow-[0_30px_90px_rgba(148,163,184,0.35)]";
  const badgeClass = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-200"
    : "border-slate-200/60 bg-white/85 text-slate-600";
  const categoryClass = isDark ? "text-slate-400" : "text-slate-500";
  const titleClass = isDark ? "text-white" : "text-slate-900";
  const summaryClass = isDark ? "text-slate-300" : "text-slate-600";
  const actionClass = isDark ? "text-sky-300" : "text-sky-500";
  const gradient = isDark
    ? "linear-gradient(135deg, rgba(56,189,248,0.12), transparent, rgba(99,102,241,0.14))"
    : "linear-gradient(135deg, rgba(59,130,246,0.18), transparent, rgba(129,140,248,0.18))";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition hover:border-sky-400/40 hover:shadow-[0_36px_120px_rgba(8,47,73,0.65)] ${tileClass}`}
    >
      <span className="absolute inset-0" style={{ background: gradient }} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${badgeClass}`}>
            {tool.icon ? (
              <span aria-hidden className="text-base leading-none">
                {tool.icon}
              </span>
            ) : null}
            {tool.badge}
          </span>
          <span className={`text-xs transition ${categoryClass}`}>{tool.category}</span>
        </div>
        <div className="space-y-2">
          <h2 className={`text-xl font-semibold ${titleClass}`}>{tool.title}</h2>
          <p className={`text-sm ${summaryClass}`}>{tool.summary}</p>
        </div>
      </div>
      <span
        className={`relative z-10 mt-8 inline-flex items-center text-sm font-medium transition group-hover:text-sky-200 ${actionClass}`}
      >
        进入工具
        <svg
          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 10h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11.25 6.25 15 10l-3.75 3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

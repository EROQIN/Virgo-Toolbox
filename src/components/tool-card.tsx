'use client';

import type { ReactNode } from "react";
import { useIsDarkTheme } from "@/components/theme-provider";

type ToolCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function ToolCard({
  title,
  description,
  children,
  footer,
}: ToolCardProps) {
  const isDark = useIsDarkTheme();

  const cardClass = isDark
    ? "border-white/10 bg-slate-900/50 text-slate-200 shadow-[0_20px_60px_rgba(2,8,20,0.45)]"
    : "border-slate-200/70 bg-white/90 text-slate-700 shadow-[0_20px_60px_rgba(148,163,184,0.35)]";
  const titleClass = isDark ? "text-white" : "text-slate-900";
  const descriptionClass = isDark ? "text-slate-300" : "text-slate-600";
  const borderClass = isDark ? "border-white/5 text-slate-400" : "border-slate-200/60 text-slate-500";
  const gradientFrom = isDark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.18)";
  const gradientTo = isDark ? "rgba(99,102,241,0.18)" : "rgba(129,140,248,0.18)";

  return (
    <article
      className={`relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-colors duration-300 ${cardClass}`}
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, transparent, ${gradientTo})`,
        }}
      />
      <div className="relative z-10 flex flex-col gap-3">
        <h2 className={`text-lg font-semibold md:text-xl ${titleClass}`}>{title}</h2>
        <p className={`text-sm md:text-base ${descriptionClass}`}>{description}</p>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
      {footer ? (
        <div className={`relative z-10 border-t pt-3 text-xs transition-colors duration-300 ${borderClass}`}>
          {footer}
        </div>
      ) : null}
    </article>
  );
}

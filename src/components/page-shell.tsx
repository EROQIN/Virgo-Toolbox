'use client';

import type { ReactNode } from "react";
import ThemeToggle from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import CodeGlobeBackground from "@/components/backgrounds/code-globe";

type PageShellProps = {
  children: ReactNode;
  containerClassName?: string;
  contentClassName?: string;
};

export default function PageShell({
  children,
  containerClassName,
  contentClassName,
}: PageShellProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerClass = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-100 text-slate-900";

  const radialBackground = isDark
    ? "radial-gradient(circle at top, rgba(14, 165, 233, 0.28), transparent 60%)"
    : "radial-gradient(circle at top, rgba(56, 189, 248, 0.25), transparent 60%)";
  const fineGridColor = isDark
    ? "rgba(148, 163, 184, 0.12)"
    : "rgba(100, 116, 139, 0.18)";
  const majorGridColor = isDark
    ? "rgba(96, 165, 250, 0.22)"
    : "rgba(59, 130, 246, 0.25)";
  const fineGridBackground = `linear-gradient(to right, ${fineGridColor} 1px, transparent 1px), linear-gradient(to bottom, ${fineGridColor} 1px, transparent 1px)`;
  const majorGridBackground = `linear-gradient(to right, ${majorGridColor} 1px, transparent 1px), linear-gradient(to bottom, ${majorGridColor} 1px, transparent 1px)`;
  const overlayBackground = isDark
    ? "linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(2, 6, 23, 0.95))"
    : "linear-gradient(to bottom, rgba(226, 232, 240, 0.6), rgba(255, 255, 255, 0.95))";

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${containerClass}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: radialBackground }} />
        <div
          className="absolute inset-0 opacity-30 [background-size:48px_48px]"
          style={{ background: fineGridBackground }}
        />
        <div
          className="absolute inset-0 opacity-35 [background-size:240px_240px]"
          style={{ background: majorGridBackground }}
        />
        <div className="absolute inset-0" style={{ background: overlayBackground }} />
        <CodeGlobeBackground theme={theme} />
      </div>
      <main
        className={`relative z-10 mx-auto w-full px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-32 lg:pt-24 ${containerClassName ?? "max-w-6xl"}`}
      >
        <div className="mb-8 flex justify-end">
          <ThemeToggle />
        </div>
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}

import type { ReactNode } from "react";
import PageShell from "@/components/page-shell";

export default function ToolsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageShell containerClassName="max-w-5xl" contentClassName="space-y-12">
      {children}
    </PageShell>
  );
}

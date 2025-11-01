"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const defaultContent = `# Virgo 工具箱

- 支持 **Markdown** 语法
- 可实时在右侧预览
- 适合撰写文档或笔记

\`\`\`ts
function greet(name: string) {
  return \`你好，\${name}\`;
}
\`\`\`
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultContent);

  const renderedHtml = useMemo(() => {
    const raw = marked.parse(markdown, { breaks: true });
    return typeof raw === "string" ? DOMPurify.sanitize(raw) : "";
  }, [markdown]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Markdown 输入
        </span>
        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          className="h-80 rounded-2xl border border-white/5 bg-slate-900/80 p-4 font-mono text-xs text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>
      <div className="flex flex-col gap-2 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          实时预览
        </span>
        <div className="markdown-preview rounded-2xl border border-white/5 bg-slate-950/60 p-6">
          <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        </div>
      </div>
    </div>
  );
}

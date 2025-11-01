"use client";

import { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

type LayoutMode = "split" | "editor" | "preview";

type ToolbarAction =
  | {
      id: string;
      label: string;
      hint?: string;
      type: "wrap";
      before: string;
      after?: string;
      placeholder: string;
    }
  | {
      id: string;
      label: string;
      type: "line";
      prefix: string;
      placeholder: string;
    }
  | { id: string; label: string; type: "code-block" }
  | { id: string; label: string; type: "link" };

const defaultDocument = `# Markdown 在线编辑器\n\n欢迎使用 **Virgo 工具箱** Markdown 编辑器！\n\n- 支持常见格式化快捷操作\n- 可在左侧编辑、右侧预览\n- 统计字数、行数与字符数量\n\n> 点击上方按钮可快速插入标题、引用、列表等结构。\n\n\`\`\`ts\nfunction hello(name: string) {\n  return \`你好，\${name}!\`;\n}\n\`\`\`\n`;

const sanitizeHtml = (markdown: string) => {
  const parsed = marked.parse(markdown, { breaks: true });
  return typeof parsed === "string" ? DOMPurify.sanitize(parsed) : "";
};

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(defaultDocument);
  const [layout, setLayout] = useState<LayoutMode>("split");
  const [wrapText, setWrapText] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const renderedHtml = useMemo(() => sanitizeHtml(markdown), [markdown]);

  const stats = useMemo(() => {
    const lines = markdown ? markdown.split(/\r?\n/).length : 0;
    const words = markdown.trim()
      ? markdown
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;
    const chars = markdown.length;
    return { lines, words, chars };
  }, [markdown]);

  const focusTextarea = (start: number, end: number) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  };

  const applyWrappedFormat = (
    before: string,
    after: string = before,
    placeholder: string,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || placeholder;
    const nextValue =
      value.slice(0, selectionStart) +
      `${before}${selected}${after}` +
      value.slice(selectionEnd);
    setMarkdown(nextValue);
    const start = selectionStart + before.length;
    const end = start + selected.length;
    focusTextarea(start, end);
  };

  const applyLinePrefix = (prefix: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selection = value.slice(selectionStart, selectionEnd);

    if (!selection) {
      const insertion = `${prefix}${placeholder}`;
      const nextValue =
        value.slice(0, selectionStart) +
        insertion +
        value.slice(selectionEnd);
      setMarkdown(nextValue);
      const start = selectionStart + prefix.length;
      focusTextarea(start, start + placeholder.length);
      return;
    }

    const lines = selection.split(/\r?\n/);
    const formatted = lines
      .map((line) => `${prefix}${line || placeholder}`)
      .join("\n");
    const nextValue =
      value.slice(0, selectionStart) +
      formatted +
      value.slice(selectionEnd);
    setMarkdown(nextValue);
    focusTextarea(selectionStart, selectionStart + formatted.length);
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || "链接文本";
    const template = `[${selected}](https://example.com)`;
    const nextValue =
      value.slice(0, selectionStart) + template + value.slice(selectionEnd);
    setMarkdown(nextValue);
    const start = selectionStart + 1;
    focusTextarea(start, start + selected.length);
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || "console.log('Hello');";
    const template = `\`\`\`ts\n${selected}\n\`\`\``;
    const nextValue =
      value.slice(0, selectionStart) + template + value.slice(selectionEnd);
    setMarkdown(nextValue);
    const start = selectionStart + 6; // ```ts\n
    focusTextarea(start, start + selected.length);
  };

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toolbarActions: ToolbarAction[] = [
    {
      id: "bold",
      label: "加粗",
      hint: "Ctrl+B",
      type: "wrap",
      before: "**",
      after: "**",
      placeholder: "加粗文本",
    },
    {
      id: "italic",
      label: "斜体",
      hint: "Ctrl+I",
      type: "wrap",
      before: "*",
      after: "*",
      placeholder: "斜体文本",
    },
    {
      id: "heading",
      label: "标题",
      type: "line",
      prefix: "# ",
      placeholder: "标题",
    },
    {
      id: "quote",
      label: "引用",
      type: "line",
      prefix: "> ",
      placeholder: "引用内容",
    },
    {
      id: "list",
      label: "列表",
      type: "line",
      prefix: "- ",
      placeholder: "列表项",
    },
    {
      id: "code",
      label: "行内代码",
      type: "wrap",
      before: "`",
      after: "`",
      placeholder: "code",
    },
    { id: "code-block", label: "代码块", type: "code-block" },
    { id: "link", label: "链接", type: "link" },
  ];

  const handleToolbarAction = (action: ToolbarAction) => {
    switch (action.type) {
      case "wrap":
        applyWrappedFormat(
          action.before,
          action.after ?? action.before,
          action.placeholder,
        );
        break;
      case "line":
        applyLinePrefix(action.prefix, action.placeholder);
        break;
      case "code-block":
        insertCodeBlock();
        break;
      case "link":
        insertLink();
        break;
      default:
        break;
    }
  };

  const layoutOptions: Array<{ id: LayoutMode; label: string }> = [
    { id: "split", label: "分屏" },
    { id: "editor", label: "仅编辑" },
    { id: "preview", label: "仅预览" },
  ];

  const showEditor = layout !== "preview";
  const showPreview = layout !== "editor";
  const splitView = layout === "split" && showEditor && showPreview;

  return (
    <div className="space-y-6 text-sm text-slate-200">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {toolbarActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleToolbarAction(action)}
              title={action.hint ? `${action.label} · ${action.hint}` : action.label}
              className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-medium transition hover:border-sky-400/40 hover:bg-slate-900/80 hover:text-white"
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <div className="flex flex-wrap gap-2">
            {layoutOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLayout(option.id)}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  layout === option.id
                    ? "border-sky-400 bg-sky-500/20 text-white"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-sky-400/40 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline">·</span>
          <button
            type="button"
            onClick={() => setWrapText((prev) => !prev)}
            className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-white"
          >
            {wrapText ? "自动换行" : "长行滚动"}
          </button>
          <span className="hidden sm:inline">·</span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-white"
          >
            复制 Markdown
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-white"
          >
            下载 .md 文件
          </button>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span>字数：{stats.words}</span>
          <span>字符：{stats.chars}</span>
          <span>行数：{stats.lines}</span>
        </div>
      </div>

      <div className={`grid gap-5 ${splitView ? "lg:grid-cols-2" : ""}`}>
        {showEditor && (
          <label
            className={`flex flex-col gap-2 ${splitView ? "" : "lg:col-span-2"}`}
          >
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Markdown 内容
            </span>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              wrap={wrapText ? "soft" : "off"}
              spellCheck={false}
              className="min-h-80 rounded-2xl border border-white/5 bg-slate-900/80 p-4 font-mono text-xs text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
            />
          </label>
        )}
        {showPreview && (
          <div
            className={`flex flex-col gap-2 ${splitView ? "" : "lg:col-span-2"}`}
          >
            <span className="text-xs uppercase tracking-wide text-slate-400">
              实时预览
            </span>
            <div className="markdown-preview min-h-80 rounded-2xl border border-white/5 bg-slate-950/60 p-6">
              <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import MarkdownPreview from "@/components/tools/markdown-preview";

export const metadata: Metadata = {
  title: "Markdown 即时预览｜Virgo 工具箱",
  description:
    "在编辑 Markdown 的同时实时查看渲染效果，支持常见语法与代码块展示。",
};

export default function MarkdownPreviewPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="Markdown 即时预览"
        description="左侧输入 Markdown 文本，右侧实时呈现渲染结果，适用于撰写文档、记录笔记或分享格式化内容。"
        footer="提示：渲染结果已做基础的 HTML 清理，可安心复制用于内网或博客。"
      >
        <MarkdownPreview />
      </ToolCard>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import MarkdownEditor from "@/components/tools/markdown-editor";

export const metadata: Metadata = {
  title: "Markdown 在线编辑器｜Virgo 工具箱",
  description:
    "提供带格式化工具栏的 Markdown 在线编辑器，支持实时预览、字数统计与导出。",
};

export default function MarkdownEditorPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="Markdown 在线编辑器"
        description="带有常用格式化按钮与实时预览的 Markdown 编辑器，适合撰写文档、记录会议与分享内容。"
        footer="提示：所有操作均在浏览器本地完成，可直接复制或下载为 .md 文件。"
      >
        <MarkdownEditor />
      </ToolCard>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import TextCaseConverter from "@/components/tools/text-case-converter";

export const metadata: Metadata = {
  title: "文本大小写转换｜Virgo 工具箱",
  description:
    "在大写、小写、标题、驼峰、下划线等多种格式之间快速切换，辅助代码与文案整理。",
};

export default function TextCasePage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="文本大小写转换"
        description="选中需要的格式后输入或粘贴文本，即可一键转换为目标样式，支持驼峰、下划线与中划线。"
        footer="提示：可复制结果粘贴至代码或文档中，提升命名一致性。"
      >
        <TextCaseConverter />
      </ToolCard>
    </div>
  );
}

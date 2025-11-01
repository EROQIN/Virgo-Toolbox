import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import JsonFormatter from "@/components/tools/json-formatter";

export const metadata: Metadata = {
  title: "JSON 格式化校验｜Virgo 工具箱",
  description:
    "粘贴 JSON 文本即可完成格式化与语法校验，支持美化与压缩两种输出。",
};

export default function JsonFormatterPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="JSON 格式化校验"
        description="快速检查 JSON 结构是否有效，并生成美化或压缩的输出结果，便于调试接口与配置。"
        footer="提示：输出区域为只读，可直接复制粘贴到代码或接口测试工具中。"
      >
        <JsonFormatter />
      </ToolCard>
    </div>
  );
}

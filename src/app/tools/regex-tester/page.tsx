import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import RegexTester from "@/components/tools/regex-tester";

export const metadata: Metadata = {
  title: "正则表达式测试｜Virgo 工具箱",
  description:
    "在线调试 JavaScript 正则表达式，实时查看匹配结果、索引与捕获分组。",
};

export default function RegexTesterPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="正则表达式测试"
        description="输入正则表达式并选取标志位，通过示例文本实时查看匹配效果与捕获分组，帮助解析复杂模式。"
        footer="提示：默认使用 JavaScript 正则语法，支持分组命名与 Unicode 模式。"
      >
        <RegexTester />
      </ToolCard>
    </div>
  );
}

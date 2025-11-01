import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import UuidGenerator from "@/components/tools/uuid-generator";

export const metadata: Metadata = {
  title: "UUID 批量生成｜Virgo 工具箱",
  description:
    "使用浏览器随机数快速生成多个 UUID，支持控制大小写与连字符。",
};

export default function UuidGeneratorPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="UUID 批量生成"
        description="设置数量、大小写以及是否保留连字符，即可批量生成 UUID 并复制粘贴到项目中。"
        footer="提示：UUID 基于浏览器随机数生成，无需联网即可使用。"
      >
        <UuidGenerator />
      </ToolCard>
    </div>
  );
}

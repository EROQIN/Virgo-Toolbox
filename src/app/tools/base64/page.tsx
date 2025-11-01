import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import Base64Encoder from "@/components/tools/base64-encoder";

export const metadata: Metadata = {
  title: "Base64 编解码器｜Virgo 工具箱",
  description:
    "在浏览器端完成 Base64 编码与解码，支持 Unicode 文本，适合调试接口或快速编码小片段。",
};

export default function Base64Page() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="Base64 编解码器"
        description="输入原始文本即可完成 Base64 编码，或粘贴 Base64 字符串查看解码结果。所有操作均在本地浏览器内完成，不会上传数据。"
        footer="提示：Base64 输出可直接复制用于调试授权头、简单数据存储或快速分享片段。"
      >
        <Base64Encoder />
      </ToolCard>
    </div>
  );
}

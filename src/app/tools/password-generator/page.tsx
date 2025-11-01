import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import PasswordGenerator from "@/components/tools/password-generator";

export const metadata: Metadata = {
  title: "随机密码生成器｜Virgo 工具箱",
  description:
    "根据长度与字符类型生成随机密码，可选是否包含符号与相似字符。",
};

export default function PasswordGeneratorPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="随机密码生成器"
        description="自定义密码长度与字符组合，快速生成高强度随机密码，适用于账号注册与安全加固。"
        footer="提示：生成后及时保存至安全位置，避免重复使用同一密码。"
      >
        <PasswordGenerator />
      </ToolCard>
    </div>
  );
}

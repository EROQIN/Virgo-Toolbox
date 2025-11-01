import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import RandomStringGenerator from "@/components/tools/random-string";

export const metadata: Metadata = {
  title: "随机字符串生成｜Virgo 工具箱",
  description:
    "自定义字符集、长度与数量，批量生成随机字符串，适用于密钥、邀请码等场景。",
};

export default function RandomStringPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="随机字符串生成"
        description="勾选字符集并设置前后缀，即可生成指定长度的随机字符串，支持一次生成多条。"
        footer="提示：所有计算在本地完成，适合生成演示 token、测试数据等内容。"
      >
        <RandomStringGenerator />
      </ToolCard>
    </div>
  );
}

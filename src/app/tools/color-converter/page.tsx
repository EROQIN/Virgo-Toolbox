import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import ColorConverter from "@/components/tools/color-converter";

export const metadata: Metadata = {
  title: "颜色转换助手｜Virgo 工具箱",
  description:
    "在 HEX、RGB 与 HSL 之间轻松转换并实时预览颜色，帮助前端与设计协作。",
};

export default function ColorConverterPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="颜色转换助手"
        description="输入任意一种颜色格式，工具会自动同步其他格式，并提供可视化预览。"
        footer="提示：支持 #RGB / #RRGGBB、RGB 数值以及 HSL 数值输入。"
      >
        <ColorConverter />
      </ToolCard>
    </div>
  );
}

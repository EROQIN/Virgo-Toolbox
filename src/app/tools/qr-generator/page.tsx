import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import QrCodeGenerator from "@/components/tools/qr-code-generator";

export const metadata: Metadata = {
  title: "二维码生成器｜Virgo 工具箱",
  description:
    "生成自定义颜色与尺寸的二维码，可下载 PNG 文件，适用于分享链接、文本或临时标识。",
};

export default function QrGeneratorPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="二维码生成器"
        description="输入文本或链接即可生成二维码，支持调整纠错级别、尺寸与前景色/背景色，并下载为 PNG。"
        footer="提示：二维码图像由浏览器生成并保留在本地，请确认颜色对比度以确保识别度。"
      >
        <QrCodeGenerator />
      </ToolCard>
    </div>
  );
}

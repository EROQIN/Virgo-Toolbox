import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import BarcodeGenerator from "@/components/tools/barcode-generator";

export const metadata: Metadata = {
  title: "条形码生成器｜Virgo 工具箱",
  description:
    "支持多种常见格式（Code128、EAN-13 等）的条形码生成，可设置颜色并下载 SVG 文件。",
};

export default function BarcodeGeneratorPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="条形码生成器"
        description="输入内容并选择条形码格式，即可在浏览器内生成高分辨率 SVG，适合打印或嵌入文档。"
        footer="提示：不同格式对字符类型有要求，若生成失败请尝试更换格式或输入。"
      >
        <BarcodeGenerator />
      </ToolCard>
    </div>
  );
}

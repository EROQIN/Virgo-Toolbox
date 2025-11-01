import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import UnitConverter from "@/components/tools/unit-converter";

export const metadata: Metadata = {
  title: "单位换算助手｜Virgo 工具箱",
  description:
    "在同一界面快速完成长度、温度及存储单位的换算，适用于接口调试与日常估算。",
};

export default function UnitConverterPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="单位换算助手"
        description="选择类别与单位后输入数值，即可实时得到换算结果。支持长度（米、千米、英尺等）、温度（摄氏度、华氏度、开尔文）及存储容量（B、KB、MB、GB、TB）。"
        footer="提示：换算结果保留适中的小数位，便于复制到文档或需求说明中。"
      >
        <UnitConverter />
      </ToolCard>
    </div>
  );
}

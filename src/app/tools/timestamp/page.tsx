import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import TimestampConverter from "@/components/tools/timestamp-converter";

export const metadata: Metadata = {
  title: "时间戳转换器｜Virgo 工具箱",
  description:
    "在 Unix 时间戳与本地日期时间之间快速互转，支持秒、毫秒与纳秒精度。",
};

export default function TimestampPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="时间戳转换器"
        description="输入时间戳或选择本地日期时间，系统将实时同步另一侧的结果，让调试接口和排查日志更高效。"
        footer="提示：注意区分秒、毫秒与纳秒时间戳，避免换算误差。"
      >
        <TimestampConverter />
      </ToolCard>
    </div>
  );
}

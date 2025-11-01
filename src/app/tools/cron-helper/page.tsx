import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import CronHelper from "@/components/tools/cron-helper";

export const metadata: Metadata = {
  title: "Cron 表达式助手｜Virgo 工具箱",
  description:
    "解析 Cron 表达式并计算即将执行的时间，提供常用模板与字段说明。",
};

export default function CronHelperPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="Cron 表达式助手"
        description="快速理解 Cron 字段含义，选择模板或手动编辑表达式，立即查看未来运行时间。"
        footer="提示：当前按照浏览器本地时间计算，可用于调试定时任务。"
      >
        <CronHelper />
      </ToolCard>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import WordCounter from "@/components/tools/word-counter";

export const metadata: Metadata = {
  title: "字数统计与阅读时间｜Virgo 工具箱",
  description:
    "快速统计文本的词数、字符数、行数与预估阅读时间，辅助内容校对与排版。",
};

export default function WordCounterPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="字数统计与阅读时间"
        description="粘贴或输入文本即可实时查看词数、字符数（含/不含空白）、行数以及预估阅读时间，帮助你快速评估内容长度。"
        footer="提示：阅读时间基于每分钟 200 词的平均速度，你可按需调整判断标准。"
      >
        <WordCounter />
      </ToolCard>
    </div>
  );
}

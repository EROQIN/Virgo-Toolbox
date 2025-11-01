import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import MusicPlayer from "@/components/tools/music-player";

export const metadata: Metadata = {
  title: "专注音乐播放器｜Virgo 工具箱",
  description:
    "精选适合编码时聆听的 Lo-Fi 播放列表，支持播放控制与进度调节，让你在浏览器内沉浸式工作。",
};

export default function MusicPlayerPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="专注音乐播放器"
        description="挑选专注与放松的背景音乐，在浏览器里直接播放，支持切换曲目与进度预览。"
        footer="提示：播放受到浏览器自动播放策略限制，若暂停请点击播放按钮重新开始。"
      >
        <MusicPlayer />
      </ToolCard>
    </div>
  );
}

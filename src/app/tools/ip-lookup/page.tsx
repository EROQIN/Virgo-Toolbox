import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import IpLookup from "@/components/tools/ip-lookup";

export const metadata: Metadata = {
  title: "IP 地址查询｜Virgo 工具箱",
  description:
    "使用 ipify 服务在浏览器内获取当前公网 IP，方便排查网络问题或与团队共享。",
};

export default function IpLookupPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
      >
        返回首页
      </Link>
      <ToolCard
        title="IP 地址查询"
        description="点击按钮即可获取当前公网 IP 地址，数据通过 ipify 接口返回，整个过程在浏览器完成。"
        footer="提示：切换网络或 VPN 后请重新获取，以保证显示的是最新 IP。"
      >
        <IpLookup />
      </ToolCard>
    </div>
  );
}

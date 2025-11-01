"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import ToolTile from "@/components/tool-tile";
import {
  TOOL_CATEGORIES,
  TOOL_LIST,
  type ToolCategory,
} from "@/data/tools";
import { useIsDarkTheme } from "@/components/theme-provider";

const ALL_CATEGORY = "全部";

const categoriesWithAll: Array<{ id: ToolCategory | typeof ALL_CATEGORY; label: string }> = [
  { id: ALL_CATEGORY, label: "全部" },
  ...TOOL_CATEGORIES,
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKC")
    .trim();

export default function Home() {
  const isDark = useIsDarkTheme();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ToolCategory | typeof ALL_CATEGORY>(ALL_CATEGORY);

  const filteredTools = useMemo(() => {
    const search = normalize(query);
    return TOOL_LIST.filter((tool) => {
      const matchCategory =
        activeCategory === ALL_CATEGORY || tool.category === activeCategory;

      if (!matchCategory) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = [
        tool.title,
        tool.summary,
        tool.description,
        tool.category,
        tool.badge,
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [activeCategory, query]);

  const badgeClass = isDark
    ? "border-sky-500/40 bg-sky-500/10 text-sky-200/90"
    : "border-sky-400/40 bg-sky-100 text-sky-600";
  const headingClass = isDark ? "text-white" : "text-slate-900";
  const descClass = isDark ? "text-slate-300" : "text-slate-600";
  const searchInputClass = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-100"
    : "border-slate-200/70 bg-white text-slate-800 shadow-sm";
  const searchIconClass = isDark ? "text-slate-400" : "text-slate-500";
  const inactiveChip = isDark
    ? "bg-slate-900/60 text-slate-300 hover:bg-slate-900/80"
    : "bg-white text-slate-600 shadow-sm hover:bg-slate-100";
  const summaryText = isDark ? "text-slate-400" : "text-slate-500";
  const footerClass = isDark
    ? "border-white/10 text-slate-500"
    : "border-slate-200 text-slate-500";

  return (
    <PageShell contentClassName="space-y-16">
      <header className="max-w-3xl space-y-6">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold tracking-[0.35em] transition ${badgeClass}`}
        >
          VIRGO
        </span>
        <div className="space-y-4">
          <h1
            className={`text-4xl font-semibold leading-tight transition md:text-5xl md:leading-[1.15] ${headingClass}`}
          >
            Virgo 工具箱
          </h1>
          <p className={`text-base transition md:text-lg ${descClass}`}>
            一个面向开发者的在线工具导航站。通过搜索或分类筛选，快速找到你需要的前端小工具。
          </p>
        </div>
        <div className="space-y-4">
          <label className="block" htmlFor="tool-search">
            <span className="sr-only">搜索工具</span>
            <div className="relative">
              <div
                className={`pointer-events-none absolute inset-y-0 left-4 flex items-center ${searchIconClass}`}
              >
                <svg
                  aria-hidden
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m16.25 16.25-3.219-3.219m0 0a5.625 5.625 0 1 0-7.957-7.957 5.625 5.625 0 0 0 7.957 7.957Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                id="tool-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索工具、关键词或分类…"
                className={`h-12 w-full rounded-full border pl-12 pr-5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${searchInputClass}`}
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {categoriesWithAll.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category.id
                    ? "bg-sky-500 text-white shadow-[0_10px_35px_rgba(14,116,144,0.35)]"
                    : inactiveChip
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <p className={`text-sm ${summaryText}`}>
            找到 {filteredTools.length} 个工具，点击进入单独页面即可使用。
          </p>
        </div>
      </header>
      {filteredTools.length ? (
        <section
          id="tools"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          aria-label="工具导航"
        >
          {filteredTools.map((tool) => (
            <ToolTile key={tool.slug} tool={tool} />
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-10 text-center text-slate-300">
          未找到匹配的工具，尝试更换搜索词或切换分类。
        </div>
      )}
      <footer
        className={`flex flex-col gap-2 border-t pt-6 text-sm transition md:flex-row md:items-center md:justify-between ${footerClass}`}
      >
        <span>当前共收录 {TOOL_LIST.length} 个工具，持续更新中。</span>
        <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:gap-4">
          <Link
            href="https://vercel.com/new/clone?repository-url=https://github.com/EROQIN/Virgo-Toolbox&project-name=virgo-toolbox&repository-name=virgo-toolbox"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 transition hover:text-sky-300"
          >
            一键部署到 Vercel
          </Link>
          <span className="text-xs text-slate-400 md:text-sm">
            作者：
            <Link
              href="https://github.com/EROQIN"
              target="_blank"
              rel="noopener noreferrer"
              className="pl-1 text-sky-400 transition hover:text-sky-300"
            >
              Erokin / @EROQIN
            </Link>
          </span>
        </div>
      </footer>
    </PageShell>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useIsDarkTheme } from "@/components/theme-provider";

type FlagOption = {
  id: string;
  label: string;
  description: string;
};

const DEFAULT_TEXT = `Virgo 工具箱
快速匹配常见模式，例如：
- 邮箱：dev@example.com
- URL：https://virgo.dev/tools
- 版本号：v1.2.3`;

const FLAG_OPTIONS: FlagOption[] = [
  { id: "g", label: "全局 (g)", description: "查找所有匹配" },
  { id: "i", label: "忽略大小写 (i)", description: "忽略大小写差异" },
  { id: "m", label: "多行 (m)", description: "^ 和 $ 匹配每一行" },
  { id: "s", label: "单行 (s)", description: "点号匹配换行符" },
  { id: "u", label: "Unicode (u)", description: "使用 Unicode 模式" },
];

type MatchResult = {
  index: number;
  match: string;
  groups: Record<string, string | undefined>;
};

const highlightMatches = (text: string, matches: MatchResult[]) => {
  if (!matches.length) {
    return [{ key: "plain-0", text, matched: false }];
  }

  const segments: Array<{ key: string; text: string; matched: boolean }> = [];
  let cursor = 0;
  matches.forEach((item, idx) => {
    if (item.index > cursor) {
      segments.push({
        key: `plain-${idx}-${cursor}`,
        text: text.slice(cursor, item.index),
        matched: false,
      });
    }
    const end = item.index + item.match.length;
    segments.push({
      key: `match-${idx}-${item.index}`,
      text: text.slice(item.index, end),
      matched: true,
    });
    cursor = end;
  });
  if (cursor < text.length) {
    segments.push({
      key: `plain-tail-${cursor}`,
      text: text.slice(cursor),
      matched: false,
    });
  }
  return segments;
};

export default function RegexTester() {
  const isDark = useIsDarkTheme();
  const [pattern, setPattern] = useState(String.raw`([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)`);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [flags, setFlags] = useState<string[]>(["g"]);

  const { matches, error } = useMemo(() => {
    if (!pattern) {
      return { matches: [] as MatchResult[], error: null as string | null };
    }
    try {
      const flagString = Array.from(new Set(flags)).join("");
      const regexp = new RegExp(pattern, flagString);
      const found: MatchResult[] = [];

      if (flagString.includes("g")) {
        let result = regexp.exec(text);
        while (result) {
          const groups: Record<string, string | undefined> = {};
          if (result.groups) {
            Object.keys(result.groups).forEach((key) => {
              groups[key] = result?.groups?.[key];
            });
          }
          result.slice(1).forEach((value, idx) => {
            groups[`$${idx + 1}`] = value ?? "";
          });
          found.push({
            index: result.index,
            match: result[0] ?? "",
            groups,
          });
          result = regexp.exec(text);
        }
      } else {
        const result = regexp.exec(text);
        if (result) {
          const groups: Record<string, string | undefined> = {};
          if (result.groups) {
            Object.keys(result.groups).forEach((key) => {
              groups[key] = result?.groups?.[key];
            });
          }
          result.slice(1).forEach((value, idx) => {
            groups[`$${idx + 1}`] = value ?? "";
          });
          found.push({
            index: result.index,
            match: result[0] ?? "",
            groups,
          });
        }
      }
      return { matches: found, error: null };
    } catch (parseError) {
      return {
        matches: [],
        error:
          parseError instanceof Error
            ? parseError.message
            : "正则表达式无效，请检查语法。",
      };
    }
  }, [flags, pattern, text]);

  const highlighted = useMemo(
    () => highlightMatches(text, matches),
    [matches, text],
  );

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag)
        ? prev.filter((item) => item !== flag)
        : [...prev, flag],
    );
  };

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const inputContainer = isDark
    ? "border-white/5 bg-slate-900/80 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";
  const flagInactive = isDark
    ? "border-white/10 bg-slate-900/60 text-slate-300"
    : "border-slate-200/60 bg-white/85 text-slate-600";
  const flagActive = isDark
    ? "border-sky-400/50 bg-sky-500/15 text-white"
    : "border-sky-400/60 bg-sky-100 text-sky-700";
  const previewPanel = isDark
    ? "border-white/10 bg-slate-950/60 text-slate-200"
    : "border-slate-200/60 bg-white/85 text-slate-700";
  const matchesPanel = isDark
    ? "border-sky-500/30 bg-slate-950/60 text-slate-200"
    : "border-sky-400/40 bg-white/85 text-slate-700";
  const matchItem = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/80";
  const markClass = isDark
    ? "rounded-lg bg-sky-500/30 px-1 text-white"
    : "rounded-lg bg-sky-200 px-1 text-slate-900";

  return (
    <div className={`flex flex-col gap-5 text-sm transition-colors duration-300 ${baseText}`}>
      <label className="flex flex-col gap-2">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          正则表达式
        </span>
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2 ${inputContainer}`}>
          <span className={labelText}>/</span>
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="输入正则表达式，例如 ^\\d+$"
          />
          <span className={labelText}>/</span>
          <input
            value={flags.join("")}
            readOnly
            aria-label="Flags"
            className={`w-16 bg-transparent text-right font-mono text-xs outline-none ${labelText}`}
          />
        </div>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        {FLAG_OPTIONS.map((flag) => (
          <button
            key={flag.id}
            type="button"
            onClick={() => toggleFlag(flag.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              flags.includes(flag.id) ? flagActive : flagInactive
            }`}
          >
            <div className="font-semibold">{flag.label}</div>
            <div className={`mt-1 text-xs ${labelText}`}>
              {flag.description}
            </div>
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          测试文本
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={`h-44 rounded-2xl border p-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${
            isDark
              ? "border-white/5 bg-slate-900/80 text-slate-100"
              : "border-slate-200/60 bg-white text-slate-800"
          }`}
        />
      </label>

      <div className={`rounded-2xl border p-4 font-mono text-sm leading-relaxed transition-colors duration-300 ${previewPanel}`}>
        {highlighted.map((segment) =>
          segment.matched ? (
            <mark
              key={segment.key}
              className={markClass}
            >
              {segment.text}
            </mark>
          ) : (
            <span key={segment.key}>{segment.text}</span>
          ),
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : matches.length ? (
        <div className={`rounded-2xl border p-4 transition-colors duration-300 ${matchesPanel}`}>
          <p className={`text-xs uppercase tracking-wide ${labelText}`}>
            匹配结果（{matches.length}）
          </p>
          <ul className="mt-3 space-y-3">
            {matches.map((item, idx) => (
              <li
                key={`${item.index}-${idx}`}
                className={`rounded-xl border p-3 transition-colors duration-300 ${matchItem}`}
              >
                <div className={`flex items-center justify-between text-xs ${labelText}`}>
                  <span>索引：{item.index}</span>
                  <span>长度：{item.match.length}</span>
                </div>
                <div
                  className={`mt-2 font-mono text-sm ${
                    isDark ? "text-sky-200" : "text-sky-600"
                  }`}
                >
                  {item.match}
                </div>
                {Object.keys(item.groups).length ? (
                  <div className={`mt-2 space-y-1 text-xs ${baseText}`}>
                    {Object.entries(item.groups).map(([key, value]) => (
                      <div key={key}>
                        <span className={labelText}>{key}：</span>
                        <span>{value ?? ""}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={`text-xs ${labelText}`}>
          未找到匹配结果，尝试调整表达式或输入文本。
        </p>
      )}
    </div>
  );
}

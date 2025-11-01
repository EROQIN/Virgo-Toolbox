"use client";

import { useMemo, useState } from "react";
import { useIsDarkTheme } from "@/components/theme-provider";

const CHARSETS = [
  { id: "upper", label: "大写字母 A-Z", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { id: "lower", label: "小写字母 a-z", chars: "abcdefghijklmnopqrstuvwxyz" },
  { id: "number", label: "数字 0-9", chars: "0123456789" },
  {
    id: "symbol",
    label: "符号 !@#",
    chars: "!@#$%^&*()-_=+[]{};:,.<>/?",
  },
];

type Options = {
  length: number;
  count: number;
  selected: Record<string, boolean>;
  prefix: string;
  suffix: string;
};

const DEFAULT_SELECTED = CHARSETS.reduce<Record<string, boolean>>(
  (result, item) => {
    result[item.id] = item.id !== "symbol";
    return result;
  },
  {},
);

const buildPool = (selected: Record<string, boolean>) => {
  return CHARSETS.filter((item) => selected[item.id])
    .map((item) => item.chars)
    .join("");
};

const generateStrings = (options: Options) => {
  const pool = buildPool(options.selected);
  if (!pool) {
    throw new Error("请至少选择一种字符集。");
  }
  const result: string[] = [];
  const array = new Uint32Array(options.length);
  for (let i = 0; i < options.count; i += 1) {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      array.forEach((_, index) => {
        array[index] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      });
    }
    let value = "";
    for (let index = 0; index < options.length; index += 1) {
      const randomIndex = array[index] % pool.length;
      value += pool[randomIndex] ?? "";
    }
    result.push(`${options.prefix}${value}${options.suffix}`);
  }
  return result;
};

export default function RandomStringGenerator() {
  const isDark = useIsDarkTheme();
  const [options, setOptions] = useState<Options>({
    length: 12,
    count: 5,
    selected: DEFAULT_SELECTED,
    prefix: "",
    suffix: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [strings, setStrings] = useState<string[]>(() => generateStrings(options));

  const poolPreview = useMemo(
    () => buildPool(options.selected).slice(0, 20),
    [options.selected],
  );

  const regenerate = () => {
    try {
      const generated = generateStrings(options);
      setStrings(generated);
      setError(null);
    } catch (issue) {
      setStrings([]);
      setError(
        issue instanceof Error ? issue.message : "生成失败，请重试。",
      );
    }
  };

  const handleCopy = async () => {
    if (!strings.length) return;
    try {
      await navigator.clipboard.writeText(strings.join("\n"));
    } catch {
      // ignore
    }
  };

  const toggleCharset = (id: string) => {
    setOptions((prev) => ({
      ...prev,
      selected: { ...prev.selected, [id]: !prev.selected[id] },
    }));
  };

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const panelClass = isDark
    ? "border-white/10 bg-slate-900/70"
    : "border-slate-200/60 bg-white/85";
  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const badgeActive = isDark
    ? "bg-sky-500/20 text-white"
    : "bg-sky-100 text-sky-700 border-sky-400/40";
  const badgeInactive = isDark
    ? "border-white/10 bg-slate-900/60 text-slate-300 hover:border-sky-400/40 hover:bg-slate-900/70"
    : "border-slate-200/60 bg-white/80 text-slate-600 hover:border-sky-400/40 hover:bg-white";
  const secondaryButton = isDark
    ? "border-white/10 text-slate-200 hover:border-sky-400 hover:text-white"
    : "border-slate-200/60 text-slate-600 hover:border-sky-400 hover:text-slate-900";
  const textAreaClass = isDark
    ? "border-white/5 bg-slate-950/60 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";

  return (
    <div className={`flex flex-col gap-5 text-sm ${baseText}`}>
      <div className="grid gap-3 md:grid-cols-2">
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            字符串长度
          </span>
          <input
            type="number"
            min={4}
            max={128}
            value={options.length}
            onChange={(event) =>
              setOptions((prev) => ({
                ...prev,
                length: Math.min(128, Math.max(4, Number(event.target.value))),
              }))
            }
            className={`h-9 rounded-lg border px-2 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            生成数量
          </span>
          <input
            type="number"
            min={1}
            max={100}
            value={options.count}
            onChange={(event) =>
              setOptions((prev) => ({
                ...prev,
                count: Math.min(100, Math.max(1, Number(event.target.value))),
              }))
            }
            className={`h-9 rounded-lg border px-2 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            前缀
          </span>
          <input
            value={options.prefix}
            onChange={(event) =>
              setOptions((prev) => ({ ...prev, prefix: event.target.value }))
            }
            className={`h-9 rounded-lg border px-2 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            后缀
          </span>
          <input
            value={options.suffix}
            onChange={(event) =>
              setOptions((prev) => ({ ...prev, suffix: event.target.value }))
            }
            className={`h-9 rounded-lg border px-2 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
      </div>

      <div className="space-y-3">
        <p className={`text-xs uppercase tracking-wide ${labelText}`}>
          字符集选择
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {CHARSETS.map((charset) => (
            <button
              key={charset.id}
              type="button"
              onClick={() => toggleCharset(charset.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                options.selected[charset.id] ? badgeActive : badgeInactive
              }`}
            >
              <div className="font-semibold">{charset.label}</div>
              <div className={`mt-2 text-xs ${labelText}`}>
                示例：{charset.chars.slice(0, 12)}
              </div>
            </button>
          ))}
        </div>
        <p className={`text-xs ${labelText}`}>
          当前字符池预览：{poolPreview || "尚未选择字符集"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={regenerate}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          重新生成
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${secondaryButton}`}
        >
          复制全部
        </button>
        {error ? (
          <span className="text-xs text-rose-300">{error}</span>
        ) : (
          <span className={`text-xs ${labelText}`}>
            使用浏览器生成随机数，生成结果仅保存在本地。
          </span>
        )}
      </div>

      <textarea
        value={strings.join("\n")}
        readOnly
        className={`h-48 rounded-2xl border p-4 font-mono text-xs outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40 ${textAreaClass}`}
      />
    </div>
  );
}

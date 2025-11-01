"use client";

import { useMemo, useState } from "react";
import CronExpressionParser from "cron-parser";
import { useIsDarkTheme } from "@/components/theme-provider";

const TEMPLATES: Array<{ label: string; expression: string; description: string }> = [
  { label: "每分钟", expression: "* * * * *", description: "每分钟执行一次任务" },
  { label: "每小时第 0 分钟", expression: "0 * * * *", description: "例如整点发送提醒" },
  { label: "每天 09:30", expression: "30 9 * * *", description: "每天上午 9:30 执行" },
  { label: "每周一 10:00", expression: "0 10 * * 1", description: "每周一上午 10 点" },
  { label: "每月 1 日 08:00", expression: "0 8 1 * *", description: "月初生成报表" },
];

const FIELD_LABELS = ["分", "时", "日", "月", "周"];

export default function CronHelper() {
  const isDark = useIsDarkTheme();
  const [expression, setExpression] = useState("*/5 * * * *");
  const [count, setCount] = useState(5);

  const { times, error } = useMemo(() => {
    try {
      const interval = CronExpressionParser.parse(expression, {
        currentDate: new Date(),
      });
      const upcoming: string[] = [];
      for (let index = 0; index < count; index += 1) {
        const date = interval.next().toDate();
        upcoming.push(
          new Intl.DateTimeFormat("zh-Hans", {
            dateStyle: "full",
            timeStyle: "medium",
          }).format(date),
        );
      }
      return { times: upcoming, error: null as string | null };
    } catch (parseError) {
      return {
        times: [],
        error:
          parseError instanceof Error
            ? parseError.message
            : "表达式无效，请检查语法。",
      };
    }
  }, [count, expression]);

  const fields = expression.trim().split(/\s+/);

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/5 bg-slate-900/80 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";
  const panelClass = isDark
    ? "border-white/10 bg-slate-950/60"
    : "border-slate-200/60 bg-white/85";
  const cardClass = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/80";
  const buttonInactive = isDark
    ? "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
    : "bg-white/80 text-slate-600 hover:bg-slate-200";
  const timesPanel = isDark
    ? "border-sky-500/30 bg-slate-950/60"
    : "border-sky-400/30 bg-white/85";
  const timesItem = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/80";

  return (
    <div className={`flex flex-col gap-5 text-sm ${baseText}`}>
      <label className="flex flex-col gap-2">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          Cron 表达式
        </span>
        <input
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="如 */5 * * * *"
          className={`h-11 rounded-2xl border px-4 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
        />
      </label>

      <div className={`rounded-2xl border p-4 transition-colors duration-300 ${panelClass}`}>
        <p className={`text-xs uppercase tracking-wide ${labelText}`}>
          字段说明（标准 5 字段）
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          {FIELD_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`rounded-xl border p-3 text-center text-xs ${cardClass}`}
            >
              <p className={labelText}>{label}</p>
              <p className={`mt-2 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {fields[idx] ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          预览次数
        </span>
        {[3, 5, 10].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCount(value)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              count === value
                ? "bg-sky-500 text-white"
                : buttonInactive
            }`}
          >
            {value} 次
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 transition-colors duration-300 ${panelClass}`}>
        <p className={`text-xs uppercase tracking-wide ${labelText}`}>
          常用模板
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.expression}
              type="button"
              onClick={() => setExpression(template.expression)}
              className={`rounded-2xl border p-3 text-left transition hover:border-sky-400/40 ${cardClass}`}
            >
              <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {template.label}
              </div>
              <div className={`mt-1 text-xs ${labelText}`}>
                {template.expression}
              </div>
              <p className="mt-2 text-xs">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : (
        <div className={`rounded-2xl border p-4 transition-colors duration-300 ${timesPanel}`}>
          <p className={`text-xs uppercase tracking-wide ${labelText}`}>
            即将执行的时间
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {times.map((time) => (
              <li
                key={time}
                className={`rounded-xl border px-4 py-2 transition-colors duration-300 ${timesItem}`}
              >
                {time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

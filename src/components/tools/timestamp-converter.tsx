"use client";

import { useMemo, useState } from "react";

type Unit = "seconds" | "milliseconds" | "nanoseconds";

const NANOS_PER_MILLISECOND = BigInt(1000000);
const BIGINT_ZERO = BigInt(0);

const getTimestampValue = (date: Date, precision: Unit) => {
  const milliseconds = Math.floor(date.getTime());
  if (precision === "seconds") {
    return String(Math.floor(milliseconds / 1000));
  }
  if (precision === "milliseconds") {
    return String(milliseconds);
  }
  return (BigInt(milliseconds) * NANOS_PER_MILLISECOND).toString();
};

const formatDateTimeLocal = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const formatReadable = (date: Date) =>
  new Intl.DateTimeFormat("zh-Hans", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);

export default function TimestampConverter() {
  const [unit, setUnit] = useState<Unit>("milliseconds");
  const [timestampInput, setTimestampInput] = useState("");
  const [datetimeInput, setDatetimeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<Date | null>(null);

  const readable = useMemo(() => {
    if (!activeDate) return "";
    return formatReadable(activeDate);
  }, [activeDate]);

  const applyDate = (
    date: Date,
    options?: {
      infoMessage?: string | null;
      timestampOverride?: string;
    }
  ) => {
    setActiveDate(date);
    const timestampValue = options?.timestampOverride ?? getTimestampValue(date, unit);
    setTimestampInput(timestampValue);
    setDatetimeInput(formatDateTimeLocal(date));
    setError(null);
    setInfo(options?.infoMessage ?? null);
  };

  const handleTimestampChange = (value: string) => {
    setTimestampInput(value);
    if (!value.trim()) {
      setError(null);
      setActiveDate(null);
      return;
    }
    if (unit === "nanoseconds") {
      let numeric: bigint;
      try {
        numeric = BigInt(value);
      } catch {
        setError("请输入合法的数字时间戳。");
        setInfo(null);
        setActiveDate(null);
        return;
      }
      const millisecondsBigInt = numeric / NANOS_PER_MILLISECOND;
      const remainder = numeric % NANOS_PER_MILLISECOND;
      const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
      if (millisecondsBigInt > maxSafe || millisecondsBigInt < -maxSafe) {
        setError("该时间戳超出可转换范围。");
        setInfo(null);
        setActiveDate(null);
        return;
      }
      const millisecondsNumber = Number(millisecondsBigInt);
      const date = new Date(millisecondsNumber);
      if (Number.isNaN(date.getTime())) {
        setError("该时间戳无法转换为有效日期。");
        setInfo(null);
        setActiveDate(null);
        return;
      }
      const infoMessage =
        remainder !== BIGINT_ZERO
          ? `纳秒时间戳超出 JavaScript 日期精度，已舍弃余数 ${remainder} 纳秒。`
          : undefined;
      applyDate(date, {
        infoMessage: infoMessage ?? null,
        timestampOverride: remainder === BIGINT_ZERO ? undefined : value,
      });
      return;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      setError("请输入合法的数字时间戳。");
      setInfo(null);
      setActiveDate(null);
      return;
    }
    const milliseconds = unit === "seconds" ? numeric * 1000 : numeric;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) {
      setError("该时间戳无法转换为有效日期。");
      setInfo(null);
      setActiveDate(null);
      return;
    }
    applyDate(date);
  };

  const handleDatetimeChange = (value: string) => {
    setDatetimeInput(value);
    if (!value) {
      setError(null);
      setActiveDate(null);
      return;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setError("请输入合法的日期时间。");
      setInfo(null);
      setActiveDate(null);
      return;
    }
    applyDate(date);
  };

  const handleUnitChange = (nextUnit: Unit) => {
    if (unit === nextUnit) return;
    setUnit(nextUnit);
    if (!activeDate) return;
    setTimestampInput(getTimestampValue(activeDate, nextUnit));
    setInfo(null);
  };

  const handleNow = () => {
    applyDate(new Date());
  };

  const handleCopy = async () => {
    if (!timestampInput) return;
    try {
      await navigator.clipboard.writeText(timestampInput);
      setInfo("时间戳已复制到剪贴板。");
      setError(null);
      setTimeout(() => {
        setInfo(null);
      }, 1800);
    } catch {
      setError("复制失败，请手动复制。");
      setInfo(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-sm text-slate-200">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          精度
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleUnitChange("milliseconds")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              unit === "milliseconds"
                ? "bg-sky-500 text-white"
                : "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            毫秒
          </button>
          <button
            type="button"
            onClick={() => handleUnitChange("seconds")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              unit === "seconds"
                ? "bg-sky-500 text-white"
                : "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            秒
          </button>
          <button
            type="button"
            onClick={() => handleUnitChange("nanoseconds")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              unit === "nanoseconds"
                ? "bg-sky-500 text-white"
                : "bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            纳秒
          </button>
        </div>
        <button
          type="button"
          onClick={handleNow}
          className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
        >
          使用当前时间
        </button>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          时间戳
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={timestampInput}
            onChange={(event) => handleTimestampChange(event.target.value)}
            placeholder={
              unit === "seconds"
                ? "例如：1704096000"
                : unit === "milliseconds"
                ? "例如：1704096000000"
                : "例如：1704096000000000000"
            }
            className="h-11 w-full rounded-2xl border border-white/5 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-2xl border border-white/10 px-4 text-xs font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            复制
          </button>
        </div>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          日期时间（本地时区）
        </span>
        <input
          type="datetime-local"
          value={datetimeInput}
          onChange={(event) => handleDatetimeChange(event.target.value)}
          className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      {readable ? (
        <div className="rounded-2xl border border-sky-500/30 bg-slate-950/60 p-4 text-slate-100">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            可读格式
          </p>
          <p className="mt-1 text-lg font-semibold">{readable}</p>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : info ? (
        <p className="text-xs text-sky-300">{info}</p>
      ) : (
        <p className="text-xs text-slate-400">
          提示：上方日期使用本地时区显示，复制时间戳时请确认当前精度（秒、毫秒或纳秒）。
        </p>
      )}
    </div>
  );
}

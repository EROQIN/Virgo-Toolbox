"use client";

import { useMemo, useState } from "react";
import { useIsDarkTheme } from "@/components/theme-provider";

type Options = {
  count: number;
  uppercase: boolean;
  withHyphen: boolean;
};

const generateUuid = (options: Options) => {
  const list: string[] = [];
  for (let index = 0; index < options.count; index += 1) {
    let uuid = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
          const random = Math.floor(Math.random() * 16);
          const value = char === "x" ? random : (random % 4) + 8;
          return value.toString(16);
        });
    if (!options.withHyphen) {
      uuid = uuid.replace(/-/g, "");
    }
    if (options.uppercase) {
      uuid = uuid.toUpperCase();
    }
    list.push(uuid);
  }
  return list;
};

export default function UuidGenerator() {
  const isDark = useIsDarkTheme();
  const [options, setOptions] = useState<Options>({
    count: 5,
    uppercase: false,
    withHyphen: true,
  });
  const [uuids, setUuids] = useState<string[]>(() =>
    generateUuid({
      count: 5,
      uppercase: false,
      withHyphen: true,
    }),
  );
  const joined = useMemo(() => uuids.join("\n"), [uuids]);

  const updateOptions = (updater: (prev: Options) => Options) => {
    setOptions((previous) => {
      const next = updater(previous);
      setUuids(generateUuid(next));
      return next;
    });
  };

  const handleCopy = async () => {
    if (!joined) return;
    try {
      await navigator.clipboard.writeText(joined);
    } catch {
      // ignore
    }
  };

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const panelClass = isDark
    ? "border-white/10 bg-slate-900/70"
    : "border-slate-200/60 bg-white/85";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-slate-950/70 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";
  const secondaryButton = isDark
    ? "border-white/10 text-slate-200 hover:border-sky-400 hover:text-white"
    : "border-slate-200/60 text-slate-600 hover:border-sky-400 hover:text-slate-900";

  return (
    <div className={`flex flex-col gap-5 text-sm ${baseText}`}>
      <div className="grid gap-3 sm:grid-cols-3">
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
              updateOptions((prev) => ({
                ...prev,
                count: Math.min(100, Math.max(1, Number(event.target.value))),
              }))
            }
            className={`h-9 rounded-lg border px-2 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
        <ToggleOption
          label="大写字母"
          description="将 UUID 转为大写"
          value={options.uppercase}
          onChange={(value) =>
            updateOptions((prev) => ({ ...prev, uppercase: value }))
          }
        />
        <ToggleOption
          label="保留连字符"
          description="是否保留标准 UUID 中的连字符"
          value={options.withHyphen}
          onChange={(value) =>
            updateOptions((prev) => ({ ...prev, withHyphen: value }))
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setUuids(generateUuid(options))}
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
        <span className={`text-xs ${labelText}`}>
          使用浏览器内置随机数生成器，无需后端。
        </span>
      </div>

      <textarea
        value={joined}
        readOnly
        className={`h-48 rounded-2xl border p-4 font-mono text-xs outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40 ${
          isDark
            ? "border-white/5 bg-slate-950/60 text-slate-100"
            : "border-slate-200/60 bg-white text-slate-800"
        }`}
      />
    </div>
  );
}

function ToggleOption({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const isDark = useIsDarkTheme();
  const baseClass = isDark
    ? "border-white/10 bg-slate-900/60 text-slate-300 hover:border-sky-400/40 hover:bg-slate-900/70"
    : "border-slate-200/60 bg-white/85 text-slate-600 hover:border-sky-400/40 hover:bg-white";
  const activeClass = isDark
    ? "bg-sky-500/20 text-white"
    : "bg-sky-100 text-sky-700 border-sky-400/50";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex h-full flex-col items-start justify-between rounded-2xl border p-4 text-left transition ${
        value ? activeClass : baseClass
      }`}
    >
      <span className="font-semibold">{label}</span>
      <span className={`mt-2 text-xs ${labelText}`}>{description}</span>
    </button>
  );
}

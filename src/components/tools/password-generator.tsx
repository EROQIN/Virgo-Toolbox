"use client";

import { useMemo, useState } from "react";

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

type Options = {
  length: number;
  useLower: boolean;
  useUpper: boolean;
  useNumber: boolean;
  useSymbol: boolean;
  avoidSimilar: boolean;
};

const SIMILAR_CHARS = /[O0Il1]/g;

const generatePassword = (options: Options) => {
  let pool = "";
  if (options.useLower) pool += CHAR_SETS.lower;
  if (options.useUpper) pool += CHAR_SETS.upper;
  if (options.useNumber) pool += CHAR_SETS.number;
  if (options.useSymbol) pool += CHAR_SETS.symbol;

  if (!pool) {
    throw new Error("至少选择一种字符类型。");
  }

  if (options.avoidSimilar) {
    pool = pool.replace(SIMILAR_CHARS, "");
  }

  const buffer = new Uint32Array(options.length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
  }

  let password = "";
  for (let index = 0; index < options.length; index += 1) {
    const randomIndex = buffer[index] % pool.length;
    password += pool[randomIndex] ?? "";
  }

  return password;
};

export default function PasswordGenerator() {
  const [options, setOptions] = useState<Options>({
    length: 16,
    useLower: true,
    useUpper: true,
    useNumber: true,
    useSymbol: false,
    avoidSimilar: false,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => {
    const types = [
      options.useLower,
      options.useUpper,
      options.useNumber,
      options.useSymbol,
    ].filter(Boolean).length;
    if (options.length >= 16 && types >= 3) return "强";
    if (options.length >= 12 && types >= 2) return "较强";
    if (options.length >= 10 && types >= 2) return "一般";
    return "偏弱";
  }, [options]);

  const handleGenerate = () => {
    try {
      const next = generatePassword(options);
      setPassword(next);
      setError(null);
    } catch (generateError) {
      setPassword("");
      setError(
        generateError instanceof Error
          ? generateError.message
          : "生成失败，请检查选项。",
      );
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      // ignore
    }
  };

  const updateOption = <Key extends keyof Options>(
    key: Key,
    value: Options[Key],
  ) => {
    setOptions((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-5 text-sm text-slate-200">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            密码长度：{options.length}
          </span>
          <input
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(event) =>
              updateOption("length", Number(event.target.value))
            }
            className="accent-sky-500"
          />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <OptionToggle
            label="小写字母 (a-z)"
            checked={options.useLower}
            onChange={(value) => updateOption("useLower", value)}
          />
          <OptionToggle
            label="大写字母 (A-Z)"
            checked={options.useUpper}
            onChange={(value) => updateOption("useUpper", value)}
          />
          <OptionToggle
            label="数字 (0-9)"
            checked={options.useNumber}
            onChange={(value) => updateOption("useNumber", value)}
          />
          <OptionToggle
            label="符号 (!@#...)"
            checked={options.useSymbol}
            onChange={(value) => updateOption("useSymbol", value)}
          />
          <OptionToggle
            label="避免相似字符 (O、0、I、1)"
            checked={options.avoidSimilar}
            onChange={(value) => updateOption("avoidSimilar", value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          生成密码
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
        >
          复制密码
        </button>
        <span className="text-xs text-slate-400">
          强度评估：{strength}
        </span>
        {error ? (
          <span className="text-xs text-rose-300">{error}</span>
        ) : null}
      </div>

      <textarea
        value={password}
        readOnly
        placeholder="点击“生成密码”获取结果…"
        className="h-28 rounded-2xl border border-white/5 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-indigo-500/40"
      />
    </div>
  );
}

function OptionToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 transition hover:border-sky-400/40 hover:bg-slate-900/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-sky-500"
      />
      <span className="text-xs text-slate-300">{label}</span>
    </label>
  );
}

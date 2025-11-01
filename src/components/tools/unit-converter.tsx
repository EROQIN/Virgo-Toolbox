"use client";

import { useMemo, useState } from "react";

type CategoryKey = "length" | "temperature" | "storage";

type CategoryConfig = {
  label: string;
  units: Array<{ label: string; value: string }>;
};

const categories: Record<CategoryKey, CategoryConfig> = {
  length: {
    label: "长度",
    units: [
      { label: "米 (m)", value: "meters" },
      { label: "千米 (km)", value: "kilometers" },
      { label: "厘米 (cm)", value: "centimeters" },
      { label: "毫米 (mm)", value: "millimeters" },
      { label: "英尺 (ft)", value: "feet" },
      { label: "英里 (mile)", value: "miles" },
    ],
  },
  temperature: {
    label: "温度",
    units: [
      { label: "摄氏度 (°C)", value: "celsius" },
      { label: "华氏度 (°F)", value: "fahrenheit" },
      { label: "开尔文 (K)", value: "kelvin" },
    ],
  },
  storage: {
    label: "存储容量",
    units: [
      { label: "字节 (B)", value: "bytes" },
      { label: "千字节 (KB)", value: "kilobytes" },
      { label: "兆字节 (MB)", value: "megabytes" },
      { label: "千兆字节 (GB)", value: "gigabytes" },
      { label: "太字节 (TB)", value: "terabytes" },
    ],
  },
};

const lengthFactors: Record<string, number> = {
  meters: 1,
  kilometers: 1000,
  centimeters: 0.01,
  millimeters: 0.001,
  feet: 0.3048,
  miles: 1609.344,
};

const storageFactors: Record<string, number> = {
  bytes: 1,
  kilobytes: 1024,
  megabytes: 1024 ** 2,
  gigabytes: 1024 ** 3,
  terabytes: 1024 ** 4,
};

const toFixed = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "";
  if (Math.abs(value) >= 1) {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
  }
  return value.toPrecision(4);
};

const convertLength = (value: number, from: string, to: string) => {
  const base = value * (lengthFactors[from] ?? 1);
  return base / (lengthFactors[to] ?? 1);
};

const convertStorage = (value: number, from: string, to: string) => {
  const base = value * (storageFactors[from] ?? 1);
  return base / (storageFactors[to] ?? 1);
};

const convertTemperature = (value: number, from: string, to: string) => {
  if (from === to) return value;
  let celsius = value;
  if (from === "fahrenheit") {
    celsius = (value - 32) * (5 / 9);
  } else if (from === "kelvin") {
    celsius = value - 273.15;
  }
  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  if (to === "kelvin") return celsius + 273.15;
  return value;
};

const getDefaultUnits = (key: CategoryKey) => {
  const units = categories[key].units;
  return {
    from: units[0]?.value ?? "",
    to: units[1]?.value ?? units[0]?.value ?? "",
  };
};

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [fromUnit, setFromUnit] = useState(getDefaultUnits("length").from);
  const [toUnit, setToUnit] = useState(getDefaultUnits("length").to);
  const [rawValue, setRawValue] = useState("1");

  const parsedValue = useMemo(() => parseFloat(rawValue), [rawValue]);

  const convertedValue = useMemo(() => {
    if (Number.isNaN(parsedValue)) return "";
    switch (category) {
      case "length":
        return toFixed(convertLength(parsedValue, fromUnit, toUnit));
      case "temperature":
        return toFixed(convertTemperature(parsedValue, fromUnit, toUnit));
      case "storage":
        return toFixed(convertStorage(parsedValue, fromUnit, toUnit));
      default:
        return "";
    }
  }, [category, fromUnit, toUnit, parsedValue]);

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-200">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            类别
          </span>
          <select
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value as CategoryKey;
              setCategory(nextCategory);
              const defaults = getDefaultUnits(nextCategory);
              setFromUnit(defaults.from);
              setToUnit(defaults.to);
            }}
            className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            {Object.entries(categories).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            来源单位
          </span>
          <select
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value)}
            className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            {categories[category].units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            目标单位
          </span>
          <select
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value)}
            className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            {categories[category].units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          数值
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={rawValue}
          onChange={(event) => setRawValue(event.target.value)}
          className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>
      <div className="rounded-2xl border border-sky-500/30 bg-slate-950/60 p-4 text-slate-100">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          换算结果
        </p>
        <p className="mt-1 text-xl font-semibold">
          {convertedValue !== "" ? convertedValue : "暂无结果"}
        </p>
      </div>
    </div>
  );
}

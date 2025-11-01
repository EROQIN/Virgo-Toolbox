"use client";

import { useState } from "react";

type RGB = { r: number; g: number; b: number };

const clamp255 = (value: number) => Math.min(255, Math.max(0, value));

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((value) => clamp255(Math.round(value)).toString(16).padStart(2, "0"))
    .join("")}`;

const hexToRgb = (hex: string): RGB | null => {
  const sanitized = hex.replace("#", "").trim();
  if (sanitized.length === 3) {
    const [r, g, b] = sanitized.split("");
    if (!r || !g || !b) return null;
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
    };
  }
  if (sanitized.length !== 6) return null;
  const value = parseInt(sanitized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToHsl = ({ r, g, b }: RGB) => {
  const rNorm = clamp255(r) / 255;
  const gNorm = clamp255(g) / 255;
  const bNorm = clamp255(b) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        break;
    }
  }

  h = Math.round((h * 60 + 360) % 360);
  s = Number.isNaN(s) ? 0 : Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return { h, s, l: lightness };
};

const hslToRgb = (h: number, s: number, l: number): RGB => {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const lightness = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

const parseRgbInput = (value: string): RGB | null => {
  const sanitized = value.replace(/rgb|\(|\)/gi, "").trim();
  const parts = sanitized.split(/[, ]+/).filter(Boolean);
  if (parts.length !== 3) return null;
  const [r, g, b] = parts.map((part) => Number(part));
  if (
    parts.some((part) => Number.isNaN(Number(part))) ||
    r === undefined ||
    g === undefined ||
    b === undefined
  ) {
    return null;
  }
  return {
    r: clamp255(r),
    g: clamp255(g),
    b: clamp255(b),
  };
};

const parseHslInput = (value: string): { h: number; s: number; l: number } | null => {
  const sanitized = value.replace(/hsl|\(|\)%/gi, "").trim();
  const parts = sanitized.split(/[, ]+/).filter(Boolean);
  if (parts.length !== 3) return null;
  const [h, s, l] = parts.map((part) => Number(part));
  if (
    parts.some((part) => Number.isNaN(Number(part))) ||
    h === undefined ||
    s === undefined ||
    l === undefined
  ) {
    return null;
  }
  return { h, s, l };
};

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState("#2dd4bf");
  const [rgbInput, setRgbInput] = useState("45, 212, 191");
  const [hslInput, setHslInput] = useState("168, 65, 50");
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState<RGB>({ r: 45, g: 212, b: 191 });

  const updateFromRgb = (rgb: RGB) => {
    setColor(rgb);
    setHexInput(rgbToHex(rgb));
    const rounded = `${clamp255(rgb.r)}, ${clamp255(rgb.g)}, ${clamp255(rgb.b)}`;
    setRgbInput(rounded);
    const hsl = rgbToHsl(rgb);
    setHslInput(`${hsl.h}, ${hsl.s}, ${hsl.l}`);
    setError(null);
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const rgb = hexToRgb(value);
    if (!rgb) {
      setError("请输入合法的 HEX 颜色，例如 #1d4ed8。");
      return;
    }
    updateFromRgb(rgb);
  };

  const handleRgbChange = (value: string) => {
    setRgbInput(value);
    const rgb = parseRgbInput(value);
    if (!rgb) {
      setError("请输入合法的 RGB 数值，例如 29, 78, 216。");
      return;
    }
    updateFromRgb(rgb);
  };

  const handleHslChange = (value: string) => {
    setHslInput(value);
    const hsl = parseHslInput(value);
    if (!hsl) {
      setError("请输入合法的 HSL 数值，例如 221, 79, 48。");
      return;
    }
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    updateFromRgb(rgb);
  };

  return (
    <div className="flex flex-col gap-5 text-sm text-slate-200">
      <div className="flex flex-wrap gap-6">
        <div
          className="h-24 w-24 rounded-2xl border border-white/10 shadow-[0_12px_50px_rgba(8,47,73,0.5)]"
          style={{ backgroundColor: rgbToHex(color) }}
        />
        <div className="flex flex-col justify-center gap-2 text-xs text-slate-400">
          <span>HEX: {hexInput}</span>
          <span>RGB: {rgbInput}</span>
          <span>HSL: {hslInput}</span>
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          HEX
        </span>
        <input
          type="text"
          value={hexInput}
          onChange={(event) => handleHexChange(event.target.value)}
          placeholder="#1d4ed8"
          className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          RGB
        </span>
        <input
          type="text"
          value={rgbInput}
          onChange={(event) => handleRgbChange(event.target.value)}
          placeholder="29, 78, 216"
          className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          HSL
        </span>
        <input
          type="text"
          value={hslInput}
          onChange={(event) => handleHslChange(event.target.value)}
          placeholder="221, 79, 48"
          className="h-11 rounded-2xl border border-white/5 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : (
        <p className="text-xs text-slate-400">
          支持 #RGB/#RRGGBB、RGB 数值与 HSL 数值输入，系统会自动同步其他格式。
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useIsDarkTheme } from "@/components/theme-provider";

const FORMATS = [
  { value: "CODE128", label: "Code 128（默认）" },
  { value: "EAN13", label: "EAN-13" },
  { value: "UPC", label: "UPC" },
  { value: "CODE39", label: "Code 39" },
];

export default function BarcodeGenerator() {
  const isDark = useIsDarkTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#0f172a");
  const [background, setBackground] = useState("transparent");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const schedule = (updater: () => void) => {
      void Promise.resolve().then(updater);
    };
    try {
      JsBarcode(svgRef.current, value || " ", {
        format,
        lineColor,
        background,
        width: 2,
        height: 120,
        displayValue: true,
        font: "monospace",
        fontSize: 16,
        margin: 10,
      });
      schedule(() => setError(null));
    } catch (barcodeError) {
      const message =
        barcodeError instanceof Error
          ? barcodeError.message
          : "生成失败，请检查输入内容。";
      schedule(() => setError(message));
    }
  }, [background, format, lineColor, value]);

  const downloadFileName = useMemo(() => {
    const safe = value.trim() ? value.trim().replace(/[^a-z0-9]+/gi, "_") : "barcode";
    return `${safe}_${format}.svg`;
  }, [format, value]);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-100"
    : "border-slate-200/60 bg-white text-slate-800";
  const panelClass = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/85";

  return (
    <div className={`flex flex-col gap-5 text-sm ${baseText}`}>
      <label className="flex flex-col gap-2">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          条形码内容
        </span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`h-11 rounded-2xl border px-4 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          placeholder="输入数字或字母"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            条形码格式
          </span>
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className={`h-11 rounded-xl border px-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          >
            {FORMATS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            线条颜色
          </span>
          <input
            type="color"
            value={lineColor}
            onChange={(event) => setLineColor(event.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-white/5 bg-transparent"
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            背景颜色
          </span>
          <input
            type="color"
            value={background === "transparent" ? "#ffffff" : background}
            onChange={(event) =>
              setBackground(
                event.target.value === "#ffffff" && !isDark
                  ? "#ffffff"
                  : event.target.value,
              )
            }
            className="h-11 w-full cursor-pointer rounded-xl border border-white/5 bg-transparent"
          />
          <label className="mt-2 inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={background === "transparent"}
              onChange={(event) =>
                setBackground(event.target.checked ? "transparent" : "#ffffff")
              }
              className="h-4 w-4 accent-sky-500"
            />
            <span className={labelText}>透明背景</span>
          </label>
        </label>
      </div>

      <div className={`rounded-2xl border p-6 ${panelClass}`}>
        <svg ref={svgRef} className="mx-auto h-auto max-w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          下载 SVG
        </button>
        <span className={`text-xs ${labelText}`}>文件名：{downloadFileName}</span>
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

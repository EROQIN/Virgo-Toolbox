"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useIsDarkTheme } from "@/components/theme-provider";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QrCodeGenerator() {
  const isDark = useIsDarkTheme();
  const [text, setText] = useState("https://virgo.dev/");
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#ffffff");
  const [level, setLevel] = useState<ErrorCorrectionLevel>("M");
  const [size, setSize] = useState(240);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      try {
        const url = await QRCode.toDataURL(text || " ", {
          width: size,
          color: {
            dark: foreground || "#0f172a",
            light: background || "#ffffff",
          },
          errorCorrectionLevel: level,
        });
        setDataUrl(url);
        setError(null);
      } catch (qrError) {
        setDataUrl("");
        setError(
          qrError instanceof Error ? qrError.message : "生成失败，请重试。",
        );
      }
    };
    void generate();
  }, [text, foreground, background, level, size]);

  const downloadFileName = useMemo(() => {
    const safeText = text.trim() ? text.trim().replace(/[^a-z0-9]+/gi, "_") : "qr";
    return `${safeText}_${level}_${size}.png`;
  }, [level, size, text]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = downloadFileName;
    link.click();
  };

  const baseText = isDark ? "text-slate-200" : "text-slate-700";
  const labelText = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-100"
    : "border-slate-200/60 bg-white/90 text-slate-800";
  const panelClass = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/85";

  return (
    <div className={`flex flex-col gap-5 text-sm ${baseText}`}>
      <label className="flex flex-col gap-2">
        <span className={`text-xs uppercase tracking-wide ${labelText}`}>
          二维码内容
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={`h-28 rounded-2xl border p-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          placeholder="输入文本、链接或其它内容"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            前景色
          </span>
          <input
            type="color"
            value={foreground}
            onChange={(event) => setForeground(event.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-white/5 bg-transparent"
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            背景色
          </span>
          <input
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-white/5 bg-transparent"
          />
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            纠错级别
          </span>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as ErrorCorrectionLevel)}
            className={`h-11 rounded-xl border px-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          >
            <option value="L">L（低）</option>
            <option value="M">M（中）</option>
            <option value="Q">Q（较高）</option>
            <option value="H">H（最高）</option>
          </select>
        </label>
        <label className={`flex flex-col gap-2 rounded-2xl border p-4 ${panelClass}`}>
          <span className={`text-xs uppercase tracking-wide ${labelText}`}>
            尺寸（像素）
          </span>
          <input
            type="number"
            min={120}
            max={512}
            value={size}
            onChange={(event) =>
              setSize(Math.min(512, Math.max(120, Number(event.target.value))))
            }
            className={`h-11 rounded-xl border px-3 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClass}`}
          />
        </label>
      </div>

      <div className={`rounded-2xl border p-6 text-center ${panelClass}`}>
        {dataUrl ? (
          <Image
            src={dataUrl}
            alt="二维码预览"
            width={size}
            height={size}
            className="mx-auto h-auto max-w-[280px]"
            unoptimized
          />
        ) : (
          <p className={`text-xs ${labelText}`}>请输入内容以生成二维码。</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!dataUrl}
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-500/40 disabled:text-slate-300"
        >
          下载 PNG
        </button>
        <span className={`text-xs ${labelText}`}>
          文件名：{downloadFileName}
        </span>
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

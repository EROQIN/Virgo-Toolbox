"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "idle" | "loading" | "error" | "success";

const IP_ENDPOINT = "https://api.ipify.org?format=json";

export default function IpLookup() {
  const [ip, setIp] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchIp = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch(IP_ENDPOINT);
      if (!response.ok) {
        throw new Error();
      }
      const payload: { ip?: string } = await response.json();
      if (!payload.ip) {
        throw new Error();
      }
      setIp(payload.ip);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("无法获取 IP 地址，请稍后再试。");
    }
  }, []);

  useEffect(() => {
    void fetchIp();
  }, [fetchIp]);

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-200">
      <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          当前公网 IP
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">
          {status === "loading" ? "…" : ip ?? "暂不可用"}
        </p>
        {status === "error" && error ? (
          <p className="mt-2 text-xs text-rose-300">{error}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void fetchIp()}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
        >
          {status === "loading" ? "获取中…" : "重新获取"}
        </button>
        <p className="text-xs text-slate-400">
          数据来源于{" "}
          <a
            href="https://www.ipify.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 underline-offset-4 transition hover:text-sky-300 hover:underline"
          >
            ipify
          </a>{" "}
          ，用于查询当前公网 IP。
        </p>
      </div>
    </div>
  );
}

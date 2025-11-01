"use client";

import { useEffect, useRef } from "react";

type Props = {
  theme: "light" | "dark";
};

const codeRows = [
  "const tools = ['Virgo', 'Next.js'];",
  "for (const idea of toolbox) build(idea);",
  "console.log('Hello, developer ✨');",
  "return deploy('Vercel');",
];

export default function CodeGlobe({ theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    let frameId = 0;
    let rotation = 0;

    const draw = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.35;

      const frontColor =
        theme === "dark" ? "rgba(59, 130, 246, 0.45)" : "rgba(29, 78, 216, 0.35)";
      const backColor =
        theme === "dark" ? "rgba(59, 130, 246, 0.22)" : "rgba(29, 78, 216, 0.18)";

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.72);

      const latitudes = [0.28, 0.5, 0.72, 0.92];

      latitudes.forEach((lat, latIndex) => {
        const radius = baseRadius * lat;
        const row = codeRows[latIndex % codeRows.length];
        const chars = row.split("");
        const fontSize = Math.max(10, radius * 0.11);
        ctx.font = `600 ${fontSize}px "Fira Code", "Courier New", monospace`;

        chars.forEach((char, charIndex) => {
          const angle =
            (charIndex / chars.length) * Math.PI * 2 +
            rotation +
            latIndex * 0.55;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const depth = Math.cos(angle);
          const alpha = 0.25 + Math.max(0, depth) * 0.75;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + Math.PI / 2);
          ctx.fillStyle = depth >= 0 ? frontColor : backColor;
          ctx.globalAlpha = alpha;
          ctx.fillText(char, 0, 0);
          ctx.restore();
        });
      });

      ctx.restore();
      rotation += 0.003;
      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55] mix-blend-screen"
      aria-hidden
    />
  );
}

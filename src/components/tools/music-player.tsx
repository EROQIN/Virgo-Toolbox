"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsDarkTheme } from "@/components/theme-provider";

type Track = {
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: string;
};

const TRACKS: Track[] = [
  {
    title: "Midnight Coding",
    artist: "Lo-Fi Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&q=80",
    duration: "6:13",
  },
  {
    title: "Morning Focus",
    artist: "Virgo Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&q=80",
    duration: "5:47",
  },
  {
    title: "Evening Relax",
    artist: "Night Shift",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=300&q=80",
    duration: "7:24",
  },
];

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function MusicPlayer() {
  const isDark = useIsDarkTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = useMemo(() => TRACKS[currentIndex], [currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? TRACKS.length - 1 : (prev - 1) % TRACKS.length));
    setProgress(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoaded = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, handleNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.url;
    if (isPlaying) {
      void audio.play();
    }
  }, [currentTrack, isPlaying]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(event.target.value);
    audio.currentTime = value;
    setProgress(value);
  };

  const textClass = isDark ? "text-slate-200" : "text-slate-700";
  const panelClass = isDark
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-200/60 bg-white/85";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const titleClass = isDark ? "text-white" : "text-slate-900";
  const secondaryButton = isDark
    ? "border-white/10 bg-slate-900/60 text-slate-200 hover:border-sky-400 hover:text-white"
    : "border-slate-200/60 bg-white/80 text-slate-600 hover:border-sky-400 hover:text-slate-900";
  const activeTrack = isDark
    ? "border-sky-400/60 bg-sky-500/10 text-sky-200"
    : "border-sky-400/60 bg-sky-100 text-sky-600";
  const inactiveTrack = isDark
    ? "border-transparent text-slate-300 hover:border-sky-400/40 hover:text-white"
    : "border-transparent text-slate-600 hover:border-sky-400/40 hover:text-slate-900";

  return (
    <div className={`flex flex-col gap-6 text-sm transition-colors duration-300 ${textClass}`}>
      <div className="grid gap-5 md:grid-cols-[220px,1fr]">
        <div className={`overflow-hidden rounded-2xl border shadow-lg transition-colors duration-300 ${panelClass}`}>
          <Image
            src={currentTrack.cover}
            alt={currentTrack.title}
            width={320}
            height={320}
            className="h-full w-full object-cover"
            unoptimized
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className={`text-2xl font-semibold transition-colors duration-300 ${titleClass}`}>
              {currentTrack.title}
            </h3>
            <p className={`text-sm transition-colors duration-300 ${mutedText}`}>
              {currentTrack.artist} · {currentTrack.duration}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${secondaryButton}`}
            >
              上一首
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              {isPlaying ? "暂停" : "播放"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${secondaryButton}`}
            >
              下一首
            </button>
          </div>

          <div>
            <input
              type="range"
              min={0}
              max={Number.isFinite(duration) ? duration : 0}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-sky-500"
            />
            <div className={`mt-2 flex items-center justify-between text-xs transition-colors duration-300 ${mutedText}`}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 transition-colors duration-300 ${panelClass}`}>
        <p className={`text-xs uppercase tracking-wide transition-colors duration-300 ${mutedText}`}>
          播放列表
        </p>
        <ul className="mt-3 space-y-2">
          {TRACKS.map((track, index) => {
            const active = index === currentIndex;
            return (
              <li key={track.title}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                    active ? activeTrack : inactiveTrack
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{track.title}</p>
                    <p className={`text-xs transition-colors duration-300 ${mutedText}`}>
                      {track.artist}
                    </p>
                  </div>
                  <span className={`text-xs transition-colors duration-300 ${mutedText}`}>
                    {track.duration}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}

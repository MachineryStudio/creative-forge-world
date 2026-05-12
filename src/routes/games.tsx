import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import miyuWave from "@/assets/miyu-wave.png";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "LIGHTHOUSE 橋 GAMES — Arcade Hub" },
      { name: "description", content: "Game development in production — MIYU greets you at the LIGHTHOUSE 橋 arcade." },
    ],
  }),
  component: GamesHub,
});

const ENGAGES = ["unreal-engine", "unity", "roblox", "phaser3"] as const;
const MIYU_VOICE_SRC = "/audio/miyu-game-under-development.mp3";

function GamesHub() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);

  const playVoice = () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
    } catch { /* ignore */ }
    // Defer to next tick so the seek settles before play (prevents AbortError / stutter)
    requestAnimationFrame(() => {
      a.play().catch(() => {/* autoplay may be blocked */});
    });
  };

  useEffect(() => {
    if (played) return;
    setPlayed(true);
    // Try autoplay; some browsers require interaction
    const t = setTimeout(playVoice, 400);
    return () => clearTimeout(t);
  }, [played]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <audio ref={audioRef} src={MIYU_VOICE_SRC} preload="auto" />
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <div className="font-display text-[10px] uppercase tracking-[0.4em] text-primary">ライトハウス · ARCADE</div>
        <h1 className="font-display text-4xl neon-text">LIGHTHOUSE 橋 GAMES</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose your game · ゲームを選んでください</p>

        {/* MIYU greeting */}
        <div className="relative mx-auto mt-10 flex max-w-3xl flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:text-left">
          <img
            src={miyuWave}
            alt="MIYU waving"
            className="h-56 w-auto shrink-0 animate-float object-contain"
            style={{ filter: "drop-shadow(0 0 24px var(--neon-pink))" }}
          />

          <div className="relative max-w-md">
            <div
              className="hidden md:block absolute -left-3 bottom-8 h-4 w-4 rotate-45 border-b border-l border-primary/40 bg-card"
              aria-hidden
            />
            <div className="rounded-2xl border border-primary/40 bg-card/80 p-5 shadow-[0_0_24px_var(--color-neon)] backdrop-blur-sm">
              <div className="font-display text-xs uppercase tracking-widest text-primary">MIYU 🐾 says</div>
              <p className="mt-2 text-base text-foreground">
                Our games are in development.
              </p>
              <p className="mt-1 text-base text-foreground" lang="ja">
                現在、ゲームは開発中です。
              </p>
              <button
                onClick={playVoice}
                className="mt-3 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-display uppercase tracking-widest text-primary transition hover:bg-primary/20"
              >
                ▶ Play MIYU voice · もう一度
              </button>
            </div>
          </div>
        </div>

        {/* Production banner */}
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-accent/40 bg-gradient-to-br from-primary/5 to-accent/10 p-6">
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-accent">In Production · 開発中</div>
          <h2 className="mt-1 font-display text-2xl neon-text">GAME DEVELOPMENT IN PRODUCTION</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {ENGAGES.map((e) => (
              <span
                key={e}
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-display uppercase tracking-widest text-primary"
              >
                {e}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            See demos or videos soon · デモまたは動画は近日公開
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-widest text-accent">
            Thank you for your patience · ご辛抱ありがとうございます
          </p>
        </div>
      </div>
    </div>
  );
}

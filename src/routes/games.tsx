import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "LIGHTHOUSE 橋 GAMES — Arcade Hub" },
      { name: "description", content: "Play rhythm and arcade mini-games inside the LIGHTHOUSE 橋 universe." },
    ],
  }),
  component: GamesHub,
});

const GAMES = [
  { key: "beatsync", title: "BeatSync Studio", jp: "拍同期スタジオ", desc: "Visual-kei rhythm game. Tap on beat with bass or drums.", emoji: "🎸" },
  { key: "invaders", title: "Space Invaders", jp: "スペースインベーダー", desc: "Classic shooter. Defend the neon skyline.", emoji: "👾" },
  { key: "tetris", title: "Tetris", jp: "テトリス", desc: "Stack falling blocks, clear lines, chase combos.", emoji: "🟦" },
  { key: "tabbird", title: "Tab Bird", jp: "タブバード", desc: "Flap through pipes — one tap to fly.", emoji: "🐤" },
  { key: "matching", title: "Input Matching", jp: "入力一致", desc: "Simon-style memory with kanji keys 桜 水 金 森.", emoji: "🀄" },
];

function GamesHub() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-primary">ライトハウス · ARCADE</div>
          <h1 className="font-display text-4xl neon-text">LIGHTHOUSE 橋 GAMES</h1>
          <p className="text-sm text-muted-foreground">Choose your game · ゲームを選んでください</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {GAMES.map((g) => (
            <Link
              key={g.key}
              to="/radioneto"
              className="group relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10 p-6 transition hover:scale-[1.02] hover:border-primary hover:shadow-[0_0_24px_var(--color-neon)]"
            >
              <div className="mb-3 text-5xl">{g.emoji}</div>
              <h2 className="font-display text-xl neon-text">{g.title}</h2>
              <div className="text-xs text-accent">{g.jp}</div>
              <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary opacity-0 transition group-hover:opacity-100">
                Play › プレイ
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

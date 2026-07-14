import { useState } from "react";
import kumoruMix from "@/assets/KUMORU.mp3.asset.json";

type Lang = "EN" | "JP";

const members = [
  { name: "ANDREE", jp: "アンドレ", role: "Vocal / Guitar", roleJp: "ボーカル / ギター", color: "from-red-600 to-black" },
  { name: "MARO", jp: "真人", role: "Bass Guitar", roleJp: "ベースギター", color: "from-blue-600 to-black" },
  { name: "REN", jp: "蓮", role: "Lead Guitar", roleJp: "リードギター", color: "from-yellow-500 to-black" },
  { name: "YASU", jp: "安須", role: "Drums / Vocals", roleJp: "ドラム / ボーカル", color: "from-purple-600 to-black" },
];

const news = [
  {
    tag: "NEW MIX", tagJp: "新ミックス",
    text: "「クモル」FAULT LINE CLOUD megamix — 6 tracks, 5:58 preview drop.",
    textJp: "「クモル」フォルトラインクラウド メガミックス — 6曲、5:58プレビュー公開。",
  },
  {
    tag: "STUDIO", tagJp: "スタジオ",
    text: "Tracking 「曇りの断層」EP — REN laying down lead guitar this week.",
    textJp: "「曇りの断層」EPレコーディング中 — 今週は蓮がリードギターを録音。",
  },
];

const t = {
  EN: {
    featured: "Featured Band · 注目バンド",
    subtitle: "— FAULT LINE CLOUD ·「曇りの断層」",
    mixBadge: "5:58 Megamix · ミックス",
    intro: (
      <>
        A short preview blending six KUMORU tracks — <em>Descending Love 「落下する恋」</em>, <em>2 Seconds Away 「2秒先」</em>,{" "}
        <em>JUSTICE DAY 「ジャスティス・デイ」</em>, <em>Monster Loop 「モンスター・ループ」</em>, <em>Twilight gloom 「夕闇」</em> and{" "}
        <em>Last Train Wolf 「終電ウルフ」</em> — into a single fault-line cloudburst.
      </>
    ),
    lighthouse: (
      <>
        <strong>LIGHTHOUSE 橋 —</strong>
        <br />
        a bridge of light, built from games, animation, and the pulse of technology.
        <br />
        This is only a demo. A beginning. Not the arrival.
        <br />
        Many paths lead forward, and we are walking each one.
        <br />
        With patience and persistence,
        <br />
        we hope to guide this project from the edge of shadow
        <br />
        into the full embrace of light.
      </>
    ),
    disclaimer: "Songs are in production — final tracks may vary.",
    notes: "Band Notes · ニュース",
    switchLabel: "JP",
  },
  JP: {
    featured: "注目バンド · Featured Band",
    subtitle: "—「曇りの断層」FAULT LINE CLOUD",
    mixBadge: "5:58 メガミックス · Megamix",
    intro: (
      <>
        クモルの6曲 —<em>「落下する恋」Descending Love</em>、<em>「2秒先」2 Seconds Away</em>、<em>「ジャスティス・デイ」JUSTICE DAY</em>、<em>「モンスター・ループ」Monster Loop</em>、<em>「夕闇」Twilight gloom</em>、<em>「終電ウルフ」Last Train Wolf</em>{" "}
        — をひとつの断層雷雨にまとめた短いプレビュー。
      </>
    ),
    lighthouse: (
      <>
        <strong>LIGHTHOUSE 橋 —</strong>
        <br />
        光の橋。ゲーム、アニメ、そしてテクノロジーの鼓動から生まれる。
        <br />
        これはデモにすぎない。始まり。到達ではない。
        <br />
        前に進む道は数多くあり、私たちは一つ一つを歩んでいる。
        <br />
        忍耐と粘り強さをもって、
        <br />
        このプロジェクトを影の端から
        <br />
        光の満ちる抱擁へと導きたいと願っている。
      </>
    ),
    disclaimer: "楽曲は制作中です。最終版は変更となる場合があります。",
    notes: "ニュース · Band Notes",
    switchLabel: "EN",
  },
} as const;

export function KumoruFeature() {
  const [lang, setLang] = useState<Lang>("EN");
  const L = t[lang];
  const toggle = () => setLang((l) => (l === "EN" ? "JP" : "EN"));

  return (
    <section className="mb-8">
      <div className="panel scanlines rounded-2xl border-2 border-primary/40 p-5 md:p-7"
           style={{ boxShadow: "0 0 40px var(--shadow-neon, rgba(244,114,182,0.35)), inset 0 0 40px rgba(56,189,248,0.08)" }}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-sky-400">
              {L.featured}
            </div>
            <h2 className="font-display text-3xl md:text-4xl neon-text">
              「クモル」KUMORU
            </h2>
            <p className="mt-1 font-display text-sm text-primary">
              {L.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle language"
              className="group relative inline-flex items-center gap-2 rounded-md border border-sky-400/50 bg-sky-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-sky-200 transition hover:bg-sky-400/20"
            >
              <span className={lang === "EN" ? "text-sky-100" : "text-sky-200/40"}>EN</span>
              <span className="text-sky-400">/</span>
              <span className={lang === "JP" ? "text-sky-100" : "text-sky-200/40"}>日本語</span>
            </button>
            <div className="rounded-md border border-sky-400/40 bg-sky-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-sky-200">
              {L.mixBadge}
            </div>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {L.intro}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-200/80">
          {L.lighthouse}
        </p>

        <div className="mt-4 rounded-xl border border-border bg-background/60 p-3">
          <audio
            controls
            preload="metadata"
            src={kumoruMix.url}
            className="w-full"
            style={{ colorScheme: "dark" }}
          />
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-300">1 · Descending Love 「落下する恋」</span>
            <span className="rounded bg-pink-500/15 px-2 py-0.5 text-pink-300">2 · 2 Seconds Away 「2秒先」</span>
            <span className="rounded bg-amber-500/15 px-2 py-0.5 text-amber-300">3 · JUSTICE DAY 「ジャスティス・デイ」</span>
            <span className="rounded bg-violet-500/15 px-2 py-0.5 text-violet-300">4 · Monster Loop 「モンスター・ループ」</span>
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">5 · Twilight gloom 「夕闇」</span>
            <span className="rounded bg-rose-500/15 px-2 py-0.5 text-rose-300">6 · Last Train Wolf 「終電ウルフ」</span>
          </div>
          <p className="mt-2 font-display text-[10px] uppercase tracking-widest text-amber-300/80">
            ⚠ {L.disclaimer}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card/40 p-3">
              <div className={`mb-2 inline-block rounded bg-gradient-to-r ${m.color} px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-white`}>
                {lang === "EN" ? m.role : m.roleJp}
              </div>
              <div className="font-display text-lg text-foreground">{lang === "EN" ? m.name : m.jp}</div>
              <div className="font-display text-sm text-sky-300">{lang === "EN" ? m.jp : m.name}</div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-sky-400">
            {L.notes}
          </div>
          <ul className="space-y-2">
            {news.map((n) => (
              <li key={n.tag} className="flex gap-3 rounded-md border border-border/60 bg-background/40 p-2 text-xs">
                <span className="shrink-0 rounded bg-primary/20 px-2 py-0.5 font-display uppercase tracking-widest text-primary">
                  {lang === "EN" ? n.tag : n.tagJp}
                </span>
                <span className="text-muted-foreground">{lang === "EN" ? n.text : n.textJp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

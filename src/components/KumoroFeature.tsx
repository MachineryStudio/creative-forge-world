import kumoroMix from "@/assets/KUMORO.mp3.asset.json";

const members = [
  { name: "ANDREE", jp: "アンドレ", role: "Vocal / Guitar", color: "from-pink-500 to-fuchsia-500" },
  { name: "MARO", jp: "真人", role: "Bass Guitar", color: "from-sky-400 to-blue-600" },
  { name: "REN", jp: "蓮", role: "Lead Guitar", color: "from-amber-400 to-orange-500" },
  { name: "YASU", jp: "安須", role: "Drums", color: "from-violet-500 to-indigo-600" },
];

const news = [
  { tag: "NEW MIX", text: "「クモル」FAULT LINE CLOUD megamix — 4 tracks, 60 sec preview drop." },
  { tag: "LIVE", text: "Underground show at Shinjuku basement — date TBA 近日発表." },
  { tag: "STUDIO", text: "Tracking 「曇りの断層」EP — REN laying down lead guitar this week." },
];

export function KumoroFeature() {
  return (
    <section className="mb-8">
      <div className="panel scanlines rounded-2xl border-2 border-primary/40 p-5 md:p-7"
           style={{ boxShadow: "0 0 40px var(--shadow-neon, rgba(244,114,182,0.35)), inset 0 0 40px rgba(56,189,248,0.08)" }}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-sky-400">
              Featured Band · 注目バンド
            </div>
            <h2 className="font-display text-3xl md:text-4xl neon-text">
              「クモル」KUMORO
            </h2>
            <p className="mt-1 font-display text-sm text-primary">
              — FAULT LINE CLOUD ·「曇りの断層」
            </p>
          </div>
          <div className="rounded-md border border-sky-400/40 bg-sky-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-sky-200">
            1:50 Megamix · ミックス
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          A short preview blending four KUMORO tracks — <em>Falling Love</em>, <em>2 Second Away</em>,{" "}
          <em>Justice</em>, and <em>Monster Loop</em> — into a single fault-line cloudburst.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-background/60 p-3">
          <audio
            controls
            preload="metadata"
            src={kumoroMix.url}
            className="w-full"
            style={{ colorScheme: "dark" }}
          />
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-300">1 · Falling Love</span>
            <span className="rounded bg-pink-500/15 px-2 py-0.5 text-pink-300">2 · 2 Second Away</span>
            <span className="rounded bg-amber-500/15 px-2 py-0.5 text-amber-300">3 · Justice</span>
            <span className="rounded bg-violet-500/15 px-2 py-0.5 text-violet-300">4 · Monster Loop</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card/40 p-3">
              <div className={`mb-2 inline-block rounded bg-gradient-to-r ${m.color} px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-white`}>
                {m.role}
              </div>
              <div className="font-display text-lg text-foreground">{m.name}</div>
              <div className="font-display text-sm text-sky-300">{m.jp}</div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-sky-400">
            Band Notes · ニュース
          </div>
          <ul className="space-y-2">
            {news.map((n) => (
              <li key={n.tag} className="flex gap-3 rounded-md border border-border/60 bg-background/40 p-2 text-xs">
                <span className="shrink-0 rounded bg-primary/20 px-2 py-0.5 font-display uppercase tracking-widest text-primary">
                  {n.tag}
                </span>
                <span className="text-muted-foreground">{n.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

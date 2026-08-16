import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BubbleRouter } from "@/components/BubbleRouter";

import { AnnouncementsPanel } from "@/components/AnnouncementsPanel";

import { VisitorMap } from "@/components/VisitorMap";
import { CubeCarousel } from "@/components/CubeCarousel";
import { AngelsFateGame } from "@/components/AngelsFateGame";
import { CreatureAttack } from "@/components/CreatureAttack";
import { MiyuChat } from "@/components/MiyuChat";
import { ContactForm } from "@/components/ContactForm";

import { useT, useI18n, STRINGS } from "@/lib/i18n";
import { Twitter, Github, Globe, Gamepad2, Box, Boxes, Joystick, Terminal, BrainCircuit, Briefcase, Mail } from "lucide-react";
import { useState } from "react";
import andreePortrait from "@/assets/andree-portrait.webp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const t = useT();
  const { bilingual, jpOnly, lang } = useI18n();
  const [attackTrigger, setAttackTrigger] = useState(0);

  const introEn = STRINGS.intro.en;
  const introJp = STRINGS.intro.jp;
  const introCurrent = jpOnly ? introJp : STRINGS.intro[lang];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CreatureAttack trigger={attackTrigger} />

      {/* HERO — centered like a lighthouse beam */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-10 text-center">
        <button
          type="button"
          onClick={() => setAttackTrigger((n) => n + 1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.3em] text-primary transition hover:scale-105 hover:bg-primary/20 hover:shadow-[0_0_20px_var(--color-neon)]"
          aria-label="Summon a creature"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Andree Online
        </button>
        <h1 className="font-display text-5xl leading-tight md:text-7xl">
          <span className="neon-text">LIGHTHOUSE 橋</span>
        </h1>
        <p className="mt-2 font-display text-xs uppercase tracking-[0.4em] text-primary">Prototype Software Pipeline</p>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          Interactive tools for prototyping and production.
        </p>

        <div className="mt-10 grid gap-6 text-left lg:grid-cols-[2fr_1fr]">
          <BubbleRouter />

          <div className="space-y-6">
            <AnnouncementsPanel />
            <VisitorMap />
            <div className="panel scanlines relative p-5">
              <div className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-primary">Intro</div>
              {bilingual ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-foreground" lang="ja">{introJp}</p>
                  <hr className="border-border" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{introEn}</p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground" lang={jpOnly ? "ja" : lang}>
                  {introCurrent}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HIRED PROJECTS — open roles for collaborators */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="panel scanlines relative p-6">
          <div className="mb-4 flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <div>
              <div className="font-display text-[10px] uppercase tracking-[0.4em] text-primary">{t("hiredProjects")}</div>
              <h2 className="font-display text-2xl neon-text">{t("openRoles")}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Role 1 */}
            <div className="rounded-lg border border-border bg-card/60 p-4 transition hover:border-primary/50 hover:bg-card/80">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-primary">#1</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Remote</span>
              </div>
              <h3 className="font-display text-lg text-foreground">3D ANIME ARTIST</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li><span className="text-primary">Language:</span> Any</li>
                <li><span className="text-primary">Location:</span> Everywhere · Remote</li>
                <li><span className="text-primary">Reason:</span> Indie Animation and Game</li>
              </ul>
            </div>

            {/* Role 2 */}
            <div className="rounded-lg border border-border bg-card/60 p-4 transition hover:border-primary/50 hover:bg-card/80">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-accent/10 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-accent-foreground">#2</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Remote</span>
              </div>
              <h3 className="font-display text-lg text-foreground">Lead Guitarist</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li><span className="text-primary">Language:</span> English, Japanese, French, Spanish, Korean</li>
                <li><span className="text-primary">Location:</span> Everywhere</li>
                <li><span className="text-primary">Reason:</span> Animation · Video Game · J-Rock Music</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span className="font-display uppercase tracking-widest">{t("contact")}:</span>
              <a href="mailto:andre@lighthashi.dev" className="text-primary hover:text-neon-pink hover:underline">andre@lighthashi.dev</a>
            </div>
            <a href="mailto:andre@lighthashi.dev" className="rounded-md border border-primary bg-primary/10 px-4 py-2 font-display text-xs uppercase tracking-widest text-primary transition hover:bg-primary/20 hover:shadow-[0_0_20px_var(--color-neon)]">{t("apply")}</a>
          </div>

          <div className="mt-4">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* RAION 雷音 moved to /community. RAION game lives at /radioneto */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="panel scanlines flex flex-col items-start gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-primary">雷音</div>
            <h2 className="font-display text-2xl neon-text">RAION 雷音 — Rhythm Game</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick Drums or Bass. Tap the kick. Trace the melody. Survive the visual-kei concert.</p>
          </div>
          <a href="/radioneto" className="rounded-md border border-primary bg-primary/10 px-4 py-2 font-display text-xs uppercase tracking-widest text-primary neon-glow hover:bg-primary/20">▶ Play</a>
        </div>
      </section>


      {/* CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <CubeCarousel />
      </section>

      {/* MINI GAME */}
      <AngelsFateGame />

      {/* ABOUT ANDREE / FOOTER */}
      <footer className="border-t border-border bg-background/40">
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-6">
            <h2 className="font-display text-3xl neon-text">About Andree</h2>
            <p className="text-sm text-muted-foreground">Engineer · Artist · Musician</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
            {/* Portrait */}
            <div
              className="panel relative overflow-hidden rounded-2xl border border-primary/30"
              style={{ boxShadow: "0 20px 60px oklch(0.1 0.05 220 / 0.6)" }}
            >
              <img
                src={andreePortrait}
                alt="Andree — portrait in the rain, with guitar vibes"
                className="block h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-display text-lg uppercase tracking-widest neon-text">Andree</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">LIGHTHOUSE 橋</div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-foreground">
                Major in Civil Engineer focused on 3D visualization and Structural Design.
                Minor in Computer Science focused on Video Game Development. Polylingual.
                Engineer-Artist-Musician.
              </p>

              <p className="font-mono text-xs leading-relaxed text-primary">
                KeepOnLearning++ &nbsp; NeverGiveUP &nbsp; CloseYourEyesThinkOfMeFeelMyWarmRemotely &nbsp; LoveThePlanetProtectThePeopleAttackTheTitans
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground" lang="ja">
                土木工学を専攻し、3Dビジュアライゼーションと構造設計に特化しています。
                コンピュータサイエンスを副専攻し、ビデオゲーム開発に特化しています。
                多言語対応。 エンジニア、アーティスト、ミュージシャン。KeepOnLearning++
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://twitter.com/9THE_BRIDGE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-display uppercase tracking-widest text-primary transition hover:bg-primary/20"
                >
                  <Twitter className="h-4 w-4" />
                  @9THE_BRIDGE
                </a>
                <a
                  href="https://andreremi.artstation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-display uppercase tracking-widest text-accent-foreground transition hover:bg-accent/20"
                >
                  <Globe className="h-4 w-4" />
                  ArtStation
                </a>
                <a
                  href="https://github.com/MachineryStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2 text-xs font-display uppercase tracking-widest text-foreground transition hover:bg-secondary"
                >
                  <Github className="h-4 w-4" />
                  GitHub · MachineryStudio
                </a>
                <a
                  href="https://www.roblox.com/users/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-display uppercase tracking-widest text-primary transition hover:bg-primary/15"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Roblox
                </a>
                <a
                  href="https://assetstore.unity.com/publishers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-xs font-display uppercase tracking-widest text-accent-foreground transition hover:bg-accent/15"
                >
                  <Box className="h-4 w-4" />
                  Unity Asset Store
                </a>
                <a
                  href="https://www.unrealengine.com/marketplace/en-US/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2 text-xs font-display uppercase tracking-widest text-foreground transition hover:bg-secondary"
                >
                  <Boxes className="h-4 w-4" />
                  Unreal Marketplace
                </a>
                <a
                  href="https://bridge2play.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-display uppercase tracking-widest text-primary transition hover:bg-primary/20"
                >
                  <Joystick className="h-4 w-4" />
                  bridge2play.com
                </a>
                <a
                  href="https://decodedshell.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-display uppercase tracking-widest text-accent-foreground transition hover:bg-accent/20"
                >
                  <Terminal className="h-4 w-4" />
                  decodedshell.com
                </a>
                <a
                  href="https://bridge3ai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2 text-xs font-display uppercase tracking-widest text-foreground transition hover:bg-secondary"
                >
                  <BrainCircuit className="h-4 w-4" />
                  bridge3ai.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} LIGHTHOUSE 橋 · Prototype Software Pipeline · 2D · 3D Art · Pipeline · Code</p>
          </div>
        </section>
      </footer>
      <MiyuChat />
    </div>
  );
}


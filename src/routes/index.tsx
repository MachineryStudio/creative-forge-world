import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BubbleRouter } from "@/components/BubbleRouter";
import { RadioNerd } from "@/components/RadioNerd";
import { VisitorMap } from "@/components/VisitorMap";
import { CubeCarousel } from "@/components/CubeCarousel";
import { AngelsFateGame } from "@/components/AngelsFateGame";
import { CreatureAttack } from "@/components/CreatureAttack";
import { useT, useI18n, STRINGS } from "@/lib/i18n";
import { Twitter, Github, Globe, Gamepad2, Box, Boxes } from "lucide-react";
import { useState } from "react";
import andreePortrait from "@/assets/andree-portrait.png";

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

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-10">
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
          <span className="neon-text">{t("brand")}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t("tagline")}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <BubbleRouter />

          <div className="space-y-6">
            <RadioNerd />
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
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">BRIDGE2 · CreatureToolBox</div>
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
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} CreatureToolBox · BRIDGE2 · 2D · 3D Art · Pipeline · Code</p>
          </div>
        </section>
      </footer>
    </div>
  );
}


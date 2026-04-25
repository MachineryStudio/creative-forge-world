import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BubbleRouter } from "@/components/BubbleRouter";
import { CubeCarousel } from "@/components/CubeCarousel";
import { RadioNerd } from "@/components/RadioNerd";
import { useT, useI18n, STRINGS } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const t = useT();
  const { bilingual, jpOnly, lang } = useI18n();

  // Intro: render JP + EN side by side when bilingual; otherwise current lang
  const introEn = STRINGS.intro.en;
  const introJp = STRINGS.intro.jp;
  const introCurrent = jpOnly ? introJp : STRINGS.intro[lang];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.3em] text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          ONLINE · v1.0
        </div>
        <h1 className="font-display text-5xl leading-tight md:text-7xl">
          <span className="neon-text">{t("brand")}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t("tagline")}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Bubble router */}
          <BubbleRouter />

          {/* Side: Radio + Intro */}
          <div className="space-y-6">
            <RadioNerd />
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
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl neon-text">Project Cubes</h2>
            <p className="text-sm text-muted-foreground">Slow auto-scroll · click to flip · hover to pause.</p>
          </div>
        </div>
        <CubeCarousel />
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} CreatureToolBox · Creature & Pipeline Lab</p>
        <p className="mt-1">CreatureToolBox · BRIDGE2 · 3D Meshes · Pipeline · Code</p>
      </footer>
    </div>
  );
}

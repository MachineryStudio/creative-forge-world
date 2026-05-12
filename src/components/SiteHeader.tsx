import { Link } from "@tanstack/react-router";
import { LampPanel } from "./LampPanel";
import { HamburgerMenu } from "./HamburgerMenu";
import { useT, useI18n } from "@/lib/i18n";
import { useEffect } from "react";
import lighthouseLogo from "@/assets/lighthouse-logo.png";

export function SiteHeader() {
  const t = useT();
  const { jpOnly } = useI18n();

  useEffect(() => {
    document.body.classList.toggle("lang-jp", jpOnly);
  }, [jpOnly]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3" aria-label="LIGHTHOUSE 橋 — Home">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-2xl p-2 ring-2 ring-primary/50"
            style={{ background: "var(--sakura-white)", boxShadow: "0 0 32px var(--sakura-white), 0 0 12px var(--color-neon)" }}
          >
            <img
              src={lighthouseLogo}
              alt="LIGHTHOUSE 橋"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden font-display text-sm uppercase tracking-[0.3em] text-primary md:inline">
            LIGHTHOUSE <span className="text-accent">橋</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary">{t("marketplace")}</Link>
          <Link to="/community" className="text-sm text-muted-foreground hover:text-primary">{t("community")}</Link>
          <Link to="/radioneto" className="text-sm text-muted-foreground hover:text-primary">RADIONETO</Link>
          <Link
            to="/games"
            className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-display uppercase tracking-widest text-primary transition hover:bg-primary/20 hover:shadow-[0_0_16px_var(--color-neon)]"
          >
            LIGHTHOUSE 橋 GAMES
          </Link>
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary">{t("signIn")}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <LampPanel />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}

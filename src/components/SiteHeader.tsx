import { Link } from "@tanstack/react-router";
import { LampPanel } from "./LampPanel";
import { HamburgerMenu } from "./HamburgerMenu";
import { useT, useI18n } from "@/lib/i18n";
import { useEffect } from "react";

export function SiteHeader() {
  const t = useT();
  const { jpOnly } = useI18n();

  useEffect(() => {
    document.body.classList.toggle("lang-jp", jpOnly);
  }, [jpOnly]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent neon-glow">
            <span className="font-display text-sm font-bold text-primary-foreground">WS</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-base leading-none neon-text">{t("brand")}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">CREATURE · PIPELINE · CODE</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary">{t("marketplace")}</Link>
          <Link to="/community" className="text-sm text-muted-foreground hover:text-primary">{t("community")}</Link>
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

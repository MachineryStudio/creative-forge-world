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
            className="flex h-14 w-14 items-center justify-center rounded-full p-1 ring-2 ring-primary/40"
            style={{ background: "var(--sakura-white)", boxShadow: "0 0 24px var(--sakura-white)" }}
          >
            <img
              src={lighthouseLogo}
              alt="LIGHTHOUSE 橋"
              className="h-12 w-auto object-contain"
            />
          </span>
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

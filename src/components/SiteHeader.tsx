import { Link } from "@tanstack/react-router";
import { LampPanel } from "./LampPanel";
import { HamburgerMenu } from "./HamburgerMenu";
import { useT, useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import lighthouseLogo from "@/assets/lighthouse-logo.png";

import {
  TECH_ITEMS,
  GAMES_ITEMS,
  ANIMATION_ITEMS,
  TECH_ART_ITEMS,
  MUSIC_ITEMS,
  WORKSHOP_ITEMS,
  CONSTRUCTION_ITEMS,
  ITEM_LINKS,
} from "@/lib/nav";


const navBtn =
  "rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-display uppercase tracking-widest text-primary transition hover:bg-sky/20 hover:border-sky hover:text-sky hover:shadow-[0_0_18px_var(--sky-blue)] active:scale-95 active:bg-sky active:text-background active:border-sky active:shadow-[0_0_28px_var(--sky-blue-deep)]";

function NavDropdown({ label, items, to }: { label: string; items: string[]; to?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {to ? (
        <Link to={to} className={`${navBtn} inline-flex items-center gap-1`} onClick={() => setOpen(false)}>
          {label.toUpperCase()}
          <ChevronDown className="h-3 w-3" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`${navBtn} inline-flex items-center gap-1`}
        >
          {label.toUpperCase()}
          <ChevronDown className="h-3 w-3" />
        </button>
      )}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-sky/50 bg-background/95 p-2 shadow-[0_0_24px_var(--sky-blue)] backdrop-blur-md">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it}>
                <button
                  type="button"
                  className="block w-full rounded px-3 py-1.5 text-left text-xs font-display uppercase tracking-wider text-foreground transition hover:bg-sky/20 hover:text-sky active:bg-sky active:text-background"
                >
                  {it}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const t = useT();
  const { jpOnly } = useI18n();

  useEffect(() => {
    document.body.classList.toggle("lang-jp", jpOnly);
  }, [jpOnly]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3" aria-label="LIGHTHOUSE 橋 — Home">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-2xl p-2 ring-2 ring-primary/50"
            style={{ background: "var(--sakura-white)", boxShadow: "0 0 24px var(--sakura-white), 0 0 8px var(--sky-blue)" }}
          >
            <img src={lighthouseLogo} alt="LIGHTHOUSE 橋" className="h-full w-full object-contain" />
          </span>
          <span className="hidden font-display text-sm uppercase tracking-[0.3em] text-primary md:inline">
            LIGHTHOUSE <span className="text-accent">橋</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavDropdown label="Tech" items={TECH_ITEMS} to="/marketplace" />
          <NavDropdown label="Games" items={GAMES_ITEMS} to="/games" />
          <NavDropdown label="Animation" items={ANIMATION_ITEMS} to="/hub/2d-conceptual" />
          <NavDropdown label="Tech Art" items={TECH_ART_ITEMS} to="/hub/3d-mesh" />
          <NavDropdown label="Music" items={MUSIC_ITEMS} to="/radioneto" />
          <NavDropdown label="Workshop" items={WORKSHOP_ITEMS} to="/community" />
          <NavDropdown label="Construction" items={CONSTRUCTION_ITEMS} to="/marketplace" />
          <Link to="/contact" className={navBtn}>{t("contact").toUpperCase()}</Link>
          <Link to="/auth" className={navBtn}>{t("signIn").toUpperCase()}</Link>
        </nav>

        <span className="sr-only">{t("community")}</span>

        <div className="flex items-center gap-4">
          <LampPanel />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}

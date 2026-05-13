import { Link } from "@tanstack/react-router";
import { LampPanel } from "./LampPanel";
import { HamburgerMenu } from "./HamburgerMenu";
import { useT, useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import lighthouseLogo from "@/assets/lighthouse-logo.png";

const MOBILE_WEB_APPS = [
  "kumaGO 橋 (Japanese-English Interactive Tutor)",
  "engiGO 橋 (Engineering Learning)",
  "radio raiON 雷音 (Interactive Game Radio Station)",
  "brushLabo 橋 Technical Arts",
  "cloudHunters (Animation)",
  "soraGomi (空ゴミ) Band JP-CAN",
  "construcTA 橋 (Civil Engineer Management)",
  "adminTA (Cost-Budget Management)",
];

const LIGHTHOUSE_GAMES = [
  "pacifiCA",
  "unidentiFIED",
  "planetUteUS",
  "fistchapterZ",
  "cloudHunters",
  "bananaRain",
  "banditStudios",
];

const navBtn =
  "rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-display uppercase tracking-widest text-primary transition hover:bg-primary/20 hover:shadow-[0_0_16px_var(--color-neon)] active:scale-95 active:bg-accent active:text-accent-foreground active:border-accent active:shadow-[0_0_24px_var(--neon-pink)]";

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
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-primary/40 bg-background/95 p-2 shadow-[0_0_24px_var(--color-neon)] backdrop-blur-md">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it}>
                <button
                  type="button"
                  className="block w-full rounded px-3 py-1.5 text-left text-xs font-display uppercase tracking-wider text-foreground transition hover:bg-primary/20 hover:text-primary active:bg-accent active:text-accent-foreground"
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
            style={{ background: "var(--sakura-white)", boxShadow: "0 0 32px var(--sakura-white), 0 0 12px var(--color-neon)" }}
          >
            <img src={lighthouseLogo} alt="LIGHTHOUSE 橋" className="h-full w-full object-contain" />
          </span>
          <span className="hidden font-display text-sm uppercase tracking-[0.3em] text-primary md:inline">
            LIGHTHOUSE <span className="text-accent">橋</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <NavDropdown label="Mobile-Web Apps" items={MOBILE_WEB_APPS} to="/marketplace" />
          <Link to="/community" className={navBtn}>{t("community").toUpperCase()}</Link>
          <Link to="/radioneto" className={navBtn}>RAION 雷音</Link>
          <NavDropdown label="LIGHTHOUSE 橋 GAMES" items={LIGHTHOUSE_GAMES} to="/games" />
          <Link to="/auth" className={navBtn}>{t("signIn").toUpperCase()}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <LampPanel />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}

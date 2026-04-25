import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { useEffect, useState, useRef } from "react";

/** Two ornate "lamps" in the header.
 *  - Japanese paper lamp (red): toggles JP-only (ON white) vs EN (OFF black)
 *  - French street lamp (gold): opens a 7-language switcher
 */
export function LampPanel() {
  const { jpOnly, toggleJpOnly, bilingual, toggleBilingual, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="flex items-center gap-3" ref={ref}>
      {/* Japanese lamp - JP/EN toggle */}
      <button
        onClick={() => { sfx.power(); toggleJpOnly(); }}
        title={jpOnly ? "JP" : "EN"}
        className="group relative flex flex-col items-center"
      >
        <div className="h-1 w-6 rounded-sm bg-foreground/40" />
        <div
          className={`mt-0.5 h-9 w-7 rounded-[40%] border border-destructive/60 transition-all ${
            jpOnly
              ? "bg-[oklch(0.97_0.02_80)] shadow-[0_0_18px_oklch(0.97_0.02_80/0.7)]"
              : "bg-[oklch(0.18_0.05_30)]"
          }`}
          style={{ boxShadow: jpOnly ? "inset 0 -8px 14px oklch(0.95 0.05 60 / .6)" : "inset 0 -8px 14px oklch(0 0 0 / .6)" }}
        >
          <div className="grid h-full w-full grid-rows-3 opacity-50">
            <div className="border-b border-foreground/30" />
            <div className="border-b border-foreground/30" />
            <div />
          </div>
        </div>
        <span className="mt-1 font-display text-[10px] tracking-wider text-muted-foreground group-hover:text-primary">
          {jpOnly ? "日本語" : "EN"}
        </span>
      </button>

      {/* Bilingual JP+EN dual */}
      <button
        onClick={() => { sfx.blip(); toggleBilingual(); }}
        className={`rounded-md border border-border px-2 py-1 font-display text-[10px] tracking-wider transition ${
          bilingual ? "bg-primary text-primary-foreground neon-glow" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Bilingual JP + EN"
      >
        JP/EN
      </button>

      {/* French lamp - language menu */}
      <div className="relative">
        <button
          onClick={() => { sfx.click(); setOpen((o) => !o); }}
          className="group relative flex flex-col items-center"
          title="Language"
        >
          <div className="h-3 w-1 bg-[oklch(0.6_0.05_80)]" />
          <div className="h-1 w-8 rounded-sm bg-[oklch(0.55_0.06_80)]" />
          <div
            className="relative mt-0.5 h-7 w-9 rounded-md border border-[oklch(0.55_0.06_80)] bg-gradient-to-b from-[oklch(0.85_0.18_80)] to-[oklch(0.55_0.15_60)] animate-pulse-glow"
            style={{ boxShadow: "0 0 18px oklch(0.85 0.18 80 / .6)" }}
          >
            <div className="absolute inset-1 rounded-sm bg-[oklch(0.96_0.1_85)] opacity-80" />
            <span className="absolute inset-0 grid place-items-center font-display text-[10px] text-[oklch(0.2_0.04_60)]">
              {LANGS.find((l) => l.code === lang)?.native ?? "EN"}
            </span>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-44 panel scanlines relative p-2">
            <div className="mb-1 px-2 font-display text-[10px] uppercase tracking-widest text-muted-foreground">Language</div>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { sfx.blip(); setLang(l.code as Lang); setOpen(false); }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-secondary ${
                  lang === l.code ? "text-primary" : "text-foreground"
                }`}
              >
                <span>{l.label}</span>
                <span className="font-display text-[11px] text-muted-foreground">{l.native}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

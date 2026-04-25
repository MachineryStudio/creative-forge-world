import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { useEffect, useRef, useState } from "react";

/** Color per language for the robot headlights */
const LANG_COLOR: Record<Lang, string> = {
  en: "oklch(0.65 0.25 25)",   // RED
  jp: "oklch(0.62 0.25 305)",  // PURPLE
  fr: "oklch(0.85 0.18 90)",   // YELLOW
  zh: "oklch(0.85 0.18 90)",
  es: "oklch(0.85 0.18 90)",
  it: "oklch(0.85 0.18 90)",
  ru: "oklch(0.85 0.18 90)",
};

function Robot({
  color,
  active,
  label,
  wiggle,
}: {
  color: string;
  active: boolean;
  label: string;
  wiggle?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center transition-transform ${
        wiggle ? "animate-[robot-wiggle_0.6s_ease-in-out]" : ""
      } group-hover:-translate-y-0.5`}
    >
      {/* Antenna */}
      <div className="relative h-2 w-px bg-foreground/50">
        <div
          className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      {/* Head with two headlights */}
      <div className="relative flex h-6 w-12 items-center justify-around rounded-md border border-foreground/40 bg-gradient-to-b from-[oklch(0.78_0.02_240)] to-[oklch(0.55_0.02_240)] px-1 shadow-inner">
        {/* speaker grills */}
        <div className="absolute left-0.5 top-1 h-4 w-1 rounded-sm bg-foreground/20" />
        <div className="absolute right-0.5 top-1 h-4 w-1 rounded-sm bg-foreground/20" />
        {/* headlights */}
        <div
          className="h-3.5 w-3.5 rounded-full border border-foreground/40 transition-all"
          style={{
            background: active ? color : "oklch(0.25 0 0)",
            boxShadow: active ? `0 0 10px ${color}, inset 0 0 4px oklch(1 0 0 / .5)` : "inset 0 0 3px oklch(0 0 0 / .8)",
          }}
        />
        <div
          className="h-3.5 w-3.5 rounded-full border border-foreground/40 transition-all"
          style={{
            background: active ? color : "oklch(0.25 0 0)",
            boxShadow: active ? `0 0 10px ${color}, inset 0 0 4px oklch(1 0 0 / .5)` : "inset 0 0 3px oklch(0 0 0 / .8)",
          }}
        />
      </div>
      {/* Neck */}
      <div className="h-1 w-3 bg-foreground/40" />
      {/* Body */}
      <div className="relative h-5 w-10 rounded-sm border border-foreground/40 bg-gradient-to-b from-[oklch(0.7_0.02_240)] to-[oklch(0.4_0.02_240)]">
        <div className="absolute left-1/2 top-0.5 h-2 w-4 -translate-x-1/2 rounded-sm bg-[oklch(0.2_0.05_240)]" />
        <div
          className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ background: active ? color : "oklch(0.3 0 0)" }}
        />
      </div>
      <span className="mt-0.5 font-display text-[9px] tracking-wider text-muted-foreground group-hover:text-primary">
        {label}
      </span>
    </div>
  );
}

/** Three robots in the header.
 *  - Robot 1 (RED lights when active): JP-only OFF → English mode
 *  - Robot 2 (cyan glyph): bilingual JP+EN
 *  - Robot 3 (color shifts): opens a 7-language switcher; lights take selected lang color
 */
export function LampPanel() {
  const { jpOnly, toggleJpOnly, bilingual, toggleBilingual, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [wiggleKey, setWiggleKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // wiggle trigger when language changes
  useEffect(() => {
    setWiggleKey((k) => k + 1);
  }, [lang, jpOnly, bilingual]);

  const englishActive = !jpOnly && !bilingual && lang === "en";
  const japaneseActive = jpOnly && !bilingual;
  const otherLangActive = !jpOnly && !bilingual && lang !== "en";
  const currentLangColor = LANG_COLOR[lang];

  return (
    <>
      <style>{`
        @keyframes robot-wiggle {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-2px) rotate(-4deg); }
          50% { transform: translateY(0) rotate(0); }
          75% { transform: translateY(-2px) rotate(4deg); }
        }
      `}</style>
      <div className="flex items-end gap-3" ref={ref}>
        {/* Robot 1 — English (RED) / JP toggle */}
        <button
          onClick={() => { sfx.power(); toggleJpOnly(); }}
          title={jpOnly ? "Japanese only" : "English"}
          className="group"
          key={`r1-${wiggleKey}`}
        >
          <Robot
            color={japaneseActive ? LANG_COLOR.jp : LANG_COLOR.en}
            active={englishActive || japaneseActive}
            label={japaneseActive ? "日本語" : "EN"}
            wiggle
          />
        </button>

        {/* Robot 2 — Bilingual JP+EN */}
        <button
          onClick={() => { sfx.blip(); toggleBilingual(); }}
          title="Bilingual JP + EN"
          className="group"
          key={`r2-${wiggleKey}`}
        >
          <Robot
            color="oklch(0.75 0.18 200)"
            active={bilingual}
            label="JP/EN"
            wiggle
          />
        </button>

        {/* Robot 3 — language menu (color = current lang) */}
        <div className="relative">
          <button
            onClick={() => { sfx.click(); setOpen((o) => !o); }}
            className="group"
            title="Language"
            key={`r3-${wiggleKey}`}
          >
            <Robot
              color={currentLangColor}
              active={otherLangActive || open}
              label={LANGS.find((l) => l.code === lang)?.native ?? "EN"}
              wiggle
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 panel scanlines relative p-2">
              <div className="mb-1 px-2 font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Language
              </div>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { sfx.blip(); setLang(l.code as Lang); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-secondary ${
                    lang === l.code ? "text-primary" : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        background: LANG_COLOR[l.code],
                        boxShadow: `0 0 6px ${LANG_COLOR[l.code]}`,
                      }}
                    />
                    {l.label}
                  </span>
                  <span className="font-display text-[11px] text-muted-foreground">{l.native}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

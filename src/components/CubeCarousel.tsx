import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

interface Slide {
  title: string;
  subtitle: string;
  hue: number; // 0-360
  emoji: string;
}

const SLIDES: Slide[] = [
  { title: "Creature Toolbox", subtitle: "ZBrush · Maya · Substance", hue: 195, emoji: "🦎" },
  { title: "Romaji Escaping", subtitle: "2D Conceptual · Manga", hue: 320, emoji: "🤖" },
  { title: "Kanji Dungeon", subtitle: "Scene Composition", hue: 25, emoji: "🕷️" },
  { title: "Bridge Wasteland", subtitle: "Character Design", hue: 280, emoji: "🚗" },
  { title: "Cloud Hunter", subtitle: "Environment & Mood", hue: 200, emoji: "☁️" },
  { title: "Tower Skyline", subtitle: "Worldbuilding", hue: 165, emoji: "🌊" },
  { title: "Anthro Roster", subtitle: "Character Sheets", hue: 350, emoji: "🦊" },
];

/** Slow right-to-left marquee of pseudo-3D cubes. Click a cube to "lock" it. */
export function CubeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let raf = 0;
    let x = 0;
    const step = () => {
      if (!paused) {
        x -= 0.4;
        if (Math.abs(x) > t.scrollWidth / 2) x = 0;
        t.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const items = [...SLIDES, ...SLIDES];

  return (
    <div
      className="relative overflow-hidden rounded-2xl panel scanlines py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ perspective: "1200px" }}
    >
      <div className="mb-4 flex items-center justify-between px-6">
        <h3 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">Carousel · 3D Cubes</h3>
        <span className="text-xs text-muted-foreground">{paused ? "paused" : "auto-scroll →"}</span>
      </div>
      <div ref={trackRef} className="flex gap-8 px-6 will-change-transform">
        {items.map((s, i) => {
          const isSel = selected === i;
          return (
            <button
              key={i}
              onClick={() => { sfx.coin(); setSelected(isSel ? null : i); }}
              className="group relative h-44 w-44 shrink-0 transition-transform"
              style={{ transformStyle: "preserve-3d", transform: isSel ? "rotateY(180deg)" : "rotateY(-18deg) rotateX(8deg)" }}
            >
              {/* front */}
              <div
                className="absolute inset-0 grid place-items-center rounded-md border text-center"
                style={{
                  borderColor: `oklch(0.7 0.2 ${s.hue})`,
                  background: `linear-gradient(135deg, oklch(0.3 0.12 ${s.hue} / 0.6), oklch(0.2 0.05 ${s.hue} / 0.8))`,
                  boxShadow: `0 14px 30px oklch(0.1 0.05 ${s.hue} / 0.6), inset 0 0 30px oklch(0.7 0.2 ${s.hue} / 0.15)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="space-y-2 p-3">
                  <div className="text-4xl">{s.emoji}</div>
                  <div className="font-display text-xs uppercase tracking-widest text-foreground">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground">{s.subtitle}</div>
                </div>
              </div>
              {/* back */}
              <div
                className="absolute inset-0 grid place-items-center rounded-md border p-3 text-center text-xs text-foreground"
                style={{
                  borderColor: `oklch(0.7 0.2 ${s.hue})`,
                  background: `oklch(0.18 0.06 ${s.hue})`,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div>
                  <div className="font-display text-sm neon-text">{s.title}</div>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{s.subtitle} · click to flip back.</p>
                </div>
              </div>
              {/* shadow plate */}
              <div
                className="absolute -bottom-3 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full blur-md"
                style={{ background: `oklch(0.7 0.2 ${s.hue} / 0.25)` }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

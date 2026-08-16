import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import { X } from "lucide-react";
import imgCreatureToolbox from "@/assets/carousel-creature-toolbox.webp";
import imgFutureland from "@/assets/carousel-futureland.webp";
import imgKanji from "@/assets/carousel-kanji-dungeon.webp";
import imgMinis from "@/assets/carousel-3d-minis.webp";
import imgPipeline from "@/assets/carousel-3d-pipeline.webp";

interface Slide {
  title: string;
  subtitle: string;
  hue: number;
  image: string;
}

const SLIDES: Slide[] = [
  { title: "Creature Toolbox", subtitle: "ZBrush · Maya · Substance", hue: 195, image: imgCreatureToolbox },
  { title: "Futureland", subtitle: "2D Conceptual · Sci-Fi", hue: 320, image: imgFutureland },
  { title: "Kanji Dungeon", subtitle: "Scene Composition", hue: 25, image: imgKanji },
  { title: "3D Minis for Games", subtitle: "Miniatures & Props", hue: 280, image: imgMinis },
  { title: "3D Pipeline Design", subtitle: "Sculpt · Retopo · Bake", hue: 200, image: imgPipeline },
];

/** Slow right-to-left marquee of pseudo-3D cubes. Click a cube to expand it. */
export function CubeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState<Slide | null>(null);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let raf = 0;
    let x = 0;
    const step = () => {
      if (!paused && !expanded) {
        x -= 0.4;
        if (Math.abs(x) > t.scrollWidth / 2) x = 0;
        t.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, expanded]);

  // pause while modal open
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const items = [...SLIDES, ...SLIDES];

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl panel scanlines py-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ perspective: "1600px" }}
      >
        <div className="mb-6 flex items-center justify-between px-8">
          <h3 className="font-display text-base uppercase tracking-[0.3em] text-muted-foreground">Carousel · 3D Cubes</h3>
          <span className="text-xs text-muted-foreground">{paused ? "paused" : "auto-scroll →"} · click to expand</span>
        </div>
        <div ref={trackRef} className="flex gap-12 px-8 will-change-transform">
          {items.map((s, i) => (
            <button
              key={i}
              onClick={() => { sfx.coin(); setExpanded(s); }}
              className="group relative h-72 w-72 shrink-0 transition-transform hover:scale-105"
              style={{ transformStyle: "preserve-3d", transform: "rotateY(-18deg) rotateX(8deg)" }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-md border"
                style={{
                  borderColor: `oklch(0.7 0.2 ${s.hue})`,
                  boxShadow: `0 14px 30px oklch(0.1 0.05 ${s.hue} / 0.6), inset 0 0 30px oklch(0.7 0.2 ${s.hue} / 0.15)`,
                }}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, oklch(0.15 0.08 ${s.hue} / 0.85) 100%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                  <div className="font-display text-xs uppercase tracking-widest text-foreground">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground">{s.subtitle}</div>
                </div>
              </div>
              <div
                className="absolute -bottom-3 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full blur-md"
                style={{ background: `oklch(0.7 0.2 ${s.hue} / 0.25)` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Expanded image modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-6 backdrop-blur-md animate-in fade-in"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border-2 panel"
            style={{ borderColor: `oklch(0.7 0.2 ${expanded.hue})`, boxShadow: `0 30px 80px oklch(0.1 0.05 ${expanded.hue} / 0.8)` }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={expanded.image} alt={expanded.title} className="block max-h-[80vh] w-auto object-contain" />
            <div
              className="absolute inset-x-0 bottom-0 p-4"
              style={{ background: `linear-gradient(0deg, oklch(0.1 0.05 ${expanded.hue} / 0.95), transparent)` }}
            >
              <div className="font-display text-lg uppercase tracking-widest neon-text">{expanded.title}</div>
              <div className="text-xs text-muted-foreground">{expanded.subtitle}</div>
            </div>
            <button
              onClick={() => setExpanded(null)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-primary/60 bg-background/70 text-primary backdrop-blur transition hover:bg-primary/20"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import seraph from "@/assets/attack-seraph-eye.webp";
import corvid from "@/assets/attack-bone-corvid.webp";
import tako from "@/assets/attack-tako-crawler.webp";
import kirin from "@/assets/attack-kirin-glyph.webp";
import { sfx } from "@/lib/sfx";

type Side = "right" | "left" | "top";

type Creature = {
  id: string;
  img: string;
  name: string;
  jp: string;
  cry: string;
  tint: string;
  damage: [number, number];
  sound: () => void;
  scale: number;
};

const CREATURES: Creature[] = [
  {
    id: "seraph",
    img: seraph,
    name: "SERAPH EYE",
    jp: "熾天眼",
    cry: "ミルナ！",
    tint: "oklch(0.85 0.16 85)",
    damage: [28, 46],
    sound: () => sfx.alienDrone(1.6),
    scale: 1,
  },
  {
    id: "corvid",
    img: corvid,
    name: "BONE CORVID",
    jp: "骨鴉侍",
    cry: "斬ッ！",
    tint: "oklch(0.72 0.24 25)",
    damage: [34, 58],
    sound: () => sfx.death(),
    scale: 1.05,
  },
  {
    id: "tako",
    img: tako,
    name: "TAKO CRAWLER",
    jp: "蛸蟲",
    cry: "グチュッ！",
    tint: "oklch(0.75 0.2 45)",
    damage: [18, 33],
    sound: () => sfx.scaryRoar(1.4),
    scale: 0.95,
  },
  {
    id: "kirin",
    img: kirin,
    name: "GLYPH KIRIN",
    jp: "紋麒麟",
    cry: "雷ィッ！",
    tint: "oklch(0.75 0.18 230)",
    damage: [40, 66],
    sound: () => sfx.power(),
    scale: 1,
  },
];

const SIDES: Side[] = ["right", "left", "top"];

type Strike = {
  key: number;
  creature: Creature;
  side: Side;
  damage: number;
  crit: boolean;
};

const DURATION = 2200;

export function CreatureAttack({ trigger }: { trigger: number }) {
  const [strike, setStrike] = useState<Strike | null>(null);
  const [hp, setHp] = useState(100);
  const [hitFrame, setHitFrame] = useState(false);
  const lastRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const keyRef = useRef(0);

  const launch = useCallback(() => {
    if (busyRef.current || typeof document === "undefined" || document.hidden) return;
    busyRef.current = true;

    const pool = CREATURES.filter((c) => c.id !== lastRef.current);
    const creature = pool[Math.floor(Math.random() * pool.length)] ?? CREATURES[0];
    lastRef.current = creature.id;
    const side = SIDES[Math.floor(Math.random() * SIDES.length)];
    const crit = Math.random() < 0.22;
    const [lo, hi] = creature.damage;
    const damage = Math.round((lo + Math.random() * (hi - lo)) * (crit ? 1.8 : 1));

    keyRef.current += 1;
    setStrike({ key: keyRef.current, creature, side, damage, crit });

    // impact lands ~420ms into the lunge
    const impact = window.setTimeout(() => {
      creature.sound();
      sfx.blip();
      setHitFrame(true);
      setHp((v) => Math.max(4, v - Math.round(damage / 6)));
      document.body.style.animation = "creature-shake 420ms ease-in-out";
      window.setTimeout(() => {
        document.body.style.animation = "";
        setHitFrame(false);
      }, 430);
    }, 420);

    const end = window.setTimeout(() => {
      setStrike(null);
      busyRef.current = false;
    }, DURATION);

    return () => {
      window.clearTimeout(impact);
      window.clearTimeout(end);
    };
  }, []);

  // manual summon
  useEffect(() => {
    if (trigger === 0) return;
    launch();
  }, [trigger, launch]);

  // random ambush loop
  useEffect(() => {
    let timer = window.setTimeout(function tick() {
      launch();
      timer = window.setTimeout(tick, 25000 + Math.random() * 35000);
    }, 12000 + Math.random() * 15000);
    return () => window.clearTimeout(timer);
  }, [launch]);

  // slow HP regen so the bar keeps meaning something
  useEffect(() => {
    const i = window.setInterval(() => setHp((v) => Math.min(100, v + 2)), 4000);
    return () => window.clearInterval(i);
  }, []);

  if (!strike) return null;
  const { creature, side, damage, crit } = strike;

  const anim =
    side === "right"
      ? "creature-attack-right"
      : side === "left"
        ? "creature-attack-left"
        : "creature-attack-top";

  const posStyle: React.CSSProperties =
    side === "top"
      ? { top: 0, left: "50%", height: "min(70vh, 620px)" }
      : side === "right"
        ? { right: 0, bottom: "4vh", height: "min(72vh, 660px)" }
        : { left: 0, bottom: "4vh", height: "min(72vh, 660px)" };

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      {/* impact flash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${creature.tint}, transparent 65%)`,
          animation: "creature-flash 700ms ease-out 380ms both",
        }}
      />

      {/* slash streaks */}
      {hitFrame &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[3px] w-[140vw]"
            style={{
              background: `linear-gradient(90deg, transparent, ${creature.tint}, transparent)`,
              transform: `translate(-50%, -50%) rotate(${-28 + i * 22}deg)`,
              filter: `drop-shadow(0 0 12px ${creature.tint})`,
              animation: `creature-slash 380ms ease-out ${i * 60}ms both`,
            }}
          />
        ))}

      {/* creature sprite */}
      <img
        src={creature.img}
        alt=""
        className="absolute w-auto select-none"
        style={{
          ...posStyle,
          transformOrigin: "center",
          filter: `drop-shadow(0 0 40px ${creature.tint}) drop-shadow(0 24px 40px rgba(0,0,0,0.6)) saturate(1.1)`,
          animation: `${anim} ${DURATION}ms cubic-bezier(.18,.9,.25,1) both`,
          scale: String(creature.scale),
        }}
      />

      {/* battle cry plate */}
      <div
        className="absolute left-1/2 top-[18%] -translate-x-1/2 text-center"
        style={{ animation: "creature-speech 1.6s ease-out 380ms both" }}
      >
        <div
          className="font-display text-4xl md:text-6xl"
          lang="ja"
          style={{ color: creature.tint, textShadow: `0 0 24px ${creature.tint}, 0 4px 0 rgba(0,0,0,0.6)` }}
        >
          {creature.cry}
        </div>
        <div className="mt-2 font-display text-xs uppercase tracking-[0.5em] text-foreground/85">
          {creature.name} · <span lang="ja">{creature.jp}</span>
        </div>
      </div>

      {/* damage number */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 font-display"
        style={{ animation: "creature-damage 1.2s ease-out 400ms both" }}
      >
        <span
          className={crit ? "text-6xl md:text-7xl" : "text-4xl md:text-5xl"}
          style={{
            color: crit ? "oklch(0.85 0.2 85)" : "oklch(0.95 0.02 60)",
            textShadow: `0 0 20px ${creature.tint}, 0 4px 0 rgba(0,0,0,0.7)`,
          }}
        >
          -{damage}
        </span>
        {crit && (
          <div className="mt-1 text-center font-display text-xs uppercase tracking-[0.4em] text-[oklch(0.85_0.2_85)]">
            会心の一撃 · CRITICAL
          </div>
        )}
      </div>

      {/* viewer HP bar */}
      <div className="absolute bottom-4 left-1/2 w-[min(420px,80vw)] -translate-x-1/2">
        <div className="mb-1 flex items-center justify-between font-display text-[10px] uppercase tracking-[0.3em] text-foreground/70">
          <span>VIEWER · 観客</span>
          <span>{hp}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-background/70">
          <div
            className="h-full transition-[width] duration-500 ease-out"
            style={{
              width: `${hp}%`,
              background: "linear-gradient(90deg, oklch(0.72 0.24 350), oklch(0.6 0.22 30))",
              boxShadow: "0 0 14px oklch(0.72 0.24 350)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes creature-slash {
          0% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--r,0)) scaleX(0.2); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--r,0)) scaleX(1); }
        }
        @keyframes creature-damage {
          0% { opacity: 0; transform: translate(-50%, 20px) scale(0.6); }
          25% { opacity: 1; transform: translate(-50%, -30px) scale(1.25); }
          55% { transform: translate(-50%, -50px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -110px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

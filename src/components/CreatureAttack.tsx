import { useEffect, useRef, useState } from "react";
import knight from "@/assets/creature-dark-knight.png";
import gunner from "@/assets/creature-gunner.png";
import alien from "@/assets/creature-alien.png";

type AttackId = "knight" | "gunner" | "alien";

type Attack = {
  id: AttackId;
  img: string;
  from: "right" | "left" | "top";
  speech: string;
  lang: string;
  voiceLang: string; // BCP-47 used to bias accent
  rate: number;
  pitch: number;
  label: string;
  tint: string; // glow color
};

const ATTACKS: Attack[] = [
  {
    id: "knight",
    img: knight,
    from: "right",
    speech: "CreatureToolbox",
    lang: "en",
    voiceLang: "ja-JP", // forces Japanese-accented English
    rate: 0.95,
    pitch: 1.1,
    label: "CreatureToolbox",
    tint: "oklch(0.72 0.24 340)",
  },
  {
    id: "gunner",
    img: gunner,
    from: "left",
    speech: "Bridge Two!",
    lang: "en",
    voiceLang: "en-US",
    rate: 1,
    pitch: 1,
    label: "BRIDGE2",
    tint: "oklch(0.82 0.18 75)",
  },
  {
    id: "alien",
    img: alien,
    from: "top",
    speech: "クリーチャーツールボックス",
    lang: "ja",
    voiceLang: "ja-JP",
    rate: 0.85,
    pitch: 0.6,
    label: "クリーチャーツールボックス",
    tint: "oklch(0.78 0.18 195)",
  },
];

function speak(attack: Attack) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(attack.speech);
    u.lang = attack.voiceLang;
    u.rate = attack.rate;
    u.pitch = attack.pitch;
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => v.lang?.toLowerCase().startsWith(attack.voiceLang.toLowerCase())) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith(attack.voiceLang.split("-")[0]));
    if (match) u.voice = match;
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
  }
}

export function CreatureAttack({ trigger }: { trigger: number }) {
  const [attack, setAttack] = useState<Attack | null>(null);
  const lastIdRef = useRef<AttackId | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    // Pick a random attack different from the last one
    const pool = ATTACKS.filter((a) => a.id !== lastIdRef.current);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? ATTACKS[0];
    lastIdRef.current = next.id;
    setAttack(next);

    // Warm up voices then speak slightly after enter starts
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
    const speakT = window.setTimeout(() => speak(next), 600);
    const clearT = window.setTimeout(() => setAttack(null), 5000);
    return () => {
      window.clearTimeout(speakT);
      window.clearTimeout(clearT);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [trigger]);

  if (!attack) return null;

  const animationName =
    attack.from === "right"
      ? "creature-attack-right"
      : attack.from === "left"
      ? "creature-attack-left"
      : "creature-attack-top";

  const speechSide =
    attack.from === "right"
      ? { right: "10%", top: "20%" }
      : attack.from === "left"
      ? { left: "10%", top: "20%" }
      : { left: "50%", top: "12%", transform: "translateX(-50%)" };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      aria-hidden="true"
    >
      {/* vignette flash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 40%, ${attack.tint} 180%)`,
          mixBlendMode: "screen",
          opacity: 0.35,
          animation: "creature-flash 5s ease-out forwards",
        }}
      />
      {/* shake wrapper */}
      <div
        className="absolute inset-0"
        style={{ animation: "creature-shake 0.5s ease-in-out 0.6s 6" }}
      >
        <img
          src={attack.img}
          alt=""
          className="absolute select-none"
          style={{
            height: attack.from === "top" ? "70vh" : "85vh",
            maxWidth: "none",
            filter: `drop-shadow(0 0 28px ${attack.tint}) drop-shadow(0 12px 40px rgba(0,0,0,0.7))`,
            animation: `${animationName} 5s cubic-bezier(.2,.8,.2,1) forwards`,
            ...(attack.from === "top"
              ? { left: "50%", top: 0 }
              : attack.from === "right"
              ? { right: 0, bottom: 0 }
              : { left: 0, bottom: 0 }),
          }}
        />
      </div>
      {/* speech bubble */}
      <div
        className="absolute"
        style={{
          ...speechSide,
          animation: "creature-speech 5s ease-out forwards",
        }}
      >
        <div
          className="panel scanlines relative px-5 py-3 font-display text-2xl md:text-4xl"
          style={{
            color: attack.tint,
            textShadow: `0 0 18px ${attack.tint}`,
            border: `1px solid ${attack.tint}`,
            boxShadow: `0 0 30px ${attack.tint}`,
            letterSpacing: "0.08em",
          }}
          lang={attack.lang}
        >
          {attack.label}
        </div>
      </div>
    </div>
  );
}

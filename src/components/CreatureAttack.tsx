import { useEffect, useRef, useState } from "react";
import video1 from "@/assets/creature-video-1.mp4";
import video2 from "@/assets/creature-video-2.mp4";
import video3 from "@/assets/creature-video-3.mp4";
import audio1 from "@/assets/creature-audio-1.mp3";
import audio2 from "@/assets/creature-audio-2.mp3";
import audio3 from "@/assets/creature-audio-3.mp3";

type ClipId = "scared" | "hunter" | "heroine";

type Clip = {
  id: ClipId;
  video: string;
  audio: string;
  label: string;
  tint: string;
};

const CLIPS: Clip[] = [
  { id: "scared", video: video1, audio: audio1, label: "SCARED", tint: "oklch(0.72 0.24 340)" },
  { id: "hunter", video: video2, audio: audio2, label: "CLOUD HUNTER", tint: "oklch(0.82 0.18 75)" },
  { id: "heroine", video: video3, audio: audio3, label: "HEROINE", tint: "oklch(0.78 0.18 195)" },
];

export function CreatureAttack({ trigger }: { trigger: number }) {
  const [clip, setClip] = useState<Clip | null>(null);
  const lastIdRef = useRef<ClipId | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const pool = CLIPS.filter((c) => c.id !== lastIdRef.current);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? CLIPS[0];
    lastIdRef.current = next.id;
    setClip(next);
  }, [trigger]);

  useEffect(() => {
    if (!clip) return;
    const a = new Audio(clip.audio);
    a.volume = 1;
    audioRef.current = a;
    a.play().catch(() => {});

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }

    const handleEnded = () => setClip(null);
    a.addEventListener("ended", handleEnded);

    // Safety stop after 20s in case audio metadata is missing
    const safety = window.setTimeout(() => setClip(null), 20000);

    return () => {
      a.removeEventListener("ended", handleEnded);
      a.pause();
      a.currentTime = 0;
      audioRef.current = null;
      window.clearTimeout(safety);
    };
  }, [clip]);

  if (!clip) return null;

  const close = () => setClip(null);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-label="Creature feature"
    >
      {/* Theater frame */}
      <div
        className="relative animate-[creature-theater-in_500ms_cubic-bezier(.2,.8,.2,1)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 86vw)",
          padding: "18px",
          borderRadius: "14px",
          background: "linear-gradient(180deg, oklch(0.18 0.04 280) 0%, oklch(0.08 0.03 260) 100%)",
          border: `2px solid ${clip.tint}`,
          boxShadow: `0 0 60px ${clip.tint}, 0 30px 80px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Marquee bulbs */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="block h-2 w-2 rounded-full"
                style={{
                  background: clip.tint,
                  boxShadow: `0 0 8px ${clip.tint}`,
                  animation: `creature-bulb 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <div
            className="font-display text-xs uppercase tracking-[0.3em]"
            style={{ color: clip.tint, textShadow: `0 0 12px ${clip.tint}` }}
          >
            ◆ NOW SHOWING ◆
          </div>
          <button
            type="button"
            onClick={close}
            className="font-display text-xs uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Screen */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-md bg-black"
          style={{
            border: `1px solid ${clip.tint}`,
            boxShadow: `inset 0 0 40px rgba(0,0,0,0.9), 0 0 30px ${clip.tint}`,
          }}
        >
          <video
            ref={videoRef}
            src={clip.video}
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            muted={false}
            controls={false}
          />
          {/* Scanlines overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
            }}
          />
        </div>

        {/* Title plate */}
        <div className="mt-3 flex items-center justify-center">
          <div
            className="px-4 py-1 font-display text-sm uppercase tracking-[0.4em]"
            style={{ color: clip.tint, textShadow: `0 0 12px ${clip.tint}` }}
          >
            {clip.label}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes creature-theater-in {
          0% { transform: scale(0.6) rotateX(15deg); opacity: 0; }
          100% { transform: scale(1) rotateX(0); opacity: 1; }
        }
        @keyframes creature-bulb {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

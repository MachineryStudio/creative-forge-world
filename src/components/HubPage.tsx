import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

interface HubProps {
  title: string;
  subtitle: string;
  hue: number;
  description: string;
  game: "click" | "drag" | "toggle" | "rhythm" | "memory" | "type" | "shoot";
  children?: React.ReactNode;
}

export function HubPage({ title, subtitle, hue, description, game }: HubProps) {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div
        className="border-b border-border"
        style={{ background: `radial-gradient(circle at 20% 0%, oklch(0.35 0.18 ${hue} / 0.4), transparent 60%)` }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Back to Hub
          </Link>
          <h1 className="mt-4 font-display text-5xl" style={{ color: `oklch(0.85 0.2 ${hue})` }}>
            {title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground">{description}</p>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1fr_360px]">
        <div className="panel scanlines relative min-h-[420px] p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.3em] text-primary">Mini Game</h2>
            <div className="font-display text-sm">
              SCORE: <span className="neon-text">{score.toString().padStart(5, "0")}</span>
            </div>
          </div>
          <MiniGame game={game} hue={hue} onScore={(n) => setScore((s) => s + n)} />
        </div>

        <aside className="space-y-4">
          <div className="panel p-4">
            <h3 className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Pipeline Stage</h3>
            <ul className="space-y-1 text-sm text-foreground">
              <li>· Concept & Reference</li>
              <li>· Base Mesh / Blockout</li>
              <li>· Sculpt → Retopo → UV</li>
              <li>· Bake & Texture</li>
              <li>· Rig · Animate · Render</li>
            </ul>
          </div>
          <div className="panel p-4">
            <h3 className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Tech Used</h3>
            <p className="text-xs text-muted-foreground">Maya · ZBrush · Substance · Marmoset · Blender · Marvelous · Clip Studio · Python</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* ----- Mini-games (kept tiny but functional) ----- */
function MiniGame({ game, hue, onScore }: { game: HubProps["game"]; hue: number; onScore: (n: number) => void }) {
  if (game === "click") return <ClickGame hue={hue} onScore={onScore} />;
  if (game === "drag") return <DragGame hue={hue} onScore={onScore} />;
  if (game === "toggle") return <ToggleGame hue={hue} onScore={onScore} />;
  if (game === "rhythm") return <RhythmGame hue={hue} onScore={onScore} />;
  if (game === "memory") return <MemoryGame hue={hue} onScore={onScore} />;
  if (game === "type") return <TypeGame hue={hue} onScore={onScore} />;
  return <ShootGame hue={hue} onScore={onScore} />;
}

function ClickGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [target, setTarget] = useState({ x: 50, y: 50 });
  return (
    <div className="relative h-80 overflow-hidden rounded-md border border-border bg-background/40">
      <p className="absolute left-3 top-2 text-xs text-muted-foreground">Click the orb. Vertices count!</p>
      <button
        onClick={() => {
          sfx.coin(); onScore(10);
          setTarget({ x: 5 + Math.random() * 90, y: 15 + Math.random() * 75 });
        }}
        className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
        style={{
          left: `${target.x}%`, top: `${target.y}%`,
          background: `radial-gradient(circle at 30% 30%, oklch(0.9 0.2 ${hue}), oklch(0.4 0.1 ${hue}))`,
          boxShadow: `0 0 24px oklch(0.7 0.2 ${hue} / 0.8)`,
        }}
      />
    </div>
  );
}

function DragGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [pos, setPos] = useState({ x: 20, y: 50 });
  const dragging = useRef(false);
  return (
    <div
      className="relative h-80 overflow-hidden rounded-md border border-border bg-background/40"
      onMouseMove={(e) => {
        if (!dragging.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onMouseUp={() => (dragging.current = false)}
    >
      <p className="absolute left-3 top-2 text-xs text-muted-foreground">Drag the brush stroke into the target zone.</p>
      <div className="absolute right-6 top-1/2 grid h-20 w-20 -translate-y-1/2 place-items-center rounded-md border-2 border-dashed text-[10px] text-muted-foreground"
        style={{ borderColor: `oklch(0.7 0.2 ${hue})` }}>TARGET</div>
      <div
        onMouseDown={() => (dragging.current = true)}
        onMouseUp={() => {
          if (pos.x > 70 && pos.y > 30 && pos.y < 70) { sfx.coin(); onScore(25); setPos({ x: 20, y: 50 }); }
        }}
        className="absolute h-10 w-16 cursor-grab rounded-sm"
        style={{
          left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)",
          background: `linear-gradient(90deg, oklch(0.8 0.2 ${hue}), oklch(0.5 0.15 ${hue}))`,
        }}
      />
    </div>
  );
}

function ToggleGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [bits, setBits] = useState(Array(8).fill(false));
  return (
    <div className="grid h-80 place-items-center rounded-md border border-border bg-background/40 p-6">
      <div>
        <p className="mb-3 text-center text-xs text-muted-foreground">Light up all 8 bits to compile.</p>
        <div className="flex gap-2">
          {bits.map((b, i) => (
            <button key={i}
              onClick={() => {
                sfx.click();
                const next = [...bits]; next[i] = !next[i]; setBits(next);
                if (next.every(Boolean)) { sfx.coin(); onScore(80); setTimeout(() => setBits(Array(8).fill(false)), 600); }
              }}
              className="h-12 w-8 rounded-sm border"
              style={{
                background: b ? `oklch(0.8 0.2 ${hue})` : "oklch(0.2 0.04 270)",
                borderColor: `oklch(0.7 0.2 ${hue})`,
                boxShadow: b ? `0 0 14px oklch(0.7 0.2 ${hue} / 0.8)` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RhythmGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [hit, setHit] = useState<number | null>(null);
  useEffect(() => {
    const t = setInterval(() => setHit(Math.floor(Math.random() * 4)), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="grid h-80 place-items-center rounded-md border border-border bg-background/40">
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <button key={i}
            onClick={() => { if (i === hit) { sfx.coin(); onScore(15); } else { sfx.death(); } }}
            className="h-20 w-20 rounded-md border-2 transition"
            style={{
              borderColor: `oklch(0.7 0.2 ${hue + i * 30})`,
              background: hit === i ? `oklch(0.6 0.2 ${hue + i * 30})` : "oklch(0.2 0.04 270)",
              boxShadow: hit === i ? `0 0 18px oklch(0.7 0.2 ${hue + i * 30})` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MemoryGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [seq, setSeq] = useState<number[]>([0, 2, 1, 3]);
  const [step, setStep] = useState(0);
  return (
    <div className="grid h-80 place-items-center rounded-md border border-border bg-background/40 p-6">
      <div>
        <p className="mb-3 text-center text-xs text-muted-foreground">Repeat: {seq.join(" → ")}</p>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <button key={i}
              onClick={() => {
                sfx.click();
                if (i === seq[step]) {
                  if (step + 1 === seq.length) {
                    sfx.coin(); onScore(40);
                    setSeq(Array.from({ length: seq.length + 1 }, () => Math.floor(Math.random() * 4)));
                    setStep(0);
                  } else setStep(step + 1);
                } else { sfx.death(); setStep(0); }
              }}
              className="h-16 w-24 rounded-md border-2"
              style={{ borderColor: `oklch(0.7 0.2 ${hue + i * 40})`, background: `oklch(0.25 0.08 ${hue + i * 40})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TypeGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const words = ["import", "def", "class", "rig", "vertex", "shader", "sculpt"];
  const [w, setW] = useState(words[0]);
  const [v, setV] = useState("");
  return (
    <div className="grid h-80 place-items-center rounded-md border border-border bg-background/40 p-6">
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Type the keyword — Python pipeline scripts.</p>
        <div className="mb-4 font-display text-4xl" style={{ color: `oklch(0.85 0.2 ${hue})` }}>{w}</div>
        <input
          autoFocus
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            if (e.target.value === w) {
              sfx.coin(); onScore(20); setV("");
              setW(words[Math.floor(Math.random() * words.length)]);
            }
          }}
          className="rounded-md border border-border bg-background px-3 py-2 text-center font-display"
        />
      </div>
    </div>
  );
}

function ShootGame({ hue, onScore }: { hue: number; onScore: (n: number) => void }) {
  const [enemies, setEnemies] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      setEnemies((es) => [...es.slice(-6), { id: Date.now(), x: Math.random() * 90 + 5, y: Math.random() * 80 + 5 }]);
    }, 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-80 overflow-hidden rounded-md border border-border bg-background/40">
      <p className="absolute left-3 top-2 text-xs text-muted-foreground">Click incoming creatures.</p>
      {enemies.map((e) => (
        <button key={e.id}
          onClick={() => { sfx.death(); onScore(12); setEnemies((es) => es.filter((x) => x.id !== e.id)); }}
          className="absolute h-8 w-8 rounded-full"
          style={{
            left: `${e.x}%`, top: `${e.y}%`,
            background: `radial-gradient(circle, oklch(0.7 0.2 ${hue}), oklch(0.3 0.1 ${hue}))`,
            boxShadow: `0 0 12px oklch(0.7 0.2 ${hue})`,
          }}
        />
      ))}
    </div>
  );
}

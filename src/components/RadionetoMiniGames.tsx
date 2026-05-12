import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// SHARED CANVAS HOOK
// ============================================================
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, dt: number, t: number) => void,
  deps: unknown[] = [],
  active = true,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    const start = last;
    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      draw(ctx, dt, now - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

const W = 800;
const H = 500;

// ============================================================
// SPACE INVADERS · スペースインベーダー
// ============================================================
export function SpaceInvaders() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const playerRef = useRef({ x: W / 2, y: H - 40 });
  const keysRef = useRef<Record<string, boolean>>({});
  const bulletsRef = useRef<{ x: number; y: number; vy: number; enemy?: boolean }[]>([]);
  const enemiesRef = useRef<{ x: number; y: number; alive: boolean }[]>([]);
  const dirRef = useRef(1);
  const fireRef = useRef(0);

  const reset = useCallback(() => {
    playerRef.current = { x: W / 2, y: H - 40 };
    bulletsRef.current = [];
    enemiesRef.current = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) {
      enemiesRef.current.push({ x: 80 + c * 60, y: 60 + r * 40, alive: true });
    }
    dirRef.current = 1;
    setScore(0);
    setOver(false);
  }, []);
  useEffect(() => { reset(); }, [reset]);

  useEffect(() => {
    const d = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; if (["arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault(); };
    const u = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", d); window.addEventListener("keyup", u);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, []);

  const ref = useCanvasLoop((ctx, dt, t) => {
    if (over) return;
    const k = keysRef.current;
    const p = playerRef.current;
    if (k["arrowleft"] || k["a"]) p.x -= 5;
    if (k["arrowright"] || k["d"]) p.x += 5;
    p.x = Math.max(20, Math.min(W - 20, p.x));
    if ((k[" "] || k["w"]) && t - fireRef.current > 280) {
      fireRef.current = t;
      bulletsRef.current.push({ x: p.x, y: p.y - 10, vy: -8 });
    }

    // enemy movement
    let edge = false;
    enemiesRef.current.forEach(e => {
      if (!e.alive) return;
      e.x += dirRef.current * 0.5;
      if (e.x < 20 || e.x > W - 20) edge = true;
    });
    if (edge) {
      dirRef.current *= -1;
      enemiesRef.current.forEach(e => { e.y += 14; });
    }
    // enemy fire
    if (Math.random() < 0.02) {
      const alive = enemiesRef.current.filter(e => e.alive);
      if (alive.length) {
        const e = alive[Math.floor(Math.random() * alive.length)];
        bulletsRef.current.push({ x: e.x, y: e.y, vy: 4, enemy: true });
      }
    }

    // background
    ctx.fillStyle = "#0a0820";
    ctx.fillRect(0, 0, W, H);
    // stars
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.3 * Math.sin(t / 500 + i)})`;
      ctx.fillRect((i * 97) % W, (i * 53 + t / 5) % H, 2, 2);
    }

    // bullets
    bulletsRef.current = bulletsRef.current.filter(b => {
      b.y += b.vy;
      ctx.fillStyle = b.enemy ? "#f472b6" : "#67e8f9";
      ctx.fillRect(b.x - 2, b.y - 6, 4, 10);
      if (b.y < 0 || b.y > H) return false;
      // hit player
      if (b.enemy && Math.abs(b.x - p.x) < 20 && Math.abs(b.y - p.y) < 20) {
        setOver(true);
        return false;
      }
      // hit enemy
      if (!b.enemy) {
        for (const e of enemiesRef.current) {
          if (e.alive && Math.abs(b.x - e.x) < 22 && Math.abs(b.y - e.y) < 16) {
            e.alive = false;
            setScore(s => s + 10);
            return false;
          }
        }
      }
      return true;
    });

    // enemies
    enemiesRef.current.forEach(e => {
      if (!e.alive) return;
      ctx.fillStyle = "#a78bfa";
      ctx.fillRect(e.x - 16, e.y - 10, 32, 20);
      ctx.fillStyle = "#f0abfc";
      ctx.fillRect(e.x - 10, e.y - 4, 4, 4);
      ctx.fillRect(e.x + 6, e.y - 4, 4, 4);
      if (e.y > H - 80) setOver(true);
    });

    // player
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - 14);
    ctx.lineTo(p.x - 18, p.y + 10);
    ctx.lineTo(p.x + 18, p.y + 10);
    ctx.closePath();
    ctx.fill();

    if (enemiesRef.current.every(e => !e.alive)) setOver(true);
  }, [over]);

  return (
    <div className="relative">
      <canvas ref={ref} width={W} height={H} className="w-full rounded-xl border border-primary/40" style={{ aspectRatio: "16/10" }} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-2 font-display text-sm text-cyan-200 backdrop-blur">
        Score · 点数: {score}
      </div>
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/80">
          <div className="font-display text-4xl text-pink-300">GAME OVER · 終了</div>
          <div className="text-cyan-200">Score: {score}</div>
          <button onClick={reset} className="rounded-md bg-cyan-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-black">Restart · 再開</button>
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">← → move · Space fire · 矢印移動・スペース発射</div>
    </div>
  );
}

// ============================================================
// TETRIS · テトリス
// ============================================================
const TET_W = 10, TET_H = 20, CELL = 24;
const SHAPES: number[][][] = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]],
];
const COLORS = ["#22d3ee", "#facc15", "#a78bfa", "#fb923c", "#60a5fa", "#34d399", "#f472b6"];

export function Tetris() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const gridRef = useRef<number[][]>([]);
  const pieceRef = useRef<{ shape: number[][]; x: number; y: number; color: number } | null>(null);
  const dropRef = useRef(0);

  const newPiece = () => {
    const i = Math.floor(Math.random() * SHAPES.length);
    return { shape: SHAPES[i].map(r => [...r]), x: 3, y: 0, color: i + 1 };
  };
  const reset = useCallback(() => {
    gridRef.current = Array.from({ length: TET_H }, () => Array(TET_W).fill(0));
    pieceRef.current = newPiece();
    setScore(0); setOver(false);
  }, []);
  useEffect(() => { reset(); }, [reset]);

  const collides = (p: { shape: number[][]; x: number; y: number }) => {
    for (let r = 0; r < p.shape.length; r++) for (let c = 0; c < p.shape[r].length; c++) {
      if (!p.shape[r][c]) continue;
      const x = p.x + c, y = p.y + r;
      if (x < 0 || x >= TET_W || y >= TET_H) return true;
      if (y >= 0 && gridRef.current[y][x]) return true;
    }
    return false;
  };
  const merge = () => {
    const p = pieceRef.current!;
    p.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v && p.y + r >= 0) gridRef.current[p.y + r][p.x + c] = p.color;
    }));
    // clear lines
    let cleared = 0;
    gridRef.current = gridRef.current.filter(row => {
      if (row.every(v => v)) { cleared++; return false; }
      return true;
    });
    while (gridRef.current.length < TET_H) gridRef.current.unshift(Array(TET_W).fill(0));
    if (cleared) setScore(s => s + cleared * 100);
    pieceRef.current = newPiece();
    if (collides(pieceRef.current)) setOver(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over || !pieceRef.current) return;
      const p = pieceRef.current;
      if (e.key === "ArrowLeft") { p.x--; if (collides(p)) p.x++; }
      else if (e.key === "ArrowRight") { p.x++; if (collides(p)) p.x--; }
      else if (e.key === "ArrowDown") { p.y++; if (collides(p)) { p.y--; merge(); } }
      else if (e.key === "ArrowUp" || e.key === " ") {
        const rotated = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
        const old = p.shape;
        p.shape = rotated;
        if (collides(p)) p.shape = old;
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over]);

  const ref = useCanvasLoop((ctx, dt) => {
    if (over) return;
    dropRef.current += dt;
    if (dropRef.current > 500) {
      dropRef.current = 0;
      const p = pieceRef.current!;
      p.y++;
      if (collides(p)) { p.y--; merge(); }
    }
    ctx.fillStyle = "#0a0820";
    ctx.fillRect(0, 0, W, H);
    const ox = (W - TET_W * CELL) / 2, oy = 10;
    // grid
    for (let r = 0; r < TET_H; r++) for (let c = 0; c < TET_W; c++) {
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.strokeRect(ox + c * CELL, oy + r * CELL, CELL, CELL);
      const v = gridRef.current[r][c];
      if (v) {
        ctx.fillStyle = COLORS[v - 1];
        ctx.fillRect(ox + c * CELL + 1, oy + r * CELL + 1, CELL - 2, CELL - 2);
      }
    }
    // piece
    const p = pieceRef.current!;
    ctx.fillStyle = COLORS[p.color - 1];
    p.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v) ctx.fillRect(ox + (p.x + c) * CELL + 1, oy + (p.y + r) * CELL + 1, CELL - 2, CELL - 2);
    }));
  }, [over]);

  return (
    <div className="relative">
      <canvas ref={ref} width={W} height={H} className="w-full rounded-xl border border-primary/40" style={{ aspectRatio: "16/10" }} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-2 font-display text-sm text-cyan-200 backdrop-blur">
        Score · 点数: {score}
      </div>
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/80">
          <div className="font-display text-4xl text-pink-300">GAME OVER · 終了</div>
          <div className="text-cyan-200">Score: {score}</div>
          <button onClick={reset} className="rounded-md bg-cyan-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-black">Restart · 再開</button>
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">← → move · ↑/Space rotate · ↓ drop · 矢印操作</div>
    </div>
  );
}

// ============================================================
// TAB BIRD · タブバード (Flappy)
// ============================================================
export function TabBird() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const birdRef = useRef({ y: H / 2, vy: 0 });
  const pipesRef = useRef<{ x: number; gap: number; passed?: boolean }[]>([]);
  const spawnRef = useRef(0);

  const reset = useCallback(() => {
    birdRef.current = { y: H / 2, vy: 0 };
    pipesRef.current = [];
    spawnRef.current = 0;
    setScore(0); setOver(false);
  }, []);
  useEffect(() => { reset(); }, [reset]);

  const flap = useCallback(() => {
    if (over) { reset(); return; }
    birdRef.current.vy = -7;
  }, [over, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "Tab" || e.key === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  const ref = useCanvasLoop((ctx, dt, t) => {
    if (over) return;
    const b = birdRef.current;
    b.vy += 0.35;
    b.y += b.vy;

    spawnRef.current += dt;
    if (spawnRef.current > 1400) {
      spawnRef.current = 0;
      pipesRef.current.push({ x: W + 20, gap: 100 + Math.random() * (H - 250) });
    }
    pipesRef.current = pipesRef.current.filter(p => {
      p.x -= 3;
      return p.x > -80;
    });

    // background gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#fb7185"); g.addColorStop(0.6, "#a78bfa"); g.addColorStop(1, "#0a0820");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // sun
    ctx.fillStyle = "rgba(253,224,71,0.7)";
    ctx.beginPath(); ctx.arc(W - 100, 100, 50, 0, Math.PI * 2); ctx.fill();

    const PIPE_W = 60, GAP_H = 160;
    pipesRef.current.forEach(p => {
      ctx.fillStyle = "#34d399";
      ctx.fillRect(p.x, 0, PIPE_W, p.gap);
      ctx.fillRect(p.x, p.gap + GAP_H, PIPE_W, H - p.gap - GAP_H);
      // collision
      if (60 + 18 > p.x && 60 - 18 < p.x + PIPE_W) {
        if (b.y - 14 < p.gap || b.y + 14 > p.gap + GAP_H) setOver(true);
      }
      if (!p.passed && p.x + PIPE_W < 60) { p.passed = true; setScore(s => s + 1); }
    });

    // bird
    ctx.save();
    ctx.translate(60, b.y);
    ctx.rotate(Math.max(-0.4, Math.min(1, b.vy / 10)));
    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0a0820"; ctx.beginPath(); ctx.arc(6, -4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fb923c"; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(24, -2); ctx.lineTo(14, 4); ctx.fill();
    ctx.restore();

    if (b.y > H - 10 || b.y < 10) setOver(true);
    // ground
    ctx.fillStyle = "#451a03"; ctx.fillRect(0, H - 10, W, 10);
  }, [over]);

  return (
    <div className="relative">
      <canvas ref={ref} width={W} height={H} onPointerDown={flap}
        className="w-full cursor-pointer rounded-xl border border-primary/40" style={{ aspectRatio: "16/10" }} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-2 font-display text-sm text-cyan-200 backdrop-blur">
        Score · 点数: {score}
      </div>
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/80">
          <div className="font-display text-4xl text-pink-300">GAME OVER · 終了</div>
          <div className="text-cyan-200">Score: {score}</div>
          <button onClick={reset} className="rounded-md bg-cyan-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-black">Restart · 再開</button>
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">Space / Tab / Click to flap · 羽ばたく</div>
    </div>
  );
}

// ============================================================
// INPUT MATCHING · 入力マッチング (Simon-like)
// ============================================================
const MATCH_KEYS = ["A", "S", "D", "F"];
const MATCH_COLORS = ["#f472b6", "#22d3ee", "#facc15", "#34d399"];
const MATCH_JP = ["桜", "水", "金", "森"];

export function InputMatching() {
  const [seq, setSeq] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [showing, setShowing] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const playSeq = useCallback(async (s: number[]) => {
    setShowing(true);
    for (const i of s) {
      setActive(i);
      await new Promise(r => setTimeout(r, 500));
      setActive(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setShowing(false);
  }, []);

  const next = useCallback(() => {
    const nxt = [...seq, Math.floor(Math.random() * 4)];
    setSeq(nxt);
    setInput([]);
    setTimeout(() => playSeq(nxt), 600);
  }, [seq, playSeq]);

  const reset = useCallback(() => {
    setSeq([]); setInput([]); setScore(0); setOver(false);
    setTimeout(() => {
      const first = [Math.floor(Math.random() * 4)];
      setSeq(first);
      setTimeout(() => playSeq(first), 400);
    }, 200);
  }, [playSeq]);
  useEffect(() => { reset(); }, []); // eslint-disable-line

  const press = useCallback((i: number) => {
    if (showing || over) return;
    setActive(i);
    setTimeout(() => setActive(null), 200);
    const ni = [...input, i];
    if (seq[ni.length - 1] !== i) { setOver(true); return; }
    if (ni.length === seq.length) {
      setScore(s => s + seq.length * 10);
      setInput([]);
      setTimeout(() => next(), 500);
    } else {
      setInput(ni);
    }
  }, [input, seq, showing, over, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = MATCH_KEYS.indexOf(e.key.toUpperCase());
      if (i >= 0) press(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <div className="relative rounded-xl border border-primary/40 bg-[#0a0820] p-6" style={{ minHeight: 500 }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-sm text-cyan-200">Score · 点数: {score}</div>
        <div className="font-display text-sm text-pink-300">Level · 段: {seq.length}</div>
      </div>
      <div className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
        {showing ? "Watch · 見て" : "Repeat the sequence · 順番に押す"}
      </div>
      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onPointerDown={() => press(i)}
            className="aspect-square rounded-2xl border-4 transition-transform"
            style={{
              borderColor: MATCH_COLORS[i],
              background: active === i ? MATCH_COLORS[i] : MATCH_COLORS[i] + "30",
              transform: active === i ? "scale(0.95)" : "scale(1)",
              boxShadow: active === i ? `0 0 50px ${MATCH_COLORS[i]}` : "none",
            }}
          >
            <div className="font-display text-5xl text-white drop-shadow">{MATCH_JP[i]}</div>
            <div className="mt-2 font-display text-sm text-white/80">{MATCH_KEYS[i]}</div>
          </button>
        ))}
      </div>
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/80">
          <div className="font-display text-4xl text-pink-300">GAME OVER · 終了</div>
          <div className="text-cyan-200">Score: {score} · Reached level {seq.length}</div>
          <button onClick={reset} className="rounded-md bg-cyan-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-black">Restart · 再開</button>
        </div>
      )}
      <div className="mt-4 text-center text-xs text-muted-foreground">Keys A · S · D · F or tap pads</div>
    </div>
  );
}

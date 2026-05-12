import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { RadioNerd } from "@/components/RadioNerd";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import bassImg from "@/assets/rocker-bass.jpg";
import drumImg from "@/assets/rocker-drummer.jpg";
import drumImg2 from "@/assets/rocker-drummer-2.jpg";

export const Route = createFileRoute("/radioneto")({
  head: () => ({
    meta: [
      { title: "RADIONETO ラジオナード — Rhythm Game" },
      { name: "description", content: "Japanese visual-kei rhythm game. Pick bass or drums and follow the beat." },
    ],
  }),
  component: Radioneto,
});

type Role = "drummer" | "bass" | null;

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  duration: number; // seconds
  youtubeId?: string;
}

const DEFAULT_SONGS: Song[] = [
  { id: "s1", title: "Neon Sakura 桜", artist: "MIYU", bpm: 128, genre: "Visual Kei", duration: 45, youtubeId: "o6wtDPVkKqI" },
  { id: "s2", title: "Tokyo Rain 東京の雨", artist: "RadioNerd", bpm: 110, genre: "JPop", duration: 40 },
  { id: "s3", title: "Bullet Train 新幹線", artist: "Hanna", bpm: 160, genre: "Visual Kei", duration: 35 },
  { id: "s4", title: "Pixel Heart", artist: "8bit Idol", bpm: 140, genre: "Game", duration: 40 },
  { id: "s5", title: "Moonlight Solo 月光", artist: "Yuki", bpm: 90, genre: "Anime", duration: 50 },
  { id: "s6", title: "Cyber Kawaii かわいい", artist: "Mirai", bpm: 150, genre: "JPop", duration: 38 },
  { id: "s7", title: "Storm Drums 嵐", artist: "Raiden", bpm: 175, genre: "Metal", duration: 32 },
];

const JP_GOOD = ["スゴイ!", "やった!", "最高!", "完璧!", "見事!"];
const JP_BAD = ["ダメ!", "残念!", "もう一度!"];
const KANJI_POOL = ["桜", "炎", "水", "金", "夢", "心", "光", "音", "舞", "雷", "風", "月", "愛", "魂", "侍", "龍"];

// Detect any Japanese character (hiragana/katakana/kanji) in a string
const hasJapanese = (s: string) => /[\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9d]/.test(s);

interface Note {
  t: number; // beat time (ms from start)
  hit: "perfect" | "good" | "miss" | null;
  pulse: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
  kind?: "spark" | "fire" | "water" | "money" | "kanji";
  char?: string;
}

function Radioneto() {
  const [role, setRole] = useState<Role>(null);
  const [songIdx, setSongIdx] = useState(0);
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [phase, setPhase] = useState<"select" | "playing" | "win" | "fail">("select");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [missStreak, setMissStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [floatText, setFloatText] = useState<{ id: number; text: string; color: string } | null>(null);
  const [keyFlash, setKeyFlash] = useState(false);
  const [meterPct, setMeterPct] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const notesRef = useRef<Note[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const ytRef = useRef<HTMLIFrameElement>(null);
  const lastBeatRef = useRef<number>(-1);

  const song = songs[songIdx] ?? songs[0];
  const isJP = !!song && (hasJapanese(song.title) || hasJapanese(song.artist));

  useEffect(() => {
    const s = localStorage.getItem("radioneto_best");
    if (s) setBestScore(parseInt(s));
  }, []);

  // Pull admin-fed tracks from radio_tracks DB and merge into the song list
  useEffect(() => {
    let active = true;
    getSupabase()
      .then(async (supabase) => {
        const { data } = await supabase
          .from("radio_tracks")
          .select("id, title, artist_name, genre, youtube_id")
          .order("position", { ascending: true });
        const rows = (data ?? []) as Array<{ id: string; title: string; artist_name: string | null; genre: string; youtube_id: string }>;
        if (!active || rows.length === 0) return;
        const dbSongs: Song[] = rows.map((r) => ({
          id: `db-${r.id}`,
          title: r.title,
          artist: r.artist_name || "RadioNerd",
          bpm: 120,
          genre: r.genre,
          duration: 45,
          youtubeId: r.youtube_id,
        }));
        setSongs([...dbSongs, ...DEFAULT_SONGS]);
      })
      .catch((err) => console.warn(getSupabaseLoadMessage(err)));
    return () => { active = false; };
  }, []);

  const showFloat = (text: string, color: string) => {
    setFloatText({ id: Date.now(), text, color });
    setTimeout(() => setFloatText(null), 900);
  };

  const spawnParticles = (x: number, y: number, color: string, n = 18) => {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const sp = 2 + Math.random() * 4;
      particlesRef.current.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, color, size: 2 + Math.random() * 4, kind: "spark",
      });
    }
    // When a Japanese-native track is playing, sprinkle bonus FX on every hit
    if (isJP) {
      // Kanji burst
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2;
        particlesRef.current.push({
          x, y, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2 - 2,
          life: 1.4, color: "#fde047", size: 22 + Math.random() * 10,
          kind: "kanji", char: KANJI_POOL[Math.floor(Math.random() * KANJI_POOL.length)],
        });
      }
      // Money rain
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 60, y: y - 40, vx: (Math.random() - 0.5) * 1.5, vy: -3 - Math.random() * 2,
          life: 1.2, color: "#facc15", size: 14, kind: "money",
        });
      }
      // Fire + water mixed
      for (let i = 0; i < 10; i++) {
        const fire = Math.random() < 0.5;
        const a = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 3;
        particlesRef.current.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
          life: 1, color: fire ? "#fb923c" : "#22d3ee", size: 4 + Math.random() * 4,
          kind: fire ? "fire" : "water",
        });
      }
    }
  };

  const startGame = () => {
    if (!role) return;
    const beatMs = 60000 / song.bpm;
    const notes: Note[] = [];
    // start notes after 2s lead-in, one per beat for duration
    for (let t = 2000; t < song.duration * 1000; t += beatMs) {
      notes.push({ t, hit: null, pulse: 0 });
    }
    notesRef.current = notes;
    particlesRef.current = [];
    setScore(0); setCombo(0); setMaxCombo(0); setMissStreak(0); setMeterPct(0);
    lastBeatRef.current = -1;
    startTimeRef.current = performance.now();
    setPhase("playing");
  };

  const endGame = useCallback((won: boolean) => {
    setPhase(won ? "win" : "fail");
    showFloat(won ? JP_GOOD[Math.floor(Math.random() * JP_GOOD.length)] + " 🎉" : JP_BAD[Math.floor(Math.random() * JP_BAD.length)] + " 💥", won ? "#34d399" : "#ef4444");
    setScore((s) => {
      const final = s;
      if (final > bestScore) {
        setBestScore(final);
        localStorage.setItem("radioneto_best", String(final));
      }
      return final;
    });
  }, [bestScore]);

  const handleTap = useCallback((tapX?: number, tapY?: number) => {
    if (phase !== "playing") return;
    setKeyFlash(true);
    setTimeout(() => setKeyFlash(false), 120);
    const elapsed = performance.now() - startTimeRef.current;
    // find nearest unhit note within window
    let bestIdx = -1; let bestDelta = Infinity;
    notesRef.current.forEach((n, i) => {
      if (n.hit) return;
      const d = Math.abs(n.t - elapsed);
      if (d < bestDelta) { bestDelta = d; bestIdx = i; }
    });
    if (bestIdx === -1) return;
    const note = notesRef.current[bestIdx];

    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 400;
    const cy = canvas ? canvas.height - 110 : 380;

    if (bestDelta <= 120) {
      note.hit = "perfect"; note.pulse = 1;
      setScore((s) => s + 100);
      setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); return nc; });
      setMissStreak(0);
      setMeterPct((p) => Math.min(100, p + 8));
      spawnParticles(tapX ?? cx, tapY ?? cy, "#f0abfc", 24);
      showFloat("PERFECT +100", "#f0abfc");
    } else if (bestDelta <= 220) {
      note.hit = "good"; note.pulse = 1;
      setScore((s) => s + 50);
      setCombo((c) => c + 1);
      setMissStreak(0);
      setMeterPct((p) => Math.min(100, p + 4));
      spawnParticles(tapX ?? cx, tapY ?? cy, "#67e8f9", 14);
      showFloat("GOOD +50", "#67e8f9");
    } else if (bestDelta <= 400) {
      note.hit = "miss";
      setScore((s) => Math.max(0, s - 50));
      setCombo(0);
      setMissStreak((m) => {
        const nm = m + 1;
        if (nm >= 5) {
          setTimeout(() => endGame(false), 0);
        }
        return nm;
      });
      showFloat("MISS -50", "#ef4444");
    }
  }, [phase, endGame]);

  // Auto-miss notes that fell past window
  // Animation loop
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    let running = true;
    const loop = () => {
      if (!running) return;
      const elapsed = performance.now() - startTimeRef.current;

      // Auto-miss old notes
      notesRef.current.forEach((n) => {
        if (!n.hit && elapsed - n.t > 220) {
          n.hit = "miss";
          setCombo(0);
          setMissStreak((m) => {
            const nm = m + 1;
            if (nm >= 5) setTimeout(() => endGame(false), 0);
            return nm;
          });
        }
      });

      // Win condition
      const lastNote = notesRef.current[notesRef.current.length - 1];
      if (lastNote && elapsed > lastNote.t + 500 && phase === "playing") {
        setTimeout(() => endGame(true), 0);
      }

      // BG pulse on beat
      const beatMs = 60000 / song.bpm;
      const beatIdx = Math.floor(elapsed / beatMs);
      const beatPhase = (elapsed % beatMs) / beatMs;
      const pulse = Math.max(0, 1 - beatPhase) * 0.5;

      // Draw background — visual kei stage
      const grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W);
      grad.addColorStop(0, `rgba(244,114,182,${0.25 + pulse * 0.3})`);
      grad.addColorStop(0.5, "rgba(139,92,246,0.25)");
      grad.addColorStop(1, "rgba(15,23,42,0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stage floor grid (perspective)
      ctx.strokeStyle = `rgba(244,114,182,${0.3 + pulse * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const y = H * 0.65 + i * 12 + (elapsed / 30 % 12);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 60, H * 0.65);
        ctx.lineTo(W / 2 + i * 200, H);
        ctx.stroke();
      }

      // Spotlights from above
      for (let i = 0; i < 4; i++) {
        const lx = (W / 5) * (i + 1);
        const sway = Math.sin(elapsed / 800 + i) * 40;
        const g2 = ctx.createLinearGradient(lx, 0, lx + sway, H * 0.6);
        g2.addColorStop(0, `rgba(${i % 2 ? "103,232,249" : "240,171,252"},${0.15 + pulse * 0.15})`);
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(lx, 0); ctx.lineTo(lx + sway - 30, H * 0.6); ctx.lineTo(lx + sway + 30, H * 0.6); ctx.closePath();
        ctx.fill();
      }

      // Fire / water side effects
      const sideColor = role === "drummer" ? ["#fb923c", "#ef4444", "#fde047"] : ["#22d3ee", "#60a5fa", "#a78bfa"];
      for (let side = 0; side < 2; side++) {
        const sx = side === 0 ? 30 : W - 30;
        for (let i = 0; i < 14; i++) {
          const t = (elapsed / 200 + i * 0.7) % 6;
          const y = H - 40 - t * 50;
          const r = 14 - t * 2;
          ctx.fillStyle = sideColor[i % sideColor.length] + "55";
          ctx.beginPath();
          ctx.arc(sx + Math.sin(elapsed / 200 + i) * 12, y, Math.max(2, r), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Beat detector visualizer — bars
      ctx.fillStyle = "rgba(244,114,182,0.6)";
      const bars = 32;
      for (let i = 0; i < bars; i++) {
        const h = 8 + Math.abs(Math.sin(elapsed / 100 + i)) * (40 + pulse * 80);
        ctx.fillRect((W / bars) * i + 2, H * 0.4 - h, W / bars - 4, h);
      }

      // Target circle (bottom)
      const tx = W / 2, ty = H - 110;
      const targetR = 60 + pulse * 12;
      ctx.strokeStyle = `rgba(240,171,252,${0.6 + pulse * 0.4})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(tx, ty, targetR, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(103,232,249,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(tx, ty, targetR - 12, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(244,114,182,${0.1 + pulse * 0.3})`;
      ctx.beginPath(); ctx.arc(tx, ty, targetR - 18, 0, Math.PI * 2); ctx.fill();

      // Falling notes — slide down toward target
      const travelMs = 1500;
      notesRef.current.forEach((n) => {
        if (n.hit === "perfect" || n.hit === "good") return;
        const remaining = n.t - elapsed; // ms until hit
        if (remaining > travelMs || remaining < -300) return;
        const progress = 1 - remaining / travelMs;
        const ny = 60 + progress * (ty - 60);
        const alpha = n.hit === "miss" ? 0.3 : 1;
        ctx.fillStyle = `rgba(240,171,252,${alpha})`;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tx, ny, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // glow ring
        ctx.strokeStyle = `rgba(103,232,249,${alpha * 0.6})`;
        ctx.beginPath(); ctx.arc(tx, ny, 30 + Math.sin(elapsed / 100) * 3, 0, Math.PI * 2); ctx.stroke();
      });

      // Melody wave (chorus bonus) — last 1/3
      if (elapsed > song.duration * 1000 * 0.55) {
        ctx.strokeStyle = `rgba(167,243,208,${0.6 + pulse * 0.3})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = H * 0.25 + Math.sin((x + elapsed / 4) / 30) * 30;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = "rgba(167,243,208,0.9)";
        ctx.font = "bold 12px monospace";
        ctx.fillText("♪ MELODY x2 — trace the wave ♪", 20, H * 0.25 - 40);
      }

      // Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.02;
        if (p.life <= 0) return false;
        ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, "0");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
        return true;
      });

      // Beat indicator label
      if (beatIdx !== lastBeatRef.current) {
        lastBeatRef.current = beatIdx;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [phase, song, role, endGame]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.key === "f" || e.key === "j") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleTap]);

  const onCanvasPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (c.width / rect.width);
    const y = (e.clientY - rect.top) * (c.height / rect.height);
    handleTap(x, y);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4">
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-primary">ラジオナード</div>
          <h1 className="font-display text-4xl neon-text">RADIONETO — BeatSync Studio</h1>
          <p className="text-sm text-muted-foreground">Japanese visual-kei rhythm game. Tap on beat. Miss 5 in a row and the music stops.</p>
        </div>

        {phase === "select" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <button onClick={() => setRole("drummer")}
                className={`panel scanlines group relative overflow-hidden rounded-xl border-2 p-2 text-left transition ${role === "drummer" ? "border-primary neon-glow" : "border-border hover:border-primary/60"}`}>
                <img src={drumImg} alt="Drummer" className="h-64 w-full rounded-lg object-cover" />
                <div className="mt-3 px-2 pb-2">
                  <div className="font-display text-xl text-primary">🥁 Play as Drummer</div>
                  <div className="text-xs text-muted-foreground">Smash the kick. Visual-kei thunder.</div>
                </div>
              </button>
              <button onClick={() => setRole("bass")}
                className={`panel scanlines group relative overflow-hidden rounded-xl border-2 p-2 text-left transition ${role === "bass" ? "border-accent neon-glow" : "border-border hover:border-accent/60"}`}>
                <img src={bassImg} alt="Bass" className="h-64 w-full rounded-lg object-cover" />
                <div className="mt-3 px-2 pb-2">
                  <div className="font-display text-xl text-accent-foreground">🎸 Play as Bass Player</div>
                  <div className="text-xs text-muted-foreground">Groove the low end. Trace the melody.</div>
                </div>
              </button>
            </div>

            <div className="panel scanlines flex flex-col items-start gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <label className="font-display text-xs uppercase tracking-widest text-primary">Select Song</label>
                <select
                  value={songIdx}
                  onChange={(e) => setSongIdx(parseInt(e.target.value))}
                  className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                >
                  {songs.map((s, i) => (
                    <option key={s.id} value={i}>{s.title} — {s.artist} · {s.bpm} BPM · {s.genre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground">Best: <span className="font-display text-primary">{bestScore}</span></div>
                <button
                  onClick={startGame}
                  disabled={!role}
                  className="rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-display text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-50"
                >
                  ▶ Start Song
                </button>
              </div>
            </div>
          </div>
        )}

        {phase !== "select" && (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="relative">
              {/* HUD */}
              <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-3 text-white">
                <div className="rounded-md bg-black/50 px-3 py-2 font-display text-xs uppercase tracking-widest backdrop-blur">
                  <div className="text-[10px] text-pink-300">Score</div>
                  <div className="text-2xl text-pink-200">{score}</div>
                </div>
                <div className="rounded-md bg-black/50 px-3 py-2 text-center font-display backdrop-blur">
                  <div className="text-[10px] uppercase tracking-widest text-cyan-300">Combo</div>
                  <div className="text-3xl text-cyan-200">{combo}x</div>
                </div>
                <div className="rounded-md bg-black/50 px-3 py-2 font-display text-xs uppercase tracking-widest backdrop-blur">
                  <div className="text-[10px] text-pink-300">{song.title}</div>
                  <div className="text-[10px] text-muted-foreground">{song.artist} · {song.bpm}BPM</div>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onPointerDown={onCanvasPointer}
                className="w-full cursor-crosshair touch-none rounded-xl border border-primary/40"
                style={{ aspectRatio: "16/10", boxShadow: "0 0 60px var(--shadow-neon, rgba(244,114,182,0.4))" }}
              />

              {/* Volume meter */}
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-border bg-background">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-fuchsia-400 transition-all" style={{ width: `${meterPct}%` }} />
              </div>

              {/* Floating JP text */}
              {floatText && (
                <div
                  key={floatText.id}
                  className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 animate-pulse font-display text-5xl font-bold drop-shadow-[0_0_20px_currentColor]"
                  style={{ color: floatText.color }}
                >
                  {floatText.text}
                </div>
              )}

              {/* Key indicator */}
              <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border-2 px-4 py-2 font-display text-sm uppercase tracking-widest transition ${keyFlash ? "border-pink-400 bg-pink-400/30 text-pink-100 scale-110" : "border-white/40 bg-black/50 text-white/80"}`}>
                SPACE / TAP
              </div>

              {phase === "fail" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-xl bg-red-900/80 backdrop-blur">
                  <div className="font-display text-6xl text-red-200 drop-shadow-[0_0_30px_#ef4444]">GAME OVER</div>
                  <div className="mt-2 text-xl text-red-300">{JP_BAD[0]} — You Lose</div>
                  <div className="mt-4 text-sm text-white/80">Score: {score} · Max Combo: {maxCombo}x</div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={startGame} className="rounded-md bg-red-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-white">Try Again</button>
                    <button onClick={() => setPhase("select")} className="rounded-md border border-white/40 px-5 py-2 font-display text-sm uppercase tracking-widest text-white">Menu</button>
                  </div>
                </div>
              )}

              {phase === "win" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-pink-900/80 via-purple-900/80 to-cyan-900/80 backdrop-blur">
                  <div className="font-display text-6xl text-pink-200 drop-shadow-[0_0_30px_#f472b6] animate-pulse">YATTA! 🎉</div>
                  <div className="mt-2 text-xl text-cyan-200">{JP_GOOD[Math.floor(Math.random() * JP_GOOD.length)]} — Stage Clear</div>
                  <div className="mt-4 font-display text-3xl text-white">{score} pts</div>
                  <div className="text-sm text-white/80">Max Combo: {maxCombo}x</div>
                  <div className="mt-4 text-4xl">👏👏👏</div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={startGame} className="rounded-md bg-gradient-to-r from-pink-500 to-cyan-500 px-5 py-2 font-display text-sm uppercase tracking-widest text-white">Encore</button>
                    <button onClick={() => setPhase("select")} className="rounded-md border border-white/40 px-5 py-2 font-display text-sm uppercase tracking-widest text-white">Menu</button>
                  </div>
                </div>
              )}
            </div>

            {/* Side panel: character video + stats */}
            <aside className="space-y-3">
              <div className="panel scanlines overflow-hidden rounded-xl">
                <video
                  key={role ?? ""}
                  src={role === "drummer" ? "/videos/rocker-loop-1.mp4" : "/videos/rocker-loop-2.mp4"}
                  autoPlay loop muted playsInline
                  className="block h-64 w-full object-cover"
                />
                <div className="p-3">
                  <div className="font-display text-xs uppercase tracking-widest text-primary">
                    {role === "drummer" ? "🥁 Drummer" : "🎸 Bass Player"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Visual-Kei Concert · ヴィジュアル系</div>
                </div>
              </div>

              <div className="panel rounded-xl p-3 text-xs">
                <div className="mb-1 font-display uppercase tracking-widest text-accent-foreground">Now Playing</div>
                <div className="text-sm text-foreground">{song.title}</div>
                <div className="text-muted-foreground">{song.artist} · {song.bpm} BPM</div>
                <div className="mt-2 text-[11px] text-muted-foreground">Miss streak: {missStreak}/5</div>
              </div>

              <img
                src={drumImg2}
                alt="Stage performer"
                className="rounded-xl border border-border opacity-80"
              />

              <div className="rounded-xl border border-border bg-background/40 p-3 text-[11px] text-muted-foreground">
                <strong className="text-primary">How to play:</strong> Tap SPACE, click, or touch the target on each beat. Trace the wave on chorus for x2. Miss 5 in a row → game over.
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

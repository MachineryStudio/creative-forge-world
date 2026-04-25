import { useEffect, useRef, useState, useCallback } from "react";
import hero from "@/assets/game-hero.png";
import pet from "@/assets/game-pet.jpg";
import enemy1 from "@/assets/game-enemy1.png";
import enemy2 from "@/assets/game-enemy2.png";

const WORLD_W = 720;
const WORLD_H = 240;
const GROUND_Y = 200;
const HERO_W = 56;
const HERO_H = 80;
const GRAVITY = 0.6;
const JUMP_V = -11;
const MOVE_SPEED = 4;
const MAX_HITS = 5;
const LEVEL_UP_AT = 60; // seconds

type Fireball = { x: number; y: number; vx: number; vy: number; r: number };
type Enemy = { x: number; y: number; img: string; dir: 1 | -1; cooldown: number };

// ---------- Audio (WebAudio synth) ----------
let _ac: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!_ac) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _ac = new Ctor();
  }
  if (_ac.state === "suspended") _ac.resume().catch(() => {});
  return _ac;
}
function blip(freq: number, dur = 0.1, type: OscillatorType = "square", gain = 0.08) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(c.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.stop(c.currentTime + dur);
}
const gameSfx = {
  jump: () => { blip(520, 0.08, "square"); setTimeout(() => blip(820, 0.08, "square"), 60); },
  fire: () => { blip(180, 0.18, "sawtooth", 0.06); },
  hit: () => { blip(140, 0.18, "square", 0.1); },
  death: () => { blip(330, 0.15, "sawtooth"); setTimeout(() => blip(160, 0.25, "sawtooth"), 120); setTimeout(() => blip(90, 0.4, "sawtooth"), 280); },
  levelUp: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.15, "triangle", 0.09), i * 90)); },
};

// ---------- Japanese voice ----------
function speakJa(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = opts.rate ?? 1.05;
    u.pitch = opts.pitch ?? 1.4;
    const voices = window.speechSynthesis.getVoices();
    const ja = voices.find(v => v.lang?.toLowerCase().startsWith("ja"));
    if (ja) u.voice = ja;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

const JUMP_PHRASES = ["ジャンプ！", "それ！", "やあ！", "とぅ！"];

export function AngelsFateGame() {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hits, setHits] = useState(0);
  const [time, setTime] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [subtitle, setSubtitle] = useState<{ en: string; jp: string }>({
    en: "Press START to begin.",
    jp: "スタートを押してください。",
  });

  const heroRef = useRef({ x: 80, y: GROUND_Y - HERO_H, vy: 0, onGround: true, facing: 1 as 1 | -1 });
  const enemiesRef = useRef<Enemy[]>([]);
  const fireballsRef = useRef<Fireball[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const invulnRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const leveledUpRef = useRef<boolean>(false);
  const lastJumpSpeakRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const subtitles: { en: string; jp: string }[] = [
    { en: "Don't let the fire touch your wings.", jp: "炎に翼を触れさせないで。" },
    { en: "Run, jump, survive!", jp: "走れ、跳べ、生き延びろ！" },
    { en: "Your spirit fox guides you.", jp: "霊狐があなたを導く。" },
    { en: "The bone-beasts hunger.", jp: "骨の獣が飢えている。" },
    { en: "Every second is a victory.", jp: "一秒一秒が勝利だ。" },
  ];

  // Preload voices (some browsers load async)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const handler = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener?.("voiceschanged", handler);
      return () => window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
    }
  }, []);

  const reset = useCallback(() => {
    heroRef.current = { x: 80, y: GROUND_Y - HERO_H, vy: 0, onGround: true, facing: 1 };
    enemiesRef.current = [];
    fireballsRef.current = [];
    spawnTimerRef.current = 0;
    invulnRef.current = 0;
    levelRef.current = 1;
    leveledUpRef.current = false;
    setLevel(1);
    setShowLevelUp(false);
    setHits(0);
    setTime(0);
    setGameOver(false);
    startTimeRef.current = performance.now();
    setSubtitle({ en: "Angel's Fate begins…", jp: "天使の運命、始まる…" });
  }, []);

  const start = useCallback(() => {
    ac(); // unlock audio on user gesture
    reset();
    setRunning(true);
  }, [reset]);

  // Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if ([" ", "arrowup", "arrowleft", "arrowright", "a", "d", "w"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Subtitle rotation
  useEffect(() => {
    if (!running || gameOver) return;
    const id = setInterval(() => {
      setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)]);
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, gameOver]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const heroImg = new Image(); heroImg.src = hero;
    const petImg = new Image(); petImg.src = pet;
    const e1Img = new Image(); e1Img.src = enemy1;
    const e2Img = new Image(); e2Img.src = enemy2;

    const tick = (now: number) => {
      const dt = Math.min(32, now - (lastTickRef.current || now));
      lastTickRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      setTime(elapsed);

      // Level up at 60s
      if (!leveledUpRef.current && elapsed >= LEVEL_UP_AT) {
        leveledUpRef.current = true;
        levelRef.current = 2;
        setLevel(2);
        setShowLevelUp(true);
        gameSfx.levelUp();
        speakJa("やったよ！レベルツー！", { pitch: 1.5, rate: 1.1 });
        setSubtitle({ en: "I did it! Level 2!", jp: "やったよ！レベル2！" });
        setTimeout(() => setShowLevelUp(false), 2600);
      }

      const lvl = levelRef.current;
      const h = heroRef.current;
      const k = keysRef.current;

      // movement
      if (k["arrowleft"] || k["a"]) { h.x -= MOVE_SPEED; h.facing = -1; }
      if (k["arrowright"] || k["d"]) { h.x += MOVE_SPEED; h.facing = 1; }
      if ((k[" "] || k["arrowup"] || k["w"]) && h.onGround) {
        h.vy = JUMP_V; h.onGround = false;
        gameSfx.jump();
        // Throttle Japanese voice on jump (~every 1.2s)
        if (now - lastJumpSpeakRef.current > 1200) {
          lastJumpSpeakRef.current = now;
          speakJa(JUMP_PHRASES[Math.floor(Math.random() * JUMP_PHRASES.length)]);
        }
      }
      h.vy += GRAVITY;
      h.y += h.vy;
      if (h.y + HERO_H >= GROUND_Y) { h.y = GROUND_Y - HERO_H; h.vy = 0; h.onGround = true; }
      h.x = Math.max(0, Math.min(WORLD_W - HERO_W, h.x));

      // spawn enemies (faster + more on level 2)
      spawnTimerRef.current -= dt;
      const baseDiff = Math.min(3, 1 + elapsed / 25);
      const difficulty = lvl === 2 ? baseDiff + 1.2 : baseDiff;
      const maxEnemies = Math.floor((lvl === 2 ? 2 : 1) + difficulty);
      if (spawnTimerRef.current <= 0 && enemiesRef.current.length < maxEnemies) {
        const fromRight = Math.random() > 0.5;
        enemiesRef.current.push({
          x: fromRight ? WORLD_W - 70 : 10,
          y: GROUND_Y - 70,
          img: Math.random() > 0.5 ? enemy1 : enemy2,
          dir: fromRight ? -1 : 1,
          cooldown: 600 + Math.random() * 1000,
        });
        spawnTimerRef.current = (lvl === 2 ? 1600 : 2500) / difficulty;
      }

      // update enemies + fire
      for (const e of enemiesRef.current) {
        e.x += e.dir * (lvl === 2 ? 0.7 : 0.4);
        if (e.x < 0 || e.x > WORLD_W - 60) e.dir = (-e.dir) as 1 | -1;
        e.cooldown -= dt;
        if (e.cooldown <= 0) {
          const dx = h.x + HERO_W / 2 - (e.x + 30);
          const dy = h.y + HERO_H / 2 - (e.y + 30);
          const len = Math.hypot(dx, dy) || 1;
          const speed = (lvl === 2 ? 4 : 3) + difficulty * 0.4;
          fireballsRef.current.push({
            x: e.x + 30, y: e.y + 30,
            vx: (dx / len) * speed, vy: (dy / len) * speed,
            r: 8,
          });
          gameSfx.fire();
          e.cooldown = (lvl === 2 ? 800 : 1200) + Math.random() * 1000;
        }
      }

      // update fireballs
      fireballsRef.current = fireballsRef.current.filter(f => {
        f.x += f.vx; f.y += f.vy;
        return f.x > -20 && f.x < WORLD_W + 20 && f.y > -20 && f.y < WORLD_H + 20;
      });

      // collisions
      invulnRef.current = Math.max(0, invulnRef.current - dt);
      if (invulnRef.current === 0) {
        for (const f of fireballsRef.current) {
          if (f.x > h.x && f.x < h.x + HERO_W && f.y > h.y && f.y < h.y + HERO_H) {
            invulnRef.current = 900;
            gameSfx.hit();
            setHits(prev => {
              const next = prev + 1;
              if (next >= MAX_HITS) {
                setGameOver(true);
                setRunning(false);
                gameSfx.death();
                speakJa("もうダメ…", { pitch: 1.2, rate: 0.95 });
                setSubtitle({ en: "Angel has fallen…", jp: "天使は堕ちた…" });
              }
              return next;
            });
            break;
          }
        }
      }

      // render
      ctx.clearRect(0, 0, WORLD_W, WORLD_H);
      // sky gradient — shift on level 2
      const grad = ctx.createLinearGradient(0, 0, 0, WORLD_H);
      if (lvl === 2) {
        grad.addColorStop(0, "oklch(0.22 0.12 30)");
        grad.addColorStop(1, "oklch(0.1 0.06 350)");
      } else {
        grad.addColorStop(0, "oklch(0.18 0.08 280)");
        grad.addColorStop(1, "oklch(0.08 0.05 240)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      // ground
      ctx.fillStyle = lvl === 2 ? "oklch(0.25 0.08 20)" : "oklch(0.25 0.06 260)";
      ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);
      ctx.strokeStyle = lvl === 2 ? "oklch(0.75 0.22 30)" : "oklch(0.7 0.2 200)";
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(WORLD_W, GROUND_Y); ctx.stroke();

      // pet follows hero
      const petX = h.x - h.facing * 50;
      ctx.save();
      ctx.globalAlpha = 0.95;
      if (petImg.complete) ctx.drawImage(petImg, petX, GROUND_Y - 44, 44, 44);
      ctx.restore();

      // enemies
      for (const e of enemiesRef.current) {
        const img = e.img === enemy1 ? e1Img : e2Img;
        if (img.complete) ctx.drawImage(img, e.x, e.y, 60, 70);
      }

      // hero (flicker on invuln)
      if (invulnRef.current === 0 || Math.floor(now / 80) % 2 === 0) {
        if (heroImg.complete) {
          ctx.save();
          if (h.facing === -1) {
            ctx.translate(h.x + HERO_W, h.y);
            ctx.scale(-1, 1);
            ctx.drawImage(heroImg, 0, 0, HERO_W, HERO_H);
          } else {
            ctx.drawImage(heroImg, h.x, h.y, HERO_W, HERO_H);
          }
          ctx.restore();
        }
      }

      // fireballs
      for (const f of fireballsRef.current) {
        const g = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, f.r * 2);
        g.addColorStop(0, "oklch(0.95 0.2 60)");
        g.addColorStop(0.5, "oklch(0.7 0.25 30)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2, 0, Math.PI * 2); ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, gameOver]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10">
      <div className="panel scanlines relative overflow-hidden p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl neon-text">Angel's Fate</h3>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground" lang="ja">
              天使の運命 — Survive the bone-beasts
            </p>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <div>
              <span className="text-muted-foreground">LV </span>
              <span className="text-primary">{level}</span>
            </div>
            <div>
              <span className="text-muted-foreground">TIME </span>
              <span className="text-primary">{time.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">HP</span>
              {Array.from({ length: MAX_HITS }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-3 w-3 rounded-sm border ${
                    i < MAX_HITS - hits
                      ? "border-primary bg-primary/70"
                      : "border-border bg-muted/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={start}
              className="rounded-md border border-primary/50 bg-primary/10 px-3 py-1 font-display text-xs uppercase tracking-widest text-primary transition hover:bg-primary/20"
            >
              {running ? "Restart" : gameOver ? "Reset" : "Start"}
            </button>
          </div>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: WORLD_W }}>
          <canvas
            ref={canvasRef}
            width={WORLD_W}
            height={WORLD_H}
            className="block w-full rounded-lg border border-primary/30"
            style={{ imageRendering: "pixelated", aspectRatio: `${WORLD_W} / ${WORLD_H}` }}
          />
          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/70 backdrop-blur-sm">
              <div className="font-display text-3xl neon-text">
                {gameOver ? "GAME OVER" : "ANGEL'S FATE"}
              </div>
              <div className="font-display text-sm text-primary" lang="ja">
                {gameOver ? "ゲームオーバー" : "天使の運命"}
              </div>
              <button
                onClick={start}
                className="rounded-md border border-primary/60 bg-primary/15 px-5 py-2 font-display text-sm uppercase tracking-widest text-primary hover:bg-primary/25"
              >
                {gameOver ? "Play Again" : "Start"}
              </button>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">
                ← → / A D move &nbsp;·&nbsp; Space / ↑ jump
              </p>
            </div>
          )}

          {showLevelUp && running && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-primary/10 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
              <div className="font-display text-5xl neon-text drop-shadow-lg" lang="ja">やったよ！</div>
              <div className="font-display text-xl text-primary">LEVEL 2 — I did it!</div>
            </div>
          )}
        </div>

        {/* Subtitles */}
        <div className="mt-3 rounded-md border border-border bg-card/40 px-3 py-2 text-center">
          <div className="text-sm text-foreground">{subtitle.en}</div>
          <div className="text-xs text-primary" lang="ja">{subtitle.jp}</div>
        </div>
      </div>
    </section>
  );
}

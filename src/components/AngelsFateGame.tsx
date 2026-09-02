import { useEffect, useRef, useState, useCallback } from "react";
import hero from "@/assets/game-hero.webp";
import pet from "@/assets/game-pet.webp";
import enemy1 from "@/assets/game-enemy1.webp";
import enemy2 from "@/assets/game-enemy2.webp";
import boss from "@/assets/game-boss.png";
import { supabase } from "@/integrations/supabase/client";
import { speakAngel } from "@/lib/angelVoice";

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
const BOSS_AT = 90; // seconds — 1:30
const WATER_CD = 10000; // ms
const SHIELD_CD = 15000; // ms
const SHIELD_TIME = 2500; // ms active

type Fireball = { x: number; y: number; vx: number; vy: number; r: number; boss?: boolean };
type Enemy = { x: number; y: number; img: string; dir: 1 | -1; cooldown: number };
type Boss = { x: number; y: number; dir: 1 | -1; hp: number; maxHp: number; cooldown: number; hurt: number };
type Beam = { life: number; x: number; y: number };
type Pop = { x: number; y: number; life: number; text: string; color: string };

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
  water: () => { [900, 700, 520, 380].forEach((f, i) => setTimeout(() => blip(f, 0.12, "sine", 0.09), i * 45)); },
  shield: () => { blip(300, 0.12, "triangle", 0.09); setTimeout(() => blip(600, 0.16, "triangle", 0.07), 90); },
  death: () => { blip(330, 0.15, "sawtooth"); setTimeout(() => blip(160, 0.25, "sawtooth"), 120); setTimeout(() => blip(90, 0.4, "sawtooth"), 280); },
  levelUp: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.15, "triangle", 0.09), i * 90)); },
  bossRoar: () => { blip(70, 0.6, "sawtooth", 0.14); setTimeout(() => blip(52, 0.9, "sawtooth", 0.12), 200); },
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
  const [victory, setVictory] = useState(false);
  const [hits, setHits] = useState(0);
  const [time, setTime] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [waterCd, setWaterCd] = useState(0);
  const [shieldCd, setShieldCd] = useState(0);
  const [bossHp, setBossHp] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  const [subtitle, setSubtitle] = useState<{ en: string; jp: string } | null>({
    en: "Press START to begin.",
    jp: "スタートを押してください。",
  });

  // Optional player registration
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const heroRef = useRef({ x: 80, y: GROUND_Y - HERO_H, vy: 0, onGround: true, facing: 1 as 1 | -1 });
  const enemiesRef = useRef<Enemy[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const fireballsRef = useRef<Fireball[]>([]);
  const beamsRef = useRef<Beam[]>([]);
  const popsRef = useRef<Pop[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const invulnRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const leveledUpRef = useRef<boolean>(false);
  const bossSpawnedRef = useRef<boolean>(false);
  const lastJumpSpeakRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const waterCdRef = useRef<number>(0);
  const shieldCdRef = useRef<number>(0);
  const shieldActiveRef = useRef<number>(0);
  const registeredRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const subtitles: { en: string; jp: string }[] = [
    { en: "Don't let the fire touch your wings.", jp: "炎に翼を触れさせないで。" },
    { en: "Press F — the water sphere clears the line.", jp: "Fキー — 水の球が一直線を薙ぎ払う。" },
    { en: "Your spirit fox shields you every 15 seconds.", jp: "霊狐が15秒ごとに守ってくれる。" },
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

  const addScore = (n: number) => {
    scoreRef.current += n;
    setScore(scoreRef.current);
  };

  const reset = useCallback(() => {
    heroRef.current = { x: 80, y: GROUND_Y - HERO_H, vy: 0, onGround: true, facing: 1 };
    enemiesRef.current = [];
    bossRef.current = null;
    fireballsRef.current = [];
    beamsRef.current = [];
    popsRef.current = [];
    spawnTimerRef.current = 0;
    invulnRef.current = 0;
    levelRef.current = 1;
    leveledUpRef.current = false;
    bossSpawnedRef.current = false;
    waterCdRef.current = 0;
    shieldCdRef.current = 0;
    shieldActiveRef.current = 0;
    scoreRef.current = registeredRef.current ? 1000 : 0; // bonus for registered players
    setScore(scoreRef.current);
    setBossHp(null);
    setLevel(1);
    setShowLevelUp(false);
    setShowBoss(false);
    setHits(registeredRef.current ? -1 : 0); // bonus extra life (negative = extra hit allowed)
    setTime(0);
    setGameOver(false);
    setVictory(false);
    startTimeRef.current = performance.now();
    setSubtitle({ en: "Angel's Fate begins…", jp: "天使の運命、始まる…" });
  }, []);

  const start = useCallback(() => {
    ac(); // unlock audio on user gesture
    reset();
    setRunning(true);
  }, [reset]);

  const submitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerEmail.trim()) return;
    setSaving(true);
    setFormMsg(null);
    const { error } = await supabase.from("game_players").insert({
      player_name: playerName.trim().slice(0, 100),
      email: playerEmail.trim().slice(0, 255),
      score: scoreRef.current,
    });
    setSaving(false);
    if (error) {
      setFormMsg("Could not save — you can still play. / 保存できませんでした。");
      return;
    }
    registeredRef.current = true;
    setRegistered(true);
    setFormMsg("Bonus unlocked! +1000 pts & +1 life. / ボーナス獲得！");
    gameSfx.levelUp();
  };

  // Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if ([" ", "arrowup", "arrowleft", "arrowright", "a", "d", "w", "f", "e"].includes(k)) {
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
    const bossImg = new Image(); bossImg.src = boss;

    const endGame = async (won: boolean) => {
      setGameOver(true);
      setRunning(false);
      if (won) {
        setVictory(true);
        gameSfx.levelUp();
        await speakAngel("bigCheer", setSubtitle);
        await speakAngel("victory", setSubtitle);
        if (registeredRef.current) {
          await speakAngel("love", setSubtitle);
        }
      } else {
        gameSfx.death();
        speakJa("もうダメ…", { pitch: 1.2, rate: 0.95 });
        setSubtitle({ en: "Angel has fallen…", jp: "天使は堕ちた…" });
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(32, now - (lastTickRef.current || now));
      lastTickRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      setTime(elapsed);
      addScore(dt * 0.01);

      // cooldowns
      waterCdRef.current = Math.max(0, waterCdRef.current - dt);
      shieldCdRef.current = Math.max(0, shieldCdRef.current - dt);
      shieldActiveRef.current = Math.max(0, shieldActiveRef.current - dt);
      setWaterCd(waterCdRef.current);
      setShieldCd(shieldCdRef.current);

      // Level up at 60s
      if (!leveledUpRef.current && elapsed >= LEVEL_UP_AT) {
        leveledUpRef.current = true;
        levelRef.current = 2;
        setLevel(2);
        setShowLevelUp(true);
        gameSfx.levelUp();
        speakAngel("cheer", setSubtitle);
        setTimeout(() => setShowLevelUp(false), 2600);
      }

      // Boss at 1:30
      if (!bossSpawnedRef.current && elapsed >= BOSS_AT) {
        bossSpawnedRef.current = true;
        bossRef.current = { x: WORLD_W - 190, y: GROUND_Y - 130, dir: -1, hp: 12, maxHp: 12, cooldown: 900, hurt: 0 };
        setBossHp(12);
        setShowBoss(true);
        gameSfx.bossRoar();
        speakJa("ボスが来た！", { pitch: 1.3 });
        setSubtitle({ en: "BOSS — Kikai-Hone awakens!", jp: "ボス — 機械骨、目覚める！" });
        setTimeout(() => setShowBoss(false), 2800);
      }

      const lvl = levelRef.current;
      const h = heroRef.current;
      const k = keysRef.current;
      const b = bossRef.current;

      // movement
      if (k["arrowleft"] || k["a"]) { h.x -= MOVE_SPEED; h.facing = -1; }
      if (k["arrowright"] || k["d"]) { h.x += MOVE_SPEED; h.facing = 1; }
      if ((k[" "] || k["arrowup"] || k["w"]) && h.onGround) {
        h.vy = JUMP_V; h.onGround = false;
        gameSfx.jump();
        if (now - lastJumpSpeakRef.current > 1200) {
          lastJumpSpeakRef.current = now;
          speakJa(JUMP_PHRASES[Math.floor(Math.random() * JUMP_PHRASES.length)]);
        }
      }

      // Water sphere — clears everything on the same horizontal or vertical line
      if (k["f"] && waterCdRef.current === 0) {
        waterCdRef.current = WATER_CD;
        gameSfx.water();
        speakJa("水の力！", { pitch: 1.5 });
        const cx = h.x + HERO_W / 2;
        const cy = h.y + HERO_H / 2;
        beamsRef.current.push({ life: 500, x: cx, y: cy });
        let killed = 0;
        enemiesRef.current = enemiesRef.current.filter(e => {
          const ecx = e.x + 30, ecy = e.y + 35;
          const inLine = Math.abs(ecy - cy) < 70 || Math.abs(ecx - cx) < 70;
          if (inLine) {
            killed++;
            popsRef.current.push({ x: ecx, y: ecy, life: 900, text: "+200", color: "oklch(0.85 0.18 220)" });
          }
          return !inLine;
        });
        // clear fireballs on the same lines too
        fireballsRef.current = fireballsRef.current.filter(f => !(Math.abs(f.y - cy) < 70 || Math.abs(f.x - cx) < 70));
        if (killed > 0) addScore(200 * killed + (killed > 1 ? 300 : 0));
        if (killed > 1) speakAngel("tease", setSubtitle);
        if (b) {
          const bcx = b.x + 90, bcy = b.y + 65;
          if (Math.abs(bcy - cy) < 90 || Math.abs(bcx - cx) < 90) {
            b.hp -= 1; b.hurt = 260;
            setBossHp(b.hp);
            popsRef.current.push({ x: bcx, y: bcy, life: 800, text: "-1", color: "oklch(0.85 0.2 200)" });
            if (b.hp > 0 && Math.random() < 0.4) speakAngel("tease", setSubtitle);
            if (b.hp <= 0) {
              bossRef.current = null;
              setBossHp(0);
              addScore(3000);
              endGame(true);
              return;
            }
          }
        }
      }

      // Manual pet shield (also auto-triggers on impact)
      if (k["e"] && shieldCdRef.current === 0) {
        shieldCdRef.current = SHIELD_CD;
        shieldActiveRef.current = SHIELD_TIME;
        gameSfx.shield();
      }

      h.vy += GRAVITY;
      h.y += h.vy;
      if (h.y + HERO_H >= GROUND_Y) { h.y = GROUND_Y - HERO_H; h.vy = 0; h.onGround = true; }
      h.x = Math.max(0, Math.min(WORLD_W - HERO_W, h.x));

      // spawn enemies
      spawnTimerRef.current -= dt;
      const baseDiff = Math.min(3, 1 + elapsed / 25);
      const difficulty = lvl === 2 ? baseDiff + 1.2 : baseDiff;
      const maxEnemies = Math.floor((lvl === 2 ? 2 : 1) + difficulty) - (b ? 2 : 0);
      if (spawnTimerRef.current <= 0 && enemiesRef.current.length < maxEnemies) {
        const fromRight = Math.random() > 0.5;
        enemiesRef.current.push({
          x: fromRight ? WORLD_W - 70 : 10,
          y: GROUND_Y - 70 - (Math.random() > 0.6 ? 60 : 0),
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
          fireballsRef.current.push({ x: e.x + 30, y: e.y + 30, vx: (dx / len) * speed, vy: (dy / len) * speed, r: 8 });
          gameSfx.fire();
          e.cooldown = (lvl === 2 ? 800 : 1200) + Math.random() * 1000;
        }
      }

      // boss behaviour
      if (b) {
        b.hurt = Math.max(0, b.hurt - dt);
        const target = h.x + HERO_W / 2;
        b.x += Math.sign(target - (b.x + 90)) * 0.9;
        b.x = Math.max(0, Math.min(WORLD_W - 180, b.x));
        b.cooldown -= dt;
        if (b.cooldown <= 0) {
          const bx = b.x + 30, by = b.y + 70;
          for (const spread of [-0.35, 0, 0.35]) {
            const dx = h.x + HERO_W / 2 - bx;
            const dy = h.y + HERO_H / 2 - by;
            const ang = Math.atan2(dy, dx) + spread;
            fireballsRef.current.push({ x: bx, y: by, vx: Math.cos(ang) * 4.6, vy: Math.sin(ang) * 4.6, r: 11, boss: true });
          }
          gameSfx.fire();
          b.cooldown = 1500 + Math.random() * 700;
        }
      }

      // update fireballs
      fireballsRef.current = fireballsRef.current.filter(f => {
        f.x += f.vx; f.y += f.vy;
        return f.x > -20 && f.x < WORLD_W + 20 && f.y > -20 && f.y < WORLD_H + 20;
      });

      // beams / pops decay
      beamsRef.current = beamsRef.current.filter(bm => (bm.life -= dt) > 0);
      popsRef.current = popsRef.current.filter(p => { p.life -= dt; p.y -= dt * 0.02; return p.life > 0; });

      // collisions
      invulnRef.current = Math.max(0, invulnRef.current - dt);
      if (invulnRef.current === 0) {
        for (const f of fireballsRef.current) {
          if (f.x > h.x - 6 && f.x < h.x + HERO_W + 6 && f.y > h.y - 6 && f.y < h.y + HERO_H + 6) {
            // Pet shield absorbs the hit
            if (shieldActiveRef.current > 0 || shieldCdRef.current === 0) {
              if (shieldActiveRef.current === 0) {
                shieldCdRef.current = SHIELD_CD;
                shieldActiveRef.current = SHIELD_TIME;
              }
              gameSfx.shield();
              addScore(75);
              popsRef.current.push({ x: h.x + HERO_W / 2, y: h.y, life: 700, text: "GUARD!", color: "oklch(0.88 0.16 200)" });
              fireballsRef.current = fireballsRef.current.filter(x => x !== f);
              break;
            }
            invulnRef.current = 900;
            gameSfx.hit();
            setHits(prev => {
              const next = prev + 1;
              if (next >= MAX_HITS) endGame(false);
              return next;
            });
            break;
          }
        }
      }

      // ---------- render ----------
      ctx.clearRect(0, 0, WORLD_W, WORLD_H);
      const grad = ctx.createLinearGradient(0, 0, 0, WORLD_H);
      if (b) {
        grad.addColorStop(0, "oklch(0.16 0.1 20)");
        grad.addColorStop(1, "oklch(0.06 0.04 300)");
      } else if (lvl === 2) {
        grad.addColorStop(0, "oklch(0.22 0.12 30)");
        grad.addColorStop(1, "oklch(0.1 0.06 350)");
      } else {
        grad.addColorStop(0, "oklch(0.18 0.08 280)");
        grad.addColorStop(1, "oklch(0.08 0.05 240)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      ctx.fillStyle = b ? "oklch(0.2 0.07 10)" : lvl === 2 ? "oklch(0.25 0.08 20)" : "oklch(0.25 0.06 260)";
      ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);
      ctx.strokeStyle = b ? "oklch(0.7 0.24 25)" : lvl === 2 ? "oklch(0.75 0.22 30)" : "oklch(0.7 0.2 200)";
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(WORLD_W, GROUND_Y); ctx.stroke();

      // water beams (cross)
      for (const bm of beamsRef.current) {
        const a = bm.life / 500;
        ctx.save();
        ctx.globalAlpha = a * 0.85;
        ctx.fillStyle = "oklch(0.8 0.16 220)";
        const thick = 26 * a + 6;
        ctx.fillRect(0, bm.y - thick / 2, WORLD_W, thick);
        ctx.fillRect(bm.x - thick / 2, 0, thick, WORLD_H);
        ctx.globalAlpha = a;
        ctx.strokeStyle = "oklch(0.95 0.12 200)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, bm.y - thick / 2, WORLD_W, thick);
        ctx.restore();
      }

      // pet follows hero (glows while shielding)
      const petX = h.x - h.facing * 50;
      ctx.save();
      ctx.globalAlpha = 0.95;
      if (shieldActiveRef.current > 0) {
        ctx.shadowColor = "oklch(0.85 0.18 210)";
        ctx.shadowBlur = 22;
      }
      if (petImg.complete) ctx.drawImage(petImg, petX, GROUND_Y - 44, 44, 44);
      ctx.restore();

      // enemies
      for (const e of enemiesRef.current) {
        const img = e.img === enemy1 ? e1Img : e2Img;
        if (img.complete) ctx.drawImage(img, e.x, e.y, 60, 70);
      }

      // boss
      if (b && bossImg.complete) {
        ctx.save();
        if (b.hurt > 0) ctx.globalAlpha = 0.55;
        ctx.shadowColor = "oklch(0.7 0.25 25)";
        ctx.shadowBlur = 24;
        ctx.drawImage(bossImg, b.x, b.y, 180, 140);
        ctx.restore();
      }

      // hero (flicker on invuln) + shield bubble
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
      if (shieldActiveRef.current > 0) {
        ctx.save();
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(now / 90);
        ctx.strokeStyle = "oklch(0.9 0.16 205)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(h.x + HERO_W / 2, h.y + HERO_H / 2, 58, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // fireballs
      for (const f of fireballsRef.current) {
        const g = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, f.r * 2);
        g.addColorStop(0, f.boss ? "oklch(0.95 0.2 20)" : "oklch(0.95 0.2 60)");
        g.addColorStop(0.5, "oklch(0.7 0.25 30)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2, 0, Math.PI * 2); ctx.fill();
      }

      // score pops
      ctx.font = "bold 14px ui-monospace, monospace";
      ctx.textAlign = "center";
      for (const p of popsRef.current) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life / 400);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }
      ctx.textAlign = "left";

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, gameOver]);

  const livesLeft = MAX_HITS - Math.max(0, hits);

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
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
            <div>
              <span className="text-muted-foreground">SCORE </span>
              <span className="text-primary">{Math.floor(score).toLocaleString()}</span>
            </div>
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
                    i < livesLeft ? "border-primary bg-primary/70" : "border-border bg-muted/30"
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

        {/* Ability meters */}
        <div className="mb-3 grid gap-2 sm:grid-cols-2" style={{ maxWidth: WORLD_W, marginInline: "auto" }}>
          <div className="rounded-md border border-border bg-card/40 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest">
              <span className="text-foreground">F · Water Sphere <span lang="ja" className="text-primary">水球</span></span>
              <span className={waterCd === 0 ? "text-primary" : "text-muted-foreground"}>
                {waterCd === 0 ? "READY" : `${(waterCd / 1000).toFixed(1)}s`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted/30">
              <div className="h-full bg-sky-400 transition-[width]" style={{ width: `${100 - (waterCd / WATER_CD) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-md border border-border bg-card/40 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest">
              <span className="text-foreground">E · Pet Shield <span lang="ja" className="text-primary">霊狐の盾</span></span>
              <span className={shieldCd === 0 ? "text-primary" : "text-muted-foreground"}>
                {shieldCd === 0 ? "READY" : `${(shieldCd / 1000).toFixed(1)}s`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted/30">
              <div className="h-full bg-emerald-400 transition-[width]" style={{ width: `${100 - (shieldCd / SHIELD_CD) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: WORLD_W }}>
          {bossHp !== null && bossHp > 0 && (
            <div className="mb-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-destructive">
                <span>BOSS · 機械骨 KIKAI-HONE</span>
                <span>{bossHp}/12</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded bg-muted/30">
                <div className="h-full bg-destructive transition-[width]" style={{ width: `${(bossHp / 12) * 100}%` }} />
              </div>
            </div>
          )}
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
                {victory ? "VICTORY" : gameOver ? "GAME OVER" : "ANGEL'S FATE"}
              </div>
              <div className="font-display text-sm text-primary" lang="ja">
                {victory ? "勝利！" : gameOver ? "ゲームオーバー" : "天使の運命"}
              </div>
              {gameOver && (
                <div className="font-mono text-xs text-foreground">
                  SCORE {Math.floor(score).toLocaleString()}
                </div>
              )}
              <button
                onClick={start}
                className="rounded-md border border-primary/60 bg-primary/15 px-5 py-2 font-display text-sm uppercase tracking-widest text-primary hover:bg-primary/25"
              >
                {gameOver ? "Play Again" : "Start"}
              </button>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">
                ← → / A D move &nbsp;·&nbsp; Space / ↑ jump &nbsp;·&nbsp; F water sphere &nbsp;·&nbsp; E pet shield
              </p>
            </div>
          )}

          {showLevelUp && running && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-primary/10 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
              <div className="font-display text-5xl neon-text drop-shadow-lg" lang="ja">やったよ！</div>
              <div className="font-display text-xl text-primary">LEVEL 2 — I did it!</div>
            </div>
          )}

          {showBoss && running && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-destructive/15 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
              <div className="font-display text-5xl text-destructive drop-shadow-lg" lang="ja">機械骨</div>
              <div className="font-display text-xl text-destructive">BOSS APPROACHING</div>
            </div>
          )}
        </div>

        {/* Subtitles */}
        <div className="mt-3 rounded-md border border-border bg-card/40 px-3 py-2 text-center">
          <div className="text-sm text-foreground">{subtitle.en}</div>
          <div className="text-xs text-primary" lang="ja">{subtitle.jp}</div>
        </div>

        {/* Optional player registration */}
        <div className="mx-auto mt-4 rounded-lg border border-primary/30 bg-card/50 p-4" style={{ maxWidth: WORLD_W }}>
          <p className="text-center text-sm text-primary" lang="ja">
            名前とメールを入力してデータを保存してください。ありがとう！
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Enter your name and email to save your data.
            <span className="block">This is just optional — you can play without it.</span>
          </p>

          {registered ? (
            <p className="mt-3 text-center font-display text-sm uppercase tracking-widest text-primary">
              Bonus active · ボーナス発動中 — +1000 pts &amp; +1 life
            </p>
          ) : (
            <form onSubmit={submitPlayer} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={100}
                placeholder="Your name / お名前"
                className="flex-1 rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                value={playerEmail}
                onChange={(e) => setPlayerEmail(e.target.value)}
                maxLength={255}
                placeholder="Email / メール"
                className="flex-1 rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={saving}
                className="keycap-btn relative rounded-md border-b-4 border-primary/70 bg-primary/15 px-5 py-2 font-display text-xs uppercase tracking-widest text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25 active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
              >
                {saving ? "…" : "Play + Bonus"}
                <span className="pointer-events-none ml-1.5 inline-flex items-center rounded border border-primary/40 bg-background/60 px-1 py-0.5 font-mono text-[9px] leading-none text-primary">↵ Enter</span>
              </button>
            </form>
          )}
          {formMsg && <p className="mt-2 text-center text-xs text-primary">{formMsg}</p>}
        </div>
      </div>
    </section>
  );
}

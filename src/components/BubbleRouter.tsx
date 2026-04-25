import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, useState, Suspense, useCallback, useMemo, MouseEvent as ReactMouseEvent, useEffect } from "react";
import * as THREE from "three";
import { useNavigate } from "@tanstack/react-router";
import { sfx } from "@/lib/sfx";
import { RotateCcw, Sparkles } from "lucide-react";
import { useMusic, type Mood } from "@/lib/musicStore";

interface Hub {
  id: string;
  label: string;
  to: string;
  angle: number;
  color: string;
}

const HUBS: Hub[] = [
  { id: "3d",     label: "3D Mesh",      to: "/hub/3d-mesh",        angle: 0,                       color: "#ff5d8f" },
  { id: "2dc",    label: "2D Concept",   to: "/hub/2d-conceptual",  angle: Math.PI / 4,             color: "#ffb84d" },
  { id: "2dCr",   label: "2D Creatures", to: "/hub/2d-creatures",   angle: Math.PI / 2,             color: "#ffe14d" },
  { id: "comic",  label: "Comics",       to: "/hub/comics",         angle: (3 * Math.PI) / 4,       color: "#7cff6b" },
  { id: "tool",   label: "Toolbox",      to: "/hub/toolbox",        angle: Math.PI,                 color: "#4dd6ff" },
  { id: "mini",   label: "Minitoires",   to: "/hub/minitoires",     angle: (5 * Math.PI) / 4,       color: "#7c8bff" },
  { id: "script", label: "Scriptable",   to: "/hub/scriptable",     angle: (3 * Math.PI) / 2,       color: "#c97cff" },
  { id: "rig",    label: "Rigging",      to: "/hub/rigging",        angle: (7 * Math.PI) / 4,       color: "#ff7cf0" },
];

const RING_R = 36; // % radius for satellites
const AUTO_SPEED = 0.18; // rad/s clockwise

/* =================== 3D scene =================== */

function CenterBubble() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.25; });
  return (
    <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.2}>
      <Sphere args={[1.4, 64, 64]} ref={ref}>
        <MeshTransmissionMaterial
          color="#ffffff"
          thickness={0.8}
          roughness={0.02}
          transmission={1}
          ior={1.45}
          chromaticAberration={0.15}
          backside
        />
      </Sphere>
    </Float>
  );
}

/* ---------- Mood backgrounds (upgraded) ---------- */

// Wavy energy wings: animated tube curves
function WingsWavesBg() {
  const grp = useRef<THREE.Group>(null);
  const lines = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  useFrame(({ clock }) => {
    if (!grp.current) return;
    const t = clock.getElapsedTime();
    grp.current.rotation.z = Math.sin(t * 0.2) * 0.2;
    grp.current.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      m.rotation.x = Math.sin(t * 0.3 + i) * 0.4;
      m.rotation.y = t * (0.05 + i * 0.01);
    });
  });
  return (
    <group ref={grp}>
      {lines.map((i) => {
        const r = 4 + i * 0.4;
        return (
          <mesh key={i} position={[0, 0, -3 - i * 0.3]}>
            <torusGeometry args={[r, 0.015, 8, 128]} />
            <meshBasicMaterial color={`hsl(${(i * 30) % 360}, 80%, 70%)`} transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function CloudsBg() {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 1200;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = -3 - Math.random() * 10;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.03; });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#cfe6ff" size={0.4} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function PlanetsBg() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.05; });
  return (
    <group ref={ref}>
      <Stars radius={50} depth={40} count={3500} factor={4} fade speed={1.5} />
      <mesh position={[-7, 2, -8]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ff8a6e" emissive="#552210" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[8, -3, -10]}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial color="#6e9bff" emissive="#101a55" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[5, 5, -12]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffd86e" emissive="#553a10" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function RainBg() {
  const ref = useRef<THREE.Points>(null);
  const N = 2000;
  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = Math.random() * 18 - 9;
      arr[i * 3 + 2] = -2 - Math.random() * 8;
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < N; i++) {
      pos[i * 3 + 1] -= dt * (4 + (i % 6));
      if (pos[i * 3 + 1] < -9) pos[i * 3 + 1] = 9;
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={N} />
      </bufferGeometry>
      <pointsMaterial color="#9ec8ff" size={0.07} transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

function NatureBg() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4 + t) * 0.5 + Math.cos(y * 0.4 + t * 0.8) * 0.5);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[28, 16, 50, 30]} />
      <meshStandardMaterial color="#3aa37a" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

// Default: spatial 3D wings
function SpatialWingsBg() {
  return (
    <>
      <Stars radius={40} depth={30} count={1500} factor={3} fade speed={0.6} />
      <WingsWavesBg />
    </>
  );
}

function MoodBackground({ mood }: { mood: Mood }) {
  if (mood === "clouds") return <CloudsBg />;
  if (mood === "planets") return <PlanetsBg />;
  if (mood === "rain") return <RainBg />;
  if (mood === "nature") return <NatureBg />;
  return <SpatialWingsBg />;
}

function Scene({ mood }: { mood: Mood }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#aad4ff" />
      <MoodBackground mood={mood} />
      <CenterBubble />
    </>
  );
}

/* =================== 2D overlay (satellites are 2D for drag UX) =================== */

interface Ripple { id: number; x: number; y: number; hue: number; }

interface SatState {
  hub: Hub;
  angle: number;       // current orbital angle (rad)
  radius: number;      // current orbital radius (% of container)
  vAngle: number;      // angular velocity (rad/s)
  vRadius: number;     // radial velocity (%/s) - decays back to RING_R
  // drag state
  dragging: boolean;
  // free-fly when released far from ring
  freeX?: number; freeY?: number; freeVX?: number; freeVY?: number;
  reentering: boolean;
}

export function BubbleRouter() {
  const navigate = useNavigate();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [points, setPoints] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const mood = useMusic((s) => s.mood);

  const satsRef = useRef<SatState[]>(
    HUBS.map((h) => ({
      hub: h,
      angle: h.angle,
      radius: RING_R,
      vAngle: -AUTO_SPEED,
      vRadius: 0,
      dragging: false,
      reentering: false,
    }))
  );
  const [, force] = useState(0);
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    lastX: number; lastY: number;
    lastT: number;
    moved: boolean;
    startX: number; startY: number;
  } | null>(null);

  // animation loop
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - prev) / 1000);
      prev = t;
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = 50, cy = 50;

      satsRef.current.forEach((s) => {
        if (s.dragging) return;

        if (s.freeX !== undefined && s.freeY !== undefined && s.freeVX !== undefined && s.freeVY !== undefined) {
          // free-flight; gravitate gently back toward orbit ring
          const dx = cx - s.freeX;
          const dy = cy - s.freeY;
          const dist = Math.hypot(dx, dy) || 1;
          // attractor toward nearest point on ring
          const targetX = cx - (dx / dist) * RING_R;
          const targetY = cy - (dy / dist) * RING_R;
          const ax = (targetX - s.freeX) * 1.8;
          const ay = (targetY - s.freeY) * 1.8;
          s.freeVX = s.freeVX * 0.96 + ax * dt;
          s.freeVY = s.freeVY * 0.96 + ay * dt;
          s.freeX += s.freeVX * dt;
          s.freeY += s.freeVY * dt;

          // bounce off walls
          if (rect) {
            if (s.freeX < 4) { s.freeX = 4; s.freeVX = Math.abs(s.freeVX) * 0.6; }
            if (s.freeX > 96) { s.freeX = 96; s.freeVX = -Math.abs(s.freeVX) * 0.6; }
            if (s.freeY < 4) { s.freeY = 4; s.freeVY = Math.abs(s.freeVY) * 0.6; }
            if (s.freeY > 96) { s.freeY = 96; s.freeVY = -Math.abs(s.freeVY) * 0.6; }
          }

          // when close to the ring, snap into orbit
          const ringDist = Math.hypot(s.freeX - cx, s.freeY - cy) - RING_R;
          if (Math.abs(ringDist) < 4 && Math.hypot(s.freeVX, s.freeVY) < 30) {
            const ang = Math.atan2(-(s.freeY - cy), s.freeX - cx);
            s.angle = ang;
            s.radius = RING_R;
            s.vAngle = -AUTO_SPEED;
            s.vRadius = 0;
            s.freeX = s.freeY = s.freeVX = s.freeVY = undefined;
          }
        } else {
          // orbital integration
          s.angle += s.vAngle * dt;
          s.radius += s.vRadius * dt;
          // spring radius back to RING_R
          const k = 6;
          const damp = 2.2;
          const ar = -k * (s.radius - RING_R) - damp * s.vRadius;
          s.vRadius += ar * dt;
          // ease angular velocity back to AUTO
          s.vAngle += (-AUTO_SPEED - s.vAngle) * Math.min(1, dt * 1.2);
        }
      });

      force((n) => (n + 1) % 1_000_000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const spawnRipple = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const id = ++rippleId.current;
    const hue = Math.floor(Math.random() * 360);
    setRipples((r) => [...r, { id, x, y, hue }]);
    setPoints((p) => p + 1);
    sfx.coin();
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 2000);
  }, []);

  const onContainerClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hub], [data-control]")) return;
    spawnRipple(e.clientX, e.clientY);
  }, [spawnRipple]);

  const reset = useCallback(() => {
    setRipples([]);
    setPoints(0);
    satsRef.current = HUBS.map((h) => ({
      hub: h, angle: h.angle, radius: RING_R, vAngle: -AUTO_SPEED, vRadius: 0,
      dragging: false, reentering: false,
    }));
    sfx.power();
  }, []);

  // Drag handlers per satellite
  const onSatPointerDown = (id: string) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const s = satsRef.current.find((x) => x.hub.id === id);
    if (!s) return;
    s.dragging = true;
    s.vAngle = 0; s.vRadius = 0;
    s.freeX = s.freeY = s.freeVX = s.freeVY = undefined;
    dragRef.current = {
      id, pointerId: e.pointerId,
      lastX: e.clientX, lastY: e.clientY, lastT: performance.now(),
      moved: false, startX: e.clientX, startY: e.clientY,
    };
    sfx.coin();
  };

  const onSatPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = satsRef.current.find((x) => x.hub.id === drag.id);
    if (!s) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4) drag.moved = true;
    s.freeX = x; s.freeY = y;
    const now = performance.now();
    const dt = Math.max(0.001, (now - drag.lastT) / 1000);
    const vx = ((e.clientX - drag.lastX) / rect.width) * 100 / dt;
    const vy = ((e.clientY - drag.lastY) / rect.height) * 100 / dt;
    s.freeVX = vx; s.freeVY = vy;
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastT = now;
  };

  const onSatPointerUp = (id: string) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const s = satsRef.current.find((x) => x.hub.id === id);
    if (!s) { dragRef.current = null; return; }
    s.dragging = false;

    if (!drag?.moved) {
      // treat as click → navigate
      s.freeX = s.freeY = s.freeVX = s.freeVY = undefined;
      dragRef.current = null;
      const hub = HUBS.find((h) => h.id === id);
      if (hub) {
        sfx.coin();
        navigate({ to: hub.to });
      }
      return;
    }
    // released after drag → keep free-flight, it will gravitate back to orbit
    dragRef.current = null;
  };

  // compute display positions
  const sats = satsRef.current.map((s) => {
    if (s.freeX !== undefined && s.freeY !== undefined) {
      return { hub: s.hub, x: s.freeX, y: s.freeY };
    }
    const x = 50 + Math.cos(s.angle) * s.radius;
    const y = 50 - Math.sin(s.angle) * s.radius;
    return { hub: s.hub, x, y };
  });

  return (
    <div
      ref={containerRef}
      onClick={onContainerClick}
      className="relative h-[640px] w-full cursor-crosshair overflow-hidden rounded-2xl panel scanlines"
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene mood={mood} />
        </Suspense>
      </Canvas>

      {/* Curved link connectors */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="linkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {sats.map((s, i) => {
          const dx = s.x - 50, dy = s.y - 50;
          const mx = 50 + dx * 0.5 + (-dy) * 0.15;
          const my = 50 + dy * 0.5 + dx * 0.15;
          return (
            <path
              key={s.hub.id}
              d={`M 50 50 Q ${mx} ${my} ${s.x} ${s.y}`}
              stroke={s.hub.color}
              strokeOpacity={0.7}
              strokeWidth={0.3}
              fill="none"
              filter="url(#linkGlow)"
            />
          );
        })}
      </svg>

      {/* Ripple bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute block animate-ripple-bubble rounded-full"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: 28, height: 28,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle at 30% 30%, oklch(0.95 0.1 ${r.hue}) 0%, oklch(0.7 0.18 ${r.hue} / 0.5) 45%, transparent 75%)`,
              boxShadow: `0 0 24px oklch(0.85 0.15 ${r.hue} / 0.7), inset 0 0 14px oklch(1 0.05 ${r.hue} / 0.7)`,
            }}
          />
        ))}
      </div>

      {/* Status */}
      <div className="pointer-events-none absolute left-4 top-4 font-display text-[10px] uppercase tracking-[0.3em] text-white/80">
        ◆ Network Online
        <div className="mt-1 text-[9px] text-white/50 normal-case tracking-normal">
          Drag bubbles to throw · click empty space for ripples · {mood !== "off" ? `mood: ${mood}` : "play music to morph the sky"}
        </div>
      </div>

      {/* Controls */}
      <div data-control className="pointer-events-auto absolute right-4 top-4 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-black/40 px-3 py-1.5 font-display text-xs text-white backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="tabular-nums">{points.toString().padStart(4, "0")}</span>
          <span className="text-[9px] uppercase tracking-widest text-white/60">pts</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="flex items-center gap-1.5 rounded-full border border-white/50 bg-white/10 px-3 py-1.5 font-display text-[10px] uppercase tracking-widest text-white transition hover:bg-white/20"
          title="Reset network"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Draggable satellites */}
      <div className="pointer-events-none absolute inset-0">
        {sats.map((s) => (
          <div
            key={s.hub.id}
            data-hub
            onPointerDown={onSatPointerDown(s.hub.id)}
            onPointerMove={onSatPointerMove}
            onPointerUp={onSatPointerUp(s.hub.id)}
            onPointerCancel={onSatPointerUp(s.hub.id)}
            onClick={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            className="pointer-events-auto absolute grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-full text-center font-display text-[10px] uppercase tracking-wider text-white backdrop-blur transition active:cursor-grabbing active:scale-95 select-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              background: `radial-gradient(circle at 30% 30%, ${s.hub.color}cc 0%, ${s.hub.color}66 55%, ${s.hub.color}22 100%)`,
              border: `2px solid ${s.hub.color}`,
              boxShadow: `0 0 24px ${s.hub.color}aa, inset 0 0 14px ${s.hub.color}88`,
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              touchAction: "none",
            }}
          >
            {s.hub.label}
          </div>
        ))}
      </div>

      {/* Center label */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-white/80">Router · Switch</div>
        <div className="font-display text-2xl text-white" style={{ textShadow: "0 0 18px rgba(255,255,255,0.7)" }}>BRIDGE2</div>
        <div className="mt-1 font-display text-[10px] uppercase tracking-[0.3em] text-white/60">[ Hub v2.0 ]</div>
      </div>
    </div>
  );
}

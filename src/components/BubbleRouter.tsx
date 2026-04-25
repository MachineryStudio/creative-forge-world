import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, useState, Suspense, useCallback, useMemo, MouseEvent as ReactMouseEvent } from "react";
import * as THREE from "three";
import { Link } from "@tanstack/react-router";
import { sfx } from "@/lib/sfx";
import { RotateCcw, Sparkles } from "lucide-react";
import { useMusic, type Mood } from "@/lib/musicStore";

interface Hub {
  id: string;
  label: string;
  to: string;
  /** angle on the ring in radians (initial position) */
  angle: number;
}

const WHITE = "#ffffff";

const HUBS: Hub[] = [
  { id: "3d",     label: "3D Mesh",      to: "/hub/3d-mesh",        angle: 0 },
  { id: "2dc",    label: "2D Concept",   to: "/hub/2d-conceptual",  angle: Math.PI / 4 },
  { id: "2dCr",   label: "2D Creatures", to: "/hub/2d-creatures",   angle: Math.PI / 2 },
  { id: "comic",  label: "Comics",       to: "/hub/comics",         angle: (3 * Math.PI) / 4 },
  { id: "tool",   label: "Toolbox",      to: "/hub/toolbox",        angle: Math.PI },
  { id: "mini",   label: "Minitoires",   to: "/hub/minitoires",     angle: (5 * Math.PI) / 4 },
  { id: "script", label: "Scriptable",   to: "/hub/scriptable",     angle: (3 * Math.PI) / 2 },
  { id: "rig",    label: "Rigging",      to: "/hub/rigging",        angle: (7 * Math.PI) / 4 },
];

/* =================== 3D scene =================== */

function CenterBubble() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.25; });
  return (
    <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.2}>
      <Sphere args={[1.4, 64, 64]} ref={ref}>
        <MeshTransmissionMaterial
          color={WHITE}
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

function Satellite({ angle, ringRot }: { angle: number; ringRot: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const r = 3.2;
  useFrame(() => {
    if (!ref.current) return;
    const a = angle + ringRot;
    ref.current.position.x = Math.cos(a) * r;
    ref.current.position.y = Math.sin(a) * r;
  });
  return (
    <Float speed={2} floatIntensity={0.5} rotationIntensity={0.4}>
      <Sphere args={[0.5, 48, 48]} ref={ref}>
        <MeshTransmissionMaterial
          color={WHITE}
          thickness={0.4}
          roughness={0.05}
          transmission={1}
          ior={1.35}
          backside
        />
      </Sphere>
    </Float>
  );
}

function Satellites({ ringRotRef }: { ringRotRef: React.MutableRefObject<number> }) {
  const grp = useRef<THREE.Group>(null);
  const [, force] = useState(0);
  useFrame((_, dt) => {
    ringRotRef.current -= dt * 0.18; // clockwise
    force((n) => (n + 1) % 1000000);
  });
  return (
    <group ref={grp}>
      {HUBS.map((h) => <Satellite key={h.id} angle={h.angle} ringRot={ringRotRef.current} />)}
    </group>
  );
}

/* ---------- Mood backgrounds ---------- */

function CloudsBg() {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 800;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = -3 - Math.random() * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.02; });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#cfe6ff" size={0.35} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function PlanetsBg() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.05; });
  return (
    <group ref={ref}>
      <Stars radius={40} depth={30} count={2500} factor={3} fade speed={1.2} />
      <mesh position={[-7, 2, -8]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ff8a6e" emissive="#552210" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[8, -3, -10]}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial color="#6e9bff" emissive="#101a55" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function RainBg() {
  const ref = useRef<THREE.Points>(null);
  const N = 1500;
  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 16 - 8;
      arr[i * 3 + 2] = -2 - Math.random() * 6;
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < N; i++) {
      pos[i * 3 + 1] -= dt * (3 + (i % 5));
      if (pos[i * 3 + 1] < -8) pos[i * 3 + 1] = 8;
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={N} />
      </bufferGeometry>
      <pointsMaterial color="#9ec8ff" size={0.06} transparent opacity={0.7} depthWrite={false} />
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
      pos.setZ(i, Math.sin(x * 0.4 + t) * 0.4 + Math.cos(y * 0.4 + t * 0.8) * 0.4);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[24, 14, 40, 24]} />
      <meshStandardMaterial color="#3aa37a" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function MoodBackground({ mood }: { mood: Mood }) {
  if (mood === "clouds") return <CloudsBg />;
  if (mood === "planets") return <PlanetsBg />;
  if (mood === "rain") return <RainBg />;
  if (mood === "nature") return <NatureBg />;
  return <Stars radius={30} depth={20} count={800} factor={2} fade speed={0.3} />;
}

function Scene({ mood, ringRotRef }: { mood: Mood; ringRotRef: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={WHITE} />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#aad4ff" />
      <MoodBackground mood={mood} />
      <CenterBubble />
      <Satellites ringRotRef={ringRotRef} />
    </>
  );
}

/* =================== 2D overlay =================== */

interface Ripple { id: number; x: number; y: number; hue: number; }

export function BubbleRouter() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [points, setPoints] = useState(0);
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const ringRotRef = useRef(0);
  const mood = useMusic((s) => s.mood);

  // poll ringRot to re-render the SVG link layer at ~30fps
  useMemo(() => {
    const i = setInterval(() => setTick((t) => (t + 1) % 1000000), 33);
    return () => clearInterval(i);
  }, []);
  void tick;

  const spawnRipple = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hub], [data-control]")) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = ++rippleId.current;
    const hue = Math.floor(Math.random() * 360);
    setRipples((r) => [...r, { id, x, y, hue }]);
    setPoints((p) => p + 1);
    sfx.coin();
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 2000);
  }, []);

  const reset = useCallback(() => {
    setRipples([]);
    setPoints(0);
    ringRotRef.current = 0;
    sfx.power();
  }, []);

  // compute satellite 2D positions for SVG curves (mirror of 3D math)
  const r2D = 36; // % radius
  const sats = HUBS.map((h) => {
    const a = h.angle + ringRotRef.current;
    return {
      ...h,
      x: 50 + Math.cos(a) * r2D,
      y: 50 - Math.sin(a) * r2D, // invert Y for screen
    };
  });

  return (
    <div
      ref={containerRef}
      onClick={spawnRipple}
      className="relative h-[640px] w-full cursor-crosshair overflow-hidden rounded-2xl panel scanlines"
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene mood={mood} ringRotRef={ringRotRef} />
        </Suspense>
      </Canvas>

      {/* Curved link connectors (white, glowing) */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="linkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {sats.map((s, i) => {
          // curved bezier from center to satellite
          const mx = (50 + s.x) / 2 + Math.sin(i + ringRotRef.current) * 4;
          const my = (50 + s.y) / 2 + Math.cos(i + ringRotRef.current) * 4;
          return (
            <path
              key={s.id}
              d={`M 50 50 Q ${mx} ${my} ${s.x} ${s.y}`}
              stroke="white"
              strokeOpacity={0.55}
              strokeWidth={0.25}
              fill="none"
              filter="url(#linkGlow)"
            />
          );
        })}
      </svg>

      {/* Ripple bubbles (3D-ish glass) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute block animate-ripple-bubble rounded-full"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: 28,
              height: 28,
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
          Click empty space for bubbles · {mood !== "off" ? `mood: ${mood}` : "play music to morph the sky"}
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

      {/* Hub link buttons positioned over satellites */}
      <div className="pointer-events-none absolute inset-0">
        {sats.map((s) => (
          <Link
            key={s.id}
            data-hub
            to={s.to}
            onClick={(e) => { e.stopPropagation(); sfx.coin(); }}
            className="pointer-events-auto absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/80 bg-white/10 text-center font-display text-[9px] uppercase tracking-wider text-white backdrop-blur transition hover:scale-110 hover:bg-white/25"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              boxShadow: "0 0 18px rgba(255,255,255,0.55), inset 0 0 10px rgba(255,255,255,0.25)",
            }}
          >
            {s.label}
          </Link>
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

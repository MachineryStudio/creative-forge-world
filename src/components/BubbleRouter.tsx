import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { useRef, useState, Suspense, useCallback, MouseEvent as ReactMouseEvent } from "react";
import * as THREE from "three";
import { Link } from "@tanstack/react-router";
import { sfx } from "@/lib/sfx";
import { Power, RotateCcw, Sparkles } from "lucide-react";

interface Hub {
  id: string;
  label: string;
  to: string;
  color: string;
  /** angle on the ring in radians (initial position) */
  angle: number;
}

const HUBS: Hub[] = [
  { id: "3d", label: "3D Mesh", to: "/hub/3d-mesh", color: "#6ee7ff", angle: 0 },
  { id: "2dc", label: "2D Concept", to: "/hub/2d-conceptual", color: "#ff6ec7", angle: Math.PI / 3 },
  { id: "2dCr", label: "2D Creatures", to: "/hub/2d-creatures", color: "#ffd56e", angle: (2 * Math.PI) / 3 },
  { id: "comic", label: "Comics-Manga", to: "/hub/comics", color: "#b16eff", angle: Math.PI },
  { id: "tool", label: "Toolbox", to: "/hub/toolbox", color: "#6effa0", angle: (4 * Math.PI) / 3 },
  { id: "mini", label: "Minitoires", to: "/hub/minitoires", color: "#ff8a6e", angle: (5 * Math.PI) / 3 },
  { id: "script", label: "Scriptable", to: "/hub/scriptable", color: "#6e9bff", angle: (6 * Math.PI) / 3 + 0.4 },
];

function CenterBubble({ rotating }: { rotating: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current && rotating) ref.current.rotation.y += dt * 0.3;
  });
  return (
    <group>
      <Sphere args={[1.6, 64, 64]} ref={ref}>
        <MeshTransmissionMaterial
          color="#ff3d8a"
          thickness={0.6}
          roughness={0.05}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.1}
          backside
        />
      </Sphere>
      <pointLight position={[0, 0, 2]} intensity={2.4} color="#ff3d8a" />
    </group>
  );
}

function Satellite({ hub, ringRotation, on }: { hub: Hub; ringRotation: number; on: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const r = 3.4;
  useFrame(() => {
    if (!ref.current) return;
    const a = hub.angle - ringRotation;
    ref.current.position.x = Math.cos(a) * r;
    ref.current.position.y = Math.sin(a) * r;
  });
  return (
    <Float speed={2} floatIntensity={0.4} rotationIntensity={0.4}>
      <Sphere args={[0.55, 48, 48]} ref={ref}>
        <MeshTransmissionMaterial
          color={on ? hub.color : "#444"}
          thickness={0.4}
          roughness={0.1}
          transmission={1}
          ior={1.3}
          backside
        />
      </Sphere>
    </Float>
  );
}

function Ring({ on }: { on: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && on) ref.current.rotation.z -= dt * 0.2;
  });
  return (
    <group ref={ref}>
      {HUBS.map((h, i) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(g) => {
              const r = 3.4;
              const verts = new Float32Array([0, 0, 0, Math.cos(h.angle) * r, Math.sin(h.angle) * r, 0]);
              g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
            }}
          />
          <lineBasicMaterial color={h.color} transparent opacity={0.3} />
        </line>
      ))}
    </group>
  );
}

function Scene({ active, ringRot }: { active: Record<string, boolean>; ringRot: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <CenterBubble rotating={Object.values(active).some(Boolean)} />
      <Ring on={Object.values(active).some(Boolean)} />
      {HUBS.map((h) => (
        <Satellite key={h.id} hub={h} ringRotation={ringRot} on={active[h.id]} />
      ))}
    </>
  );
}

interface Ripple {
  id: number;
  x: number; // %
  y: number; // %
  hue: number;
}

const initialActive = () => Object.fromEntries(HUBS.map((h) => [h.id, true])) as Record<string, boolean>;
const initialPositions = (): Record<string, { x: number; y: number } | null> =>
  Object.fromEntries(HUBS.map((h) => [h.id, null]));

export function BubbleRouter() {
  const [active, setActive] = useState<Record<string, boolean>>(initialActive);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number } | null>>(initialPositions);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [points, setPoints] = useState(0);
  const ringRot = 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  const spawnRipple = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    // Only count clicks on the empty area (not on hubs / buttons)
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
    setActive(initialActive());
    setPositions(initialPositions());
    setRipples([]);
    setPoints(0);
    sfx.power();
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={spawnRipple}
      className="relative h-[640px] w-full cursor-crosshair overflow-hidden rounded-2xl panel scanlines"
    >
      {/* 3D canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene active={active} ringRot={ringRot} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Ripple bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute block animate-ripple-bubble rounded-full"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: 24,
              height: 24,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle at 30% 30%, oklch(0.85 0.2 ${r.hue}) 0%, oklch(0.6 0.2 ${r.hue} / 0.6) 40%, transparent 70%)`,
              boxShadow: `0 0 22px oklch(0.7 0.2 ${r.hue} / 0.7), inset 0 0 12px oklch(0.95 0.1 ${r.hue} / 0.6)`,
            }}
          />
        ))}
      </div>

      {/* Top-left status / instructions */}
      <div className="pointer-events-none absolute left-4 top-4 font-display text-[10px] uppercase tracking-[0.3em] text-primary/80">
        ◆ Network Online
        <div className="mt-1 text-[9px] text-muted-foreground normal-case tracking-normal">
          Drag nodes · click empty space for bubbles
        </div>
      </div>

      {/* Top-right controls: Points + Reset */}
      <div data-control className="pointer-events-auto absolute right-4 top-4 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-3 py-1.5 font-display text-xs text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="tabular-nums">{points.toString().padStart(4, "0")}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">pts</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 py-1.5 font-display text-[10px] uppercase tracking-widest text-primary transition hover:bg-primary/20"
          title="Reset network"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* HUD overlay with draggable hub buttons positioned around the ring */}
      <div className="pointer-events-none absolute inset-0">
        {HUBS.map((h, i) => {
          const angle = h.angle;
          const cx = 50 + Math.cos(angle) * 36;
          const cy = 50 - Math.sin(angle) * 36;
          return (
            <DraggableHub
              key={h.id}
              hub={h}
              cx={cx}
              cy={cy}
              pos={positions[h.id]}
              setPos={(p) => setPositions((all) => ({ ...all, [h.id]: p }))}
              active={active[h.id]}
              onToggle={() => {
                sfx.power();
                setActive((a) => ({ ...a, [h.id]: !a[h.id] }));
              }}
              index={i}
            />
          );
        })}
      </div>

      {/* HUD label center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-primary/80">Router · Switch</div>
        <div className="font-display text-2xl neon-text">BRIDGE2</div>
        <div className="mt-1 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ Hub v2.0 ]</div>
      </div>
    </div>
  );
}

function DraggableHub({
  hub, cx, cy, pos, setPos, active, onToggle, index,
}: {
  hub: Hub;
  cx: number;
  cy: number;
  pos: { x: number; y: number } | null;
  setPos: (p: { x: number; y: number } | null) => void;
  active: boolean;
  onToggle: () => void;
  index: number;
}) {
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const moved = useRef(false);

  const x = pos?.x ?? cx;
  const y = pos?.y ?? cy;

  return (
    <div
      data-hub
      className="pointer-events-auto absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => {
        e.stopPropagation();
        moved.current = false;
        dragRef.current = { sx: e.clientX, sy: e.clientY, px: x, py: y };
        const parent = e.currentTarget.parentElement?.parentElement as HTMLElement;
        const rect = parent.getBoundingClientRect();
        const onMove = (ev: globalThis.MouseEvent) => {
          if (!dragRef.current) return;
          const dx = ((ev.clientX - dragRef.current.sx) / rect.width) * 100;
          const dy = ((ev.clientY - dragRef.current.sy) / rect.height) * 100;
          if (Math.abs(dx) + Math.abs(dy) > 0.5) moved.current = true;
          setPos({ x: dragRef.current.px + dx, y: dragRef.current.py + dy });
        };
        const onUp = () => {
          dragRef.current = null;
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }}
    >
      <div className="relative flex flex-col items-center gap-1 select-none">
        <svg className="pointer-events-none absolute" style={{ left: "50%", top: "50%", width: 1, height: 1, overflow: "visible" }}>
          <line
            x1={0}
            y1={0}
            x2={(50 - x) * 6}
            y2={(50 - y) * 6}
            stroke={hub.color}
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        </svg>

        <Link
          to={hub.to}
          onClick={(e) => {
            if (moved.current) { e.preventDefault(); return; }
            sfx.coin();
          }}
          className="grid h-16 w-16 place-items-center rounded-full border-2 text-center font-display text-[10px] uppercase tracking-wider transition hover:scale-110"
          style={{
            borderColor: hub.color,
            background: `radial-gradient(circle at 30% 30%, ${hub.color}40, transparent 70%)`,
            boxShadow: active ? `0 0 18px ${hub.color}80` : "none",
            color: active ? "#fff" : "#888",
            opacity: active ? 1 : 0.5,
          }}
        >
          {hub.label}
        </Link>

        <button
          data-control
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}
          title="Power"
        >
          <Power className="h-3 w-3" />
        </button>
        <span className="text-[9px] text-muted-foreground">#{(index + 1).toString().padStart(2, "0")}</span>
      </div>
    </div>
  );
}

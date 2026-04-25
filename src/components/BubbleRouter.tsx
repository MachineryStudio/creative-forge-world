import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Link } from "@tanstack/react-router";
import { sfx } from "@/lib/sfx";
import { Power } from "lucide-react";

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
          color="#7be0ff"
          thickness={0.6}
          roughness={0.05}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.1}
          backside
        />
      </Sphere>
      <pointLight position={[0, 0, 2]} intensity={2} color="#7be0ff" />
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
    if (ref.current && on) ref.current.rotation.z -= dt * 0.2; // opposite direction
  });
  return (
    <group ref={ref}>
      {/* faint connector lines */}
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

export function BubbleRouter() {
  const [active, setActive] = useState<Record<string, boolean>>(
    () => Object.fromEntries(HUBS.map((h) => [h.id, true]))
  );
  const ringRot = 0; // rotation lives in 3D group; we keep external HUD static

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-2xl panel scanlines">
      {/* 3D canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene active={active} ringRot={ringRot} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* HUD overlay with draggable hub buttons positioned around the ring */}
      <div className="pointer-events-none absolute inset-0">
        {HUBS.map((h, i) => {
          const angle = h.angle;
          const cx = 50 + Math.cos(angle) * 36;
          const cy = 50 - Math.sin(angle) * 36;
          return <DraggableHub key={h.id} hub={h} cx={cx} cy={cy} active={active[h.id]} onToggle={() => {
            sfx.power();
            setActive((a) => ({ ...a, [h.id]: !a[h.id] }));
          }} index={i} />;
        })}
      </div>

      {/* HUD label center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-primary/80">Router · Switch</div>
        <div className="font-display text-2xl neon-text">World Space</div>
      </div>
    </div>
  );
}

function DraggableHub({ hub, cx, cy, active, onToggle, index }: { hub: Hub; cx: number; cy: number; active: boolean; onToggle: () => void; index: number }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const moved = useRef(false);

  const x = pos?.x ?? cx;
  const y = pos?.y ?? cy;

  return (
    <div
      className="pointer-events-auto absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      onMouseDown={(e) => {
        moved.current = false;
        dragRef.current = { sx: e.clientX, sy: e.clientY, px: x, py: y };
        const parent = (e.currentTarget.parentElement?.parentElement as HTMLElement);
        const rect = parent.getBoundingClientRect();
        const onMove = (ev: MouseEvent) => {
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
        {/* connector line back to center via SVG */}
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
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}
          title="Power"
        >
          <Power className="h-3 w-3" />
        </button>
        <span className="text-[9px] text-muted-foreground">#{index + 1}</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Visitor = {
  id: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  emoji: string;
};

const CHARACTERS = ["🐱", "🦊", "🐉", "👾", "🦄", "🐺", "🦋", "🦉", "🐙", "🦅", "🐯", "🦁", "🐧", "🦝", "🐲"];

function pickEmoji() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

// Equirectangular projection: lat/lng → SVG x/y
function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

export function VisitorMap() {
  const [visitors, setVisitors] = useState<Record<string, Visitor>>({});
  const [me, setMe] = useState<Visitor | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    (async () => {
      // 1. Get visitor's geo location
      let geo: { lat: number; lng: number; country: string; city: string };
      try {
        const r = await fetch("https://ipapi.co/json/");
        const d = await r.json();
        geo = {
          lat: Number(d.latitude) || 0,
          lng: Number(d.longitude) || 0,
          country: d.country_name || d.country || "Unknown",
          city: d.city || "",
        };
      } catch {
        geo = { lat: 0, lng: 0, country: "Unknown", city: "" };
      }
      if (cancelled) return;

      const myId = crypto.randomUUID();
      const myVisitor: Visitor = {
        id: myId,
        emoji: pickEmoji(),
        ...geo,
      };
      setMe(myVisitor);

      // 2. Subscribe to presence channel
      channel = supabase.channel("visitor-map", {
        config: { presence: { key: myId } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel!.presenceState<Visitor>();
          const next: Record<string, Visitor> = {};
          Object.values(state).forEach((entries) => {
            entries.forEach((e) => {
              next[e.id] = e;
            });
          });
          setVisitors(next);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel!.track(myVisitor);
          }
        });
    })();

    return () => {
      cancelled = true;
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const W = 360;
  const H = 180;
  const list = Object.values(visitors);
  const countries = Array.from(new Set(list.map((v) => v.country).filter((c) => c && c !== "Unknown")));

  return (
    <div className="panel scanlines relative p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Live Visitors</h3>
        <div className="font-display text-[10px] text-muted-foreground">
          <span className="neon-text">{list.length}</span> online
        </div>
      </div>

      <div className="relative overflow-hidden rounded-md border border-border bg-background/40">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.18 0.05 240) 0%, oklch(0.1 0.04 260) 100%)" }}
        >
          {/* Grid */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={(W / 12) * i}
              y1={0}
              x2={(W / 12) * i}
              y2={H}
              stroke="oklch(0.6 0.15 200 / 0.08)"
              strokeWidth={0.3}
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(H / 6) * i}
              x2={W}
              y2={(H / 6) * i}
              stroke="oklch(0.6 0.15 200 / 0.08)"
              strokeWidth={0.3}
            />
          ))}
          {/* Equator */}
          <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="oklch(0.7 0.18 180 / 0.25)" strokeWidth={0.4} strokeDasharray="2 2" />

          {/* Continents (very simplified outlines) */}
          <g fill="oklch(0.3 0.08 200 / 0.4)" stroke="oklch(0.7 0.15 190 / 0.5)" strokeWidth={0.3}>
            {/* North America */}
            <path d="M30,40 Q50,30 80,38 L95,55 Q90,75 70,80 L50,75 L40,60 Z" />
            {/* South America */}
            <path d="M85,95 Q100,90 105,110 L100,135 Q90,145 82,130 L80,110 Z" />
            {/* Europe */}
            <path d="M165,45 Q185,40 195,50 L190,65 L170,62 Z" />
            {/* Africa */}
            <path d="M170,75 Q195,70 200,90 L195,120 Q180,135 170,120 L165,95 Z" />
            {/* Asia */}
            <path d="M200,40 Q260,35 290,55 L295,80 Q270,90 230,82 L205,65 Z" />
            {/* Australia */}
            <path d="M275,115 Q300,110 305,125 L295,135 L275,130 Z" />
          </g>

          {/* Visitor markers */}
          {list.map((v) => {
            const { x, y } = project(v.lat, v.lng, W, H);
            const isMe = me?.id === v.id;
            return (
              <g key={v.id} transform={`translate(${x}, ${y})`}>
                <circle
                  r={isMe ? 5 : 4}
                  fill={isMe ? "oklch(0.85 0.25 30 / 0.4)" : "oklch(0.85 0.25 180 / 0.3)"}
                >
                  <animate attributeName="r" values={`${isMe ? 5 : 4};${isMe ? 8 : 7};${isMe ? 5 : 4}`} dur="2s" repeatCount="indefinite" />
                </circle>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isMe ? 8 : 7}
                  style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.8))" }}
                >
                  {v.emoji}
                </text>
                <title>{`${v.emoji} ${v.city ? v.city + ", " : ""}${v.country}${isMe ? " (you)" : ""}`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      {countries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {countries.slice(0, 8).map((c) => (
            <span key={c} className="rounded-sm border border-border bg-background/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              {c}
            </span>
          ))}
          {countries.length > 8 && (
            <span className="font-mono text-[9px] text-muted-foreground">+{countries.length - 8}</span>
          )}
        </div>
      )}
    </div>
  );
}

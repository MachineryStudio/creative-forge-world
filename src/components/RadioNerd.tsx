import { useState, useEffect } from "react";
import { Power, Radio, SkipForward } from "lucide-react";
import { sfx } from "@/lib/sfx";
import { useMusic, type Mood } from "@/lib/musicStore";


interface Track {
  id: string;
  title: string;
  artist: string;
  genre: "Game" | "Anime" | "Visual Kei";
  youtubeId: string;
  mood: Mood;
}

const FALLBACK_TRACKS: Track[] = [
  { id: "4", title: "Cruel Angel's Thesis", artist: "Yoko Takahashi", genre: "Anime", youtubeId: "o6wtDPVkKqI", mood: "clouds" },
];

export function RadioNerd() {
  const [on, setOn] = useState(false);
  const [idx, setIdx] = useState(0);
  const [tracks, setTracks] = useState<Track[]>(FALLBACK_TRACKS);
  const setMusic = useMusic((s) => s.setTrack);
  const setMusicOn = useMusic((s) => s.setOn);
  const setMood = useMusic((s) => s.setMood);

  // Load tracks from DB after render; fall back if the cached client chunk is unavailable.
  useEffect(() => {
    let mounted = true;
    let channel: { unsubscribe: () => void } | null = null;

    const load = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from("radio_tracks")
          .select("id, title, youtube_id, mood")
          .order("position", { ascending: true });

        if (!mounted || !data || data.length === 0) return;

        setTracks(
          data.map((r) => ({
            id: r.id,
            title: r.title,
            artist: "RadioNerd",
            genre: "Anime" as const,
            youtubeId: r.youtube_id,
            mood: (r.mood as Mood) ?? "clouds",
          }))
        );

        channel = supabase
          .channel("radio_tracks_changes")
          .on("postgres_changes", { event: "*", schema: "public", table: "radio_tracks" }, load)
          .subscribe();
      } catch {
        // Keep fallback tracks when the preview has a stale dependency chunk.
      }
    };

    load();

    return () => {
      mounted = false;
      channel?.unsubscribe();
    };
  }, []);

  const track = tracks[idx] ?? tracks[0];

  useEffect(() => {
    if (!track) return;
    if (on) setMusic(track.id, track.mood);
    else { setMusicOn(false); setMood("off"); }
  }, [on, track, setMusic, setMusicOn, setMood]);

  return (
    <div className="panel scanlines relative overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className={`h-5 w-5 ${on ? "text-primary animate-pulse-glow" : "text-muted-foreground"}`} />
          <h3 className="font-display text-sm uppercase tracking-[0.3em] neon-text">RadioNerd · 24h</h3>
        </div>
        <button
          onClick={() => { sfx.power(); setOn((v) => !v); }}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-display uppercase ${
            on ? "border-primary text-primary neon-glow" : "border-muted-foreground text-muted-foreground"
          }`}
        >
          <Power className="h-3 w-3" /> {on ? "ON AIR" : "OFF"}
        </button>
      </div>

      {/* visualizer bars */}
      <div className="mb-4 flex h-12 items-end gap-1">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-1 flex-1 rounded-sm bg-gradient-to-t from-primary to-accent"
            style={{
              height: on ? `${20 + ((i * 13) % 80)}%` : "8%",
              opacity: on ? 0.85 : 0.25,
              animation: on ? `bar${i % 4} ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate` : undefined,
            }}
          />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
        <div className="min-w-0">
          <div className="truncate font-display text-sm text-foreground">{track.title}</div>
          <div className="truncate text-[11px] text-muted-foreground">{track.artist} · {track.genre}</div>
        </div>
        <button
          onClick={() => { sfx.blip(); setIdx((i) => (i + 1) % tracks.length); }}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-primary"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-1 sm:grid-cols-3">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => { sfx.click(); setIdx(i); if (!on) setOn(true); }}
            className={`truncate rounded border px-2 py-1 text-left text-[11px] transition ${
              i === idx ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-display">{i + 1}.</span> {t.title}
          </button>
        ))}
        <button
          onClick={() => { sfx.power(); setOn(false); }}
          className={`truncate rounded border px-2 py-1 text-left text-[11px] ${
            !on ? "border-destructive text-destructive" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="font-display">×</span> No Music
        </button>
      </div>

      {/* Hidden YouTube iframe player */}
      {on && (
        <div className="overflow-hidden rounded-md border border-border" style={{ height: 80 }}>
          <iframe
            key={track.id}
            title={track.title}
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&controls=1`}
            allow="autoplay; encrypted-media"
            style={{ marginTop: -40 }}
          />
        </div>
      )}

      <style>{`
        @keyframes bar0 { from { height: 12%; } to { height: 90%; } }
        @keyframes bar1 { from { height: 35%; } to { height: 60%; } }
        @keyframes bar2 { from { height: 18%; } to { height: 80%; } }
        @keyframes bar3 { from { height: 50%; } to { height: 25%; } }
      `}</style>
    </div>
  );
}

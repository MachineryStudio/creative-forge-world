import { useState, useEffect } from "react";
import { Power, Radio, SkipForward, Repeat, ExternalLink, Globe2 } from "lucide-react";
import { sfx } from "@/lib/sfx";
import { useMusic, type Mood } from "@/lib/musicStore";

export type Genre = "anime" | "game" | "visual_kei" | "jpop" | "universal";

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  youtubeId: string;
  mood: Mood;
  artistUrl?: string | null;
  artistOfficialUrl?: string | null;
}

interface RadioNerdProps {
  genre: Genre;
  label: string;
  ownsMusic?: boolean; // only one panel should drive global music mood
}

const FALLBACK: Record<Genre, Track[]> = {
  anime: [{ id: "fb-a", title: "Cruel Angel's Thesis", artist: "Yoko Takahashi", genre: "anime", youtubeId: "o6wtDPVkKqI", mood: "clouds" }],
  game: [{ id: "fb-g", title: "Game Track", artist: "RadioNerd", genre: "game", youtubeId: "o6wtDPVkKqI", mood: "planets" }],
  visual_kei: [{ id: "fb-v", title: "Visual Kei", artist: "RadioNerd", genre: "visual_kei", youtubeId: "o6wtDPVkKqI", mood: "rain" }],
  jpop: [{ id: "fb-j", title: "JPop", artist: "RadioNerd", genre: "jpop", youtubeId: "o6wtDPVkKqI", mood: "clouds" }],
  universal: [{ id: "fb-u", title: "Universal", artist: "RadioNerd", genre: "universal", youtubeId: "o6wtDPVkKqI", mood: "nature" }],
};

export function RadioNerd({ genre, label, ownsMusic = false }: RadioNerdProps) {
  const [on, setOn] = useState(false);
  const [idx, setIdx] = useState(0);
  const [loop, setLoop] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(FALLBACK[genre] ?? FALLBACK.universal ?? []);
  const setMusic = useMusic((s) => s.setTrack);
  const setMusicOn = useMusic((s) => s.setOn);
  const setMood = useMusic((s) => s.setMood);

  useEffect(() => {
    let mounted = true;
    let channel: { unsubscribe: () => void } | null = null;
    const load = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from("radio_tracks")
          .select("id, title, youtube_id, mood, genre, artist_name, artist_url, artist_official_url")
          .eq("genre", genre)
          .order("position", { ascending: true });
        if (!mounted || !data || data.length === 0) return;
        setTracks(
          data.map((r: any) => ({
            id: r.id,
            title: r.title,
            artist: r.artist_name || "RadioNerd",
            genre,
            youtubeId: r.youtube_id,
            mood: (r.mood as Mood) ?? "clouds",
            artistUrl: r.artist_url,
            artistOfficialUrl: r.artist_official_url,
          }))
        );
        channel = supabase
          .channel(`radio_tracks_${genre}`)
          .on("postgres_changes", { event: "*", schema: "public", table: "radio_tracks" }, load)
          .subscribe();
      } catch {}
    };
    load();
    return () => { mounted = false; channel?.unsubscribe(); };
  }, [genre]);

  const track = tracks[idx] ?? tracks[0] ?? null;

  useEffect(() => {
    if (!ownsMusic || !track) return;
    if (on) setMusic(track.id, track.mood);
    else { setMusicOn(false); setMood("off"); }
  }, [on, track, ownsMusic, setMusic, setMusicOn, setMood]);

  const next = () => { sfx.blip(); setIdx((i) => (tracks.length ? (i + 1) % tracks.length : 0)); };

  return (
    <div className="panel scanlines relative overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Radio className={`h-5 w-5 shrink-0 ${on ? "text-primary animate-pulse-glow" : "text-muted-foreground"}`} />
          <h3 className="truncate font-display text-sm uppercase tracking-[0.3em] neon-text">RadioNerd · {label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sfx.click(); setLoop((v) => !v); }}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-display uppercase ${loop ? "border-accent text-accent" : "border-muted-foreground text-muted-foreground"}`}
            title={loop ? "Loop on" : "Loop off"}
          >
            <Repeat className="h-3 w-3" /> {loop ? "Loop" : "Once"}
          </button>
          <button
            onClick={() => { sfx.power(); setOn((v) => !v); }}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-display uppercase ${on ? "border-primary text-primary neon-glow" : "border-muted-foreground text-muted-foreground"}`}
          >
            <Power className="h-3 w-3" /> {on ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* visualizer */}
      <div className="mb-4 flex h-10 items-end gap-1">
        {Array.from({ length: 28 }).map((_, i) => (
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

      <div className="mb-3 flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm text-foreground">{track?.title ?? "No tracks"}</div>
          <div className="truncate text-[11px] text-muted-foreground">{track?.artist ?? "—"}</div>
        </div>
        <button onClick={next} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-primary" title="Next">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* track list + artist info side-by-side */}
      <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { sfx.click(); setIdx(i); if (!on) setOn(true); }}
              className={`truncate rounded border px-2 py-1 text-left text-[11px] transition ${i === idx ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              <span className="font-display">{i + 1}.</span> {t.title}
            </button>
          ))}
        </div>

        {/* Artist info side panel */}
        <div className="flex w-full min-w-[160px] flex-col gap-2 rounded-md border border-accent/30 bg-accent/5 p-3 md:w-44">
          <div className="font-display text-[10px] uppercase tracking-[0.2em] text-accent">Support Artist</div>
          <div className="truncate text-xs text-foreground">{track?.artist ?? "—"}</div>
          {track?.artistUrl ? (
            <a href={track.artistUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 truncate rounded border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] font-display uppercase tracking-widest text-primary hover:bg-primary/20">
              <ExternalLink className="h-3 w-3" /> More info
            </a>
          ) : (
            <span className="text-[10px] text-muted-foreground">No info link</span>
          )}
          {track?.artistOfficialUrl ? (
            <a href={track.artistOfficialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 truncate rounded border border-accent/40 bg-accent/10 px-2 py-1 text-[10px] font-display uppercase tracking-widest text-accent-foreground hover:bg-accent/20">
              <Globe2 className="h-3 w-3" /> Official site
            </a>
          ) : (
            <span className="text-[10px] text-muted-foreground">No official site</span>
          )}
        </div>
      </div>

      {/* Larger YouTube player */}
      {on && track && (
        <div className="overflow-hidden rounded-md border border-border" style={{ height: 240 }}>
          <iframe
            key={`${track.id}-${loop}`}
            title={track.title}
            width="100%"
            height="240"
            src={`https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&controls=1&loop=${loop ? 1 : 0}&playlist=${track.youtubeId}`}
            allow="autoplay; encrypted-media"
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

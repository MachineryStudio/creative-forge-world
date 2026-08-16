import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { sfx } from "@/lib/sfx";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import { AdminInbox } from "@/components/AdminInbox";
import { Trash2, Plus, LogOut, Music, Megaphone } from "lucide-react";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · LIGHTHOUSE 橋" },
      { name: "description", content: "Admin panel to manage radio playlist and announcements." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const MOODS = ["clouds", "rain", "nature", "planets", "retro", "neon", "off"] as const;
type Mood = typeof MOODS[number];

const GENRES = ["anime", "game", "visual_kei", "jpop", "universal"] as const;
type Genre = typeof GENRES[number];

interface DBTrack {
  id: string;
  title: string;
  youtube_id: string;
  mood: string;
  position: number;
  genre: string;
  artist_name: string | null;
  artist_url: string | null;
  artist_official_url: string | null;
  notes: string | null;
}

interface Announcement {
  id: string;
  title_en: string;
  title_jp: string;
  body_en: string;
  body_jp: string;
  is_active: boolean;
  position: number;
}

function AdminPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [tracks, setTracks] = useState<DBTrack[]>([]);
  const [title, setTitle] = useState("");
  const [ytInput, setYtInput] = useState("");
  const [mood, setMood] = useState<Mood>("clouds");
  const [genre, setGenre] = useState<Genre>("anime");
  const [artistName, setArtistName] = useState("");
  const [artistUrl, setArtistUrl] = useState("");
  const [artistOfficialUrl, setArtistOfficialUrl] = useState("");
  const [trackNotes, setTrackNotes] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [annTitleEn, setAnnTitleEn] = useState("");
  const [annTitleJp, setAnnTitleJp] = useState("");
  const [annBodyEn, setAnnBodyEn] = useState("");
  const [annBodyJp, setAnnBodyJp] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annMsg, setAnnMsg] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    getSupabase().then((supabase) => {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setUserId(session?.user?.id ?? null);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
      supabase.auth.getSession().then(({ data }) => {
        setUserId(data.session?.user?.id ?? null);
        setLoading(false);
      });
    }).catch((err) => { setAuthMsg(getSupabaseLoadMessage(err)); setLoading(false); });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (!userId) { setIsAdmin(false); return; }
    let active = true;
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (active) setIsAdmin(!!data);
      } catch (err) { if (active) setAuthMsg(getSupabaseLoadMessage(err)); }
    })();
    return () => { active = false; };
  }, [userId]);

  const loadTracks = async () => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from("radio_tracks").select("*").order("position", { ascending: true });
      setTracks((data ?? []) as DBTrack[]);
    } catch (err) { setSaveMsg(getSupabaseLoadMessage(err)); }
  };
  const loadAnnouncements = async () => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from("announcements").select("*").order("position", { ascending: true });
      setAnnouncements((data ?? []) as Announcement[]);
    } catch (err) { setAnnMsg(getSupabaseLoadMessage(err)); }
  };
  useEffect(() => { if (isAdmin) { loadTracks(); loadAnnouncements(); } }, [isAdmin]);

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setAuthMsg(null);
    try {
      const supabase = await getSupabase();
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
        if (error) throw error;
        sfx.coin(); setAuthMsg("Account created. You can sign in now."); setAuthMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        sfx.coin();
      }
    } catch (err) { sfx.death(); setAuthMsg(getSupabaseLoadMessage(err)); }
    finally { setBusy(false); }
  }

  async function signOut() {
    try { const supabase = await getSupabase(); await supabase.auth.signOut(); }
    finally { nav({ to: "/" }); }
  }

  function extractYoutubeId(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    try {
      const url = new URL(trimmed);
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] ?? trimmed;
    } catch { return trimmed; }
  }

  async function addTrack(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    const youtube_id = extractYoutubeId(ytInput);
    if (!title.trim() || !youtube_id) { setSaveMsg("Title and YouTube link/ID are required."); return; }
    const nextPos = (tracks[tracks.length - 1]?.position ?? 0) + 1;
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("radio_tracks").insert({
        title: title.trim(), youtube_id, mood, genre, position: nextPos,
        artist_name: artistName.trim() || null,
        artist_url: artistUrl.trim() || null,
        artist_official_url: artistOfficialUrl.trim() || null,
        notes: trackNotes.trim() || null,
      });
      if (error) throw error;
      sfx.coin();
      setTitle(""); setYtInput(""); setMood("clouds"); setArtistName(""); setArtistUrl(""); setArtistOfficialUrl(""); setTrackNotes("");
      setSaveMsg("Track added."); loadTracks();
    } catch (err) { setSaveMsg(getSupabaseLoadMessage(err)); sfx.death(); }
  }

  async function removeTrack(id: string) {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("radio_tracks").delete().eq("id", id);
      if (error) throw error;
      sfx.blip(); loadTracks();
    } catch (err) { setSaveMsg(getSupabaseLoadMessage(err)); sfx.death(); }
  }

  async function updateTrackField(id: string, field: string, value: string) {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("radio_tracks").update({ [field]: value || null }).eq("id", id);
      if (error) throw error;
      loadTracks();
    } catch (err) { setSaveMsg(getSupabaseLoadMessage(err)); }
  }

  async function addAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setAnnMsg(null);
    if (!annBodyEn.trim() && !annBodyJp.trim()) { setAnnMsg("Enter at least an English or Japanese body."); return; }
    const nextPos = (announcements[announcements.length - 1]?.position ?? 0) + 1;
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("announcements").insert({
        title_en: annTitleEn, title_jp: annTitleJp, body_en: annBodyEn, body_jp: annBodyJp,
        is_active: true, position: nextPos,
      });
      if (error) throw error;
      sfx.coin();
      setAnnTitleEn(""); setAnnTitleJp(""); setAnnBodyEn(""); setAnnBodyJp("");
      setAnnMsg("Announcement added."); loadAnnouncements();
    } catch (err) { setAnnMsg(getSupabaseLoadMessage(err)); sfx.death(); }
  }

  async function removeAnnouncement(id: string) {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
      sfx.blip(); loadAnnouncements();
    } catch (err) { setAnnMsg(getSupabaseLoadMessage(err)); sfx.death(); }
  }

  async function toggleAnnouncement(id: string, value: boolean) {
    try {
      const supabase = await getSupabase();
      await supabase.from("announcements").update({ is_active: value }).eq("id", id);
      loadAnnouncements();
    } catch (err) { setAnnMsg(getSupabaseLoadMessage(err)); }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="panel scanlines relative p-6">
            <h1 className="font-display text-3xl neon-text">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the site.</p>
            <form onSubmit={submitAuth} className="mt-6 space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
              <input type="password" required minLength={12}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}"
                title="At least 12 chars, with uppercase, lowercase, number, and symbol"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (12+ chars, mixed case, number, symbol)"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
              <button disabled={busy} type="submit"
                className="w-full rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow disabled:opacity-50">
                {busy ? "..." : (authMode === "signup" ? "Create Account" : "Sign In")}
              </button>
              {authMsg && <p className="text-xs text-muted-foreground">{authMsg}</p>}
            </form>
            <button onClick={() => { sfx.click(); setAuthMode(authMode === "signup" ? "signin" : "signup"); setAuthMsg(null); }}
              className="mt-4 text-xs text-muted-foreground hover:text-primary">
              {authMode === "signup" ? "Already have an account? Sign in" : "First time? Create account"}
            </button>
            <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="panel scanlines relative p-6 text-center">
            <h1 className="font-display text-2xl neon-text">Access Denied</h1>
            <p className="mt-3 text-sm text-muted-foreground">Your account doesn't have admin privileges.</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground break-all">UID: {userId}</p>
            <button onClick={signOut} className="mt-6 rounded-md border border-border px-4 py-2 text-xs hover:text-primary">
              <LogOut className="mr-1 inline h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl neon-text flex items-center gap-2">
              <Music className="h-6 w-6" /> LIGHTHOUSE 橋 · Admin
            </h1>
            <p className="text-xs text-muted-foreground">Manage radio playlist and bilingual announcements.</p>
          </div>
          <button onClick={signOut} className="rounded-md border border-border px-3 py-2 text-xs hover:text-primary">
            <LogOut className="mr-1 inline h-3 w-3" /> Sign out
          </button>
        </div>

        <AdminInbox />

        {/* Add track */}

        <form onSubmit={addTrack} className="panel scanlines grid gap-3 p-5 md:grid-cols-2">
          <h2 className="md:col-span-2 font-display text-sm uppercase tracking-[0.3em] text-primary">Add Track</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Track title"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <input value={ytInput} onChange={(e) => setYtInput(e.target.value)} placeholder="YouTube URL or video ID"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <select value={genre} onChange={(e) => setGenre(e.target.value as Genre)}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm">
            {GENRES.map((g) => <option key={g} value={g}>Genre: {g}</option>)}
          </select>
          <select value={mood} onChange={(e) => setMood(e.target.value as Mood)}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm">
            {MOODS.map((m) => <option key={m} value={m}>Mood: {m}</option>)}
          </select>
          <input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Artist name"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <input value={artistUrl} onChange={(e) => setArtistUrl(e.target.value)} placeholder="Artist info link (e.g. wiki / page)"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <input value={artistOfficialUrl} onChange={(e) => setArtistOfficialUrl(e.target.value)} placeholder="Artist official website"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm md:col-span-2" />
          <textarea value={trackNotes} onChange={(e) => setTrackNotes(e.target.value)} placeholder="Admin notes (internal — shown small under Support panel)"
            rows={2} className="rounded-md border border-border bg-input px-3 py-2 text-sm md:col-span-2" />
          <button type="submit" className="md:col-span-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow">
            <Plus className="mr-1 inline h-4 w-4" /> Add track
          </button>
          {saveMsg && <p className="text-xs text-muted-foreground md:col-span-2">{saveMsg}</p>}
        </form>

        {/* Tracks list */}
        <div className="panel scanlines p-5">
          <h2 className="mb-3 font-display text-sm uppercase tracking-[0.3em] text-primary">Playlist ({tracks.length})</h2>
          {tracks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tracks yet.</p>
          ) : (
            <ul className="space-y-2">
              {tracks.map((t) => (
                <li key={t.id} className="grid gap-2 rounded-md border border-border bg-background/40 p-3 md:grid-cols-[auto_1fr_auto_auto_auto]">
                  <span className="font-mono text-xs text-muted-foreground">#{t.position}</span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm">{t.title}</div>
                    <a href={`https://www.youtube.com/watch?v=${t.youtube_id}`} target="_blank" rel="noreferrer"
                      className="truncate font-mono text-[11px] text-muted-foreground hover:text-primary">{t.youtube_id}</a>
                    <div className="mt-2 grid gap-1 md:grid-cols-3">
                      <input defaultValue={t.artist_name ?? ""} placeholder="Artist name" onBlur={(e) => updateTrackField(t.id, "artist_name", e.target.value)}
                        className="rounded border border-border bg-input px-2 py-1 text-[11px]" />
                      <input defaultValue={t.artist_url ?? ""} placeholder="Artist info link" onBlur={(e) => updateTrackField(t.id, "artist_url", e.target.value)}
                        className="rounded border border-border bg-input px-2 py-1 text-[11px]" />
                      <input defaultValue={t.artist_official_url ?? ""} placeholder="Official website" onBlur={(e) => updateTrackField(t.id, "artist_official_url", e.target.value)}
                        className="rounded border border-border bg-input px-2 py-1 text-[11px]" />
                    </div>
                    <textarea defaultValue={t.notes ?? ""} placeholder="Admin notes" onBlur={(e) => updateTrackField(t.id, "notes", e.target.value)}
                      rows={2} className="mt-1 w-full rounded border border-border bg-input px-2 py-1 text-[11px]" />
                  </div>
                  <select value={t.genre} onChange={(e) => updateTrackField(t.id, "genre", e.target.value)}
                    className="rounded-md border border-border bg-input px-2 py-1 text-xs">
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select value={t.mood} onChange={(e) => updateTrackField(t.id, "mood", e.target.value)}
                    className="rounded-md border border-border bg-input px-2 py-1 text-xs">
                    {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button onClick={() => removeTrack(t.id)} className="rounded-md border border-destructive/40 p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Announcements */}
        <form onSubmit={addAnnouncement} className="panel scanlines grid gap-3 p-5 md:grid-cols-2">
          <h2 className="md:col-span-2 flex items-center gap-2 font-display text-sm uppercase tracking-[0.3em] text-primary">
            <Megaphone className="h-4 w-4" /> Add Announcement (EN / JP)
          </h2>
          <input value={annTitleEn} onChange={(e) => setAnnTitleEn(e.target.value)} placeholder="Title (English)"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <input value={annTitleJp} onChange={(e) => setAnnTitleJp(e.target.value)} placeholder="タイトル (日本語)"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" lang="ja" />
          <textarea value={annBodyEn} onChange={(e) => setAnnBodyEn(e.target.value)} placeholder="Body (English)" rows={3}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <textarea value={annBodyJp} onChange={(e) => setAnnBodyJp(e.target.value)} placeholder="本文 (日本語)" rows={3}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" lang="ja" />
          <button type="submit" className="md:col-span-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow">
            <Plus className="mr-1 inline h-4 w-4" /> Add announcement
          </button>
          {annMsg && <p className="text-xs text-muted-foreground md:col-span-2">{annMsg}</p>}
        </form>

        <div className="panel scanlines p-5">
          <h2 className="mb-3 font-display text-sm uppercase tracking-[0.3em] text-primary">Announcements ({announcements.length})</h2>
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            <ul className="space-y-2">
              {announcements.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-md border border-border bg-background/40 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm">{a.title_en || a.title_jp || "(untitled)"}</div>
                    <div className="text-xs text-muted-foreground" lang="ja">{a.title_jp}</div>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground">{a.body_en}</p>
                    <p className="truncate text-[11px] text-muted-foreground" lang="ja">{a.body_jp}</p>
                  </div>
                  <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <input type="checkbox" checked={a.is_active} onChange={(e) => toggleAnnouncement(a.id, e.target.checked)} />
                    Active
                  </label>
                  <button onClick={() => removeAnnouncement(a.id)} className="rounded-md border border-destructive/40 p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { sfx } from "@/lib/sfx";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import { Trash2, Plus, LogOut, Music } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · RadioNerd" },
      { name: "description", content: "Admin panel to manage the radio playlist." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const MOODS = ["clouds", "rain", "nature", "planets", "retro", "neon", "off"] as const;
type Mood = typeof MOODS[number];

interface DBTrack {
  id: string;
  title: string;
  youtube_id: string;
  mood: string;
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
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getSupabase()
      .then((supabase) => {
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
          setUserId(session?.user?.id ?? null);
        });
        unsubscribe = () => sub.subscription.unsubscribe();
        supabase.auth.getSession().then(({ data }) => {
          setUserId(data.session?.user?.id ?? null);
          setLoading(false);
        });
      })
      .catch((err) => {
        setAuthMsg(getSupabaseLoadMessage(err));
        setLoading(false);
      });

    return () => unsubscribe?.();
  }, []);

  // Check admin role + load tracks
  useEffect(() => {
    if (!userId) { setIsAdmin(false); return; }
    let active = true;
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (!active) return;
        setIsAdmin(!!data);
      } catch (err) {
        if (active) setAuthMsg(getSupabaseLoadMessage(err));
      }
    })();
    return () => { active = false; };
  }, [userId]);

  const loadTracks = async () => {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase
        .from("radio_tracks")
        .select("*")
        .order("position", { ascending: true });
      setTracks((data ?? []) as DBTrack[]);
    } catch (err) {
      setSaveMsg(getSupabaseLoadMessage(err));
    }
  };
  useEffect(() => { if (isAdmin) loadTracks(); }, [isAdmin]);

  // ---- auth handlers ----
  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setAuthMsg(null);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        sfx.coin();
        setAuthMsg("Account created. You can sign in now.");
        setAuthMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        sfx.coin();
      }
    } catch (err) {
      sfx.death();
      setAuthMsg(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  // ---- track handlers ----
  function extractYoutubeId(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    // Already an ID (11 chars, alphanumeric + - _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    try {
      const url = new URL(trimmed);
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] ?? trimmed;
    } catch {
      return trimmed;
    }
  }

  async function addTrack(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    const youtube_id = extractYoutubeId(ytInput);
    if (!title.trim() || !youtube_id) {
      setSaveMsg("Title and YouTube link/ID are required.");
      return;
    }
    const nextPos = (tracks[tracks.length - 1]?.position ?? 0) + 1;
    const { error } = await supabase.from("radio_tracks").insert({
      title: title.trim(),
      youtube_id,
      mood,
      position: nextPos,
    });
    if (error) { setSaveMsg(error.message); sfx.death(); return; }
    sfx.coin();
    setTitle(""); setYtInput(""); setMood("clouds");
    setSaveMsg("Track added.");
    loadTracks();
  }

  async function removeTrack(id: string) {
    const { error } = await supabase.from("radio_tracks").delete().eq("id", id);
    if (error) { setSaveMsg(error.message); sfx.death(); return; }
    sfx.blip();
    loadTracks();
  }

  async function updateMood(id: string, newMood: string) {
    const { error } = await supabase.from("radio_tracks").update({ mood: newMood }).eq("id", id);
    if (error) { setSaveMsg(error.message); return; }
    loadTracks();
  }

  // ---- render ----
  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  // Not signed in → login form
  if (!userId) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="panel scanlines relative p-6">
            <h1 className="font-display text-3xl neon-text">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the radio playlist.</p>
            <form onSubmit={submitAuth} className="mt-6 space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
              <button disabled={busy} type="submit"
                className="w-full rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow disabled:opacity-50">
                {busy ? "..." : (authMode === "signup" ? "Create Account" : "Sign In")}
              </button>
              {authMsg && <p className="text-xs text-muted-foreground">{authMsg}</p>}
            </form>
            <button
              onClick={() => { sfx.click(); setAuthMode(authMode === "signup" ? "signin" : "signup"); setAuthMsg(null); }}
              className="mt-4 text-xs text-muted-foreground hover:text-primary"
            >
              {authMode === "signup" ? "Already have an account? Sign in" : "First time? Create account"}
            </button>
            <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="panel scanlines relative p-6 text-center">
            <h1 className="font-display text-2xl neon-text">Access Denied</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your account doesn't have admin privileges.
            </p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground break-all">UID: {userId}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              An owner needs to grant you the <span className="text-primary">admin</span> role in the database.
            </p>
            <button onClick={signOut} className="mt-6 rounded-md border border-border px-4 py-2 text-xs hover:text-primary">
              <LogOut className="mr-1 inline h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl neon-text flex items-center gap-2">
              <Music className="h-6 w-6" /> RadioNerd Admin
            </h1>
            <p className="text-xs text-muted-foreground">Manage the radio playlist.</p>
          </div>
          <button onClick={signOut} className="rounded-md border border-border px-3 py-2 text-xs hover:text-primary">
            <LogOut className="mr-1 inline h-3 w-3" /> Sign out
          </button>
        </div>

        {/* Add form */}
        <form onSubmit={addTrack} className="panel scanlines mb-6 grid gap-3 p-5 md:grid-cols-[2fr_2fr_1fr_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Track title"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <input value={ytInput} onChange={(e) => setYtInput(e.target.value)} placeholder="YouTube URL or video ID"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
          <select value={mood} onChange={(e) => setMood(e.target.value as Mood)}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm">
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="submit" className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow">
            <Plus className="mr-1 inline h-4 w-4" /> Add
          </button>
          {saveMsg && <p className="text-xs text-muted-foreground md:col-span-4">{saveMsg}</p>}
        </form>

        {/* Tracks list */}
        <div className="panel scanlines p-5">
          <h2 className="mb-3 font-display text-sm uppercase tracking-[0.3em] text-primary">Playlist ({tracks.length})</h2>
          {tracks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tracks yet.</p>
          ) : (
            <ul className="space-y-2">
              {tracks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground w-8">#{t.position}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm">{t.title}</div>
                    <a href={`https://www.youtube.com/watch?v=${t.youtube_id}`} target="_blank" rel="noreferrer"
                      className="truncate font-mono text-[11px] text-muted-foreground hover:text-primary">
                      {t.youtube_id}
                    </a>
                  </div>
                  <select value={t.mood} onChange={(e) => updateMood(t.id, e.target.value)}
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
      </div>
    </div>
  );
}

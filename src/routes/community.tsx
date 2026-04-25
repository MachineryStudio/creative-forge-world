import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { sfx } from "@/lib/sfx";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — World Space" },
      { name: "description", content: "Share opinions and feedback with other creators." },
    ],
  }),
  component: Community,
});

interface Msg {
  id: string;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
}

function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from("community_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data }) => { if (data) setMessages(data as Msg[]); });

    const ch = supabase
      .channel("community")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, (payload) => {
        setMessages((m) => [...m, payload.new as Msg]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;
    const text = body.trim().slice(0, 500);
    setBody("");
    const display = (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "guest";
    const { error } = await supabase.from("community_messages").insert({
      user_id: user.id, display_name: display, body: text,
    });
    if (error) { sfx.death(); console.error(error); } else sfx.blip();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl neon-text">Community Chat</h1>
            <p className="text-sm text-muted-foreground">Share opinions & feedback. Be kind. Max 500 chars.</p>
          </div>
          {!user && <Link to="/auth" className="rounded-md border border-primary px-3 py-1 text-xs text-primary">Sign in to post</Link>}
        </div>

        <div className="panel scanlines relative h-[440px] overflow-y-auto p-4">
          {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet. Be the first.</p>}
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="rounded-md border border-border bg-background/40 px-3 py-2">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-display text-primary">{m.display_name}</span>
                  <span>{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1 text-sm text-foreground break-words">{m.body}</p>
              </li>
            ))}
            <div ref={endRef} />
          </ul>
        </div>

        <form onSubmit={send} className="mt-3 flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={!user}
            placeholder={user ? "Say something..." : "Sign in to chat"}
            className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm disabled:opacity-50"
            maxLength={500}
          />
          <button disabled={!user || !body.trim()}
            className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-xs text-primary-foreground disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

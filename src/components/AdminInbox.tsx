import { useEffect, useState } from "react";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import { sfx } from "@/lib/sfx";
import { Inbox, Trash2, MailOpen, Mail, RefreshCw, Reply } from "lucide-react";

export const INBOX_ADDRESS = "andre@lighthashi.dev";

export interface InboxMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
  role_applied: string | null;
  is_read: boolean;
  created_at: string;
}

export function AdminInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await (supabase as any)
        .from("contact_messages")
        .select("*")
        .eq("is_archived", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMessages((data ?? []) as InboxMessage[]);
      setMsg(null);
    } catch (err) {
      setMsg(getSupabaseLoadMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setRead = async (id: string, value: boolean) => {
    try {
      const supabase = await getSupabase();
      const { error } = await (supabase as any).from("contact_messages").update({ is_read: value }).eq("id", id);
      if (error) throw error;
      sfx.blip();
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, is_read: value } : x)));
    } catch (err) { setMsg(getSupabaseLoadMessage(err)); }
  };

  const remove = async (id: string) => {
    try {
      const supabase = await getSupabase();
      const { error } = await (supabase as any).from("contact_messages").delete().eq("id", id);
      if (error) throw error;
      sfx.blip();
      setMessages((m) => m.filter((x) => x.id !== id));
    } catch (err) { setMsg(getSupabaseLoadMessage(err)); }
  };

  const shown = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <section className="panel scanlines relative p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.3em] text-primary">
            <Inbox className="h-4 w-4" /> Inbox · 受信箱
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Messages sent to <span className="text-primary">{INBOX_ADDRESS}</span> through the site form
            {unread > 0 && <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">{unread} unread</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { sfx.click(); setFilter(filter === "all" ? "unread" : "all"); }}
            className="rounded-md border border-border px-3 py-2 text-xs hover:text-primary">
            {filter === "all" ? "Show unread" : "Show all"}
          </button>
          <button onClick={() => { sfx.click(); load(); }}
            className="rounded-md border border-border px-3 py-2 text-xs hover:text-primary">
            <RefreshCw className="mr-1 inline h-3 w-3" /> Refresh
          </button>
        </div>
      </div>

      {msg && <p className="mt-3 text-xs text-destructive">{msg}</p>}

      <div className="mt-4 space-y-3">
        {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
        {!loading && shown.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No messages yet. Applications from the Hired Projects panel land here.
          </p>
        )}
        {shown.map((m) => (
          <article key={m.id}
            className={`rounded-lg border p-4 transition ${m.is_read ? "border-border bg-card/40" : "border-primary/50 bg-primary/5"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-foreground">{m.sender_name}</span>
                  <a href={`mailto:${m.sender_email}`} className="text-xs text-primary hover:underline">{m.sender_email}</a>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                  {m.role_applied && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent-foreground">{m.role_applied}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a href={`mailto:${m.sender_email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message to LIGHTHOUSE 橋"))}`}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-primary" title="Reply by email">
                  <Reply className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => setRead(m.id, !m.is_read)}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-primary"
                  title={m.is_read ? "Mark unread" : "Mark read"}>
                  {m.is_read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => remove(m.id)}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {m.subject && <p className="mt-3 font-display text-sm text-primary">{m.subject}</p>}
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{m.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

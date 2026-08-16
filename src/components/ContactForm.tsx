import { useState } from "react";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import { sfx } from "@/lib/sfx";
import { Send } from "lucide-react";

const ROLES = ["3D Anime Artist", "Lead Guitarist", "Other / General"];

export type ContactFormMode = "application" | "general";

export function ContactForm({ mode = "application" }: { mode?: ContactFormMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !body.trim()) { setMsg("Name, email and message are required."); return; }
    setBusy(true); setMsg(null);
    try {
      const supabase = await getSupabase();
      const insertData: any = {
        sender_name: name.trim(),
        sender_email: email.trim(),
        body: body.trim(),
      };
      if (mode === "application") {
        insertData.subject = `Application · ${role}`;
        insertData.role_applied = role;
      } else {
        insertData.subject = subject.trim() || "General Inquiry";
        insertData.role_applied = null;
      }
      const { error } = await (supabase as any).from("contact_messages").insert(insertData);
      if (error) throw error;
      sfx.coin();
      setSent(true); setName(""); setEmail(""); setBody(""); setSubject("");
    } catch (err) { sfx.death(); setMsg(getSupabaseLoadMessage(err)); }
    finally { setBusy(false); }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm text-foreground">
        Message received — ありがとう. Andre will reply from <span className="text-primary">andre@lighthashi.dev</span>.
        <button onClick={() => setSent(false)} className="ml-2 text-xs text-primary hover:underline">Send another</button>
      </div>
    );
  }

  const isApplication = mode === "application";

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-border bg-card/50 p-4 md:grid-cols-2">
      <p className="md:col-span-2 font-display text-[10px] uppercase tracking-[0.3em] text-primary">
        {isApplication ? "Apply · 応募フォーム" : "Contact · お問い合わせ"}
      </p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name · お名前"
        className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email · メール"
        className="rounded-md border border-border bg-input px-3 py-2 text-sm" />
      {isApplication ? (
        <select value={role} onChange={(e) => setRole(e.target.value)}
          className="rounded-md border border-border bg-input px-3 py-2 text-sm md:col-span-2">
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      ) : (
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject · 件名"
          className="rounded-md border border-border bg-input px-3 py-2 text-sm md:col-span-2" />
      )}
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
        placeholder={isApplication ? "Tell us about your work, portfolio links… · 自己紹介とポートフォリオ" : "Your message… · メッセージ"}
        className="rounded-md border border-border bg-input px-3 py-2 text-sm md:col-span-2" />
      <button disabled={busy} type="submit"
        className="md:col-span-2 rounded-md border border-primary bg-primary/10 px-4 py-2 font-display text-xs uppercase tracking-widest text-primary transition hover:bg-primary/20 hover:shadow-[0_0_20px_var(--color-neon)] disabled:opacity-50">
        <Send className="mr-1 inline h-3 w-3" /> {busy ? "Sending…" : `Send to andre@lighthashi.dev`}
      </button>
      {msg && <p className="md:col-span-2 text-xs text-destructive">{msg}</p>}
    </form>
  );
}

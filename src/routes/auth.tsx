import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — World Space" },
      { name: "description", content: "Subscribe to portfolio updates and free educational resources." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        sfx.coin();
        setMsg("Check your email to confirm — or sign in if confirmation is disabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        sfx.coin();
        nav({ to: "/community" });
      }
    } catch (err) {
      sfx.death();
      setMsg(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="panel scanlines relative p-6">
          <h1 className="font-display text-3xl neon-text">{mode === "signup" ? "Create Account" : "Sign In"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe for portfolio updates & free educational resources.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
            <button disabled={busy} type="submit"
              className="w-full rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-sm text-primary-foreground neon-glow disabled:opacity-50">
              {busy ? "..." : (mode === "signup" ? "Sign Up" : "Sign In")}
            </button>
            {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
          </form>

          <button
            onClick={() => { sfx.click(); setMode(mode === "signup" ? "signin" : "signup"); setMsg(null); }}
            className="mt-4 text-xs text-muted-foreground hover:text-primary"
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>

          <Link to="/community" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">
            → Skip to community chat
          </Link>
        </div>
      </div>
    </div>
  );
}

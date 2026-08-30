import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Globe, Volume2, VolumeX } from "lucide-react";
import { speakMood, setMiyuMuted, type MiyuWord } from "@/lib/miyuVoice";
import miyuIdle from "@/assets/miyu-idle.webp";
import miyuWave from "@/assets/miyu-wave.webp";
import miyuTalk from "@/assets/miyu-talk.webp";

type Lang = "en" | "jp" | "es" | "fr" | "zh" | "ko" | "it";
const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "jp", label: "日本語", flag: "🇯🇵" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

const GREETING: Record<Lang, string> = {
  en: "Hi! I'm MIYU 🐾 How can I help you today?",
  jp: "こんにちは!MIYUです 🐾 何かお手伝いしますか?",
  es: "¡Hola! Soy MIYU 🐾 ¿En qué te ayudo?",
  fr: "Salut ! Je suis MIYU 🐾 Comment puis-je t'aider ?",
  zh: "你好!我是 MIYU 🐾 有什么可以帮你的?",
  ko: "안녕! 나는 MIYU 야 🐾 무엇을 도와줄까?",
  it: "Ciao! Sono MIYU 🐾 Come posso aiutarti?",
};

interface Msg { role: "user" | "assistant"; content: string; }

export function MiyuChat() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pose, setPose] = useState<"idle" | "wave" | "talk">("wave");
  const [voiceWord, setVoiceWord] = useState<MiyuWord | null>(null);
  const [voiceOff, setVoiceOff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subtitle is driven by the clip's own playing/ended events → exact sync.
  useEffect(() => onMiyuWord(setVoiceWord), []);

  const say = (mood: Parameters<typeof speakMood>[0]) => { speakMood(mood); };


  // Idle animation: cycle wave → idle every 6s when not talking
  useEffect(() => {
    if (busy) { setPose("talk"); return; }
    const t = setInterval(() => setPose((p) => (p === "idle" ? "wave" : "idle")), 4000);
    return () => clearInterval(t);
  }, [busy]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: GREETING[lang] }]);
      say("greet");
    }
  }, [open, lang, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const sprite = pose === "wave" ? miyuWave : pose === "talk" ? miyuTalk : miyuIdle;

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/miyu-chat`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Chat error");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      say(["praise", "curious", "cheer"][Math.floor(Math.random() * 3)] as "praise");
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Nyaa~ I had trouble: ${e.message}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { const n = !open; setOpen(n); if (!n) say("bye"); }}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-primary/60 transition hover:scale-110"
        style={{ background: "var(--sakura-white)", boxShadow: "0 0 32px var(--neon-pink)" }}
        aria-label="Open MIYU chat"
      >
        <img loading="lazy" decoding="async"
          src={miyuWave}
          alt="MIYU"
          className="h-14 w-14 object-contain animate-float"
        />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col panel scanlines overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--sakura-white)" }}>
                <img loading="lazy" decoding="async" src={miyuIdle} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div>
                <div className="font-display text-sm neon-text">MIYU</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Site online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const n = !voiceOff; setVoiceOff(n); setMiyuMuted(n); if (!n) say("greet"); }}
                className="rounded-md p-1 text-muted-foreground hover:text-primary"
                aria-label={voiceOff ? "Unmute MIYU voice" : "Mute MIYU voice"}
              >
                {voiceOff ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button onClick={() => { setOpen(false); say("bye"); }} className="rounded-md p-1 text-muted-foreground hover:text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Language picker */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-background/40 px-2 py-1">
            <Globe className="h-3 w-3 shrink-0 text-muted-foreground" />
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setMessages([{ role: "assistant", content: GREETING[l.code] }]); }}
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-display uppercase tracking-wider transition ${lang === l.code ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          {/* Messages with MIYU sprite */}
          <div className="relative flex-1 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-y-auto p-3 pr-20 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${m.role === "user" ? "bg-primary/20 text-foreground" : "bg-card text-foreground border border-border"}`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="text-[10px] italic text-muted-foreground">MIYU is typing…</div>
              )}
            </div>
            {voiceWord && (
              <div className="pointer-events-none absolute bottom-28 right-2 max-w-[9rem] animate-scale-in rounded-2xl border border-primary/50 bg-card/90 px-3 py-1.5 text-center shadow-[0_0_18px_var(--neon-pink)] backdrop-blur-sm">
                <div className="font-display text-sm text-primary" lang="ja">{voiceWord.text}</div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{voiceWord.en}</div>
              </div>
            )}
            <img loading="lazy" decoding="async"
              src={sprite}
              alt="MIYU"
              className="pointer-events-none absolute bottom-0 right-0 h-32 w-auto object-contain transition-all duration-300"
              style={{ filter: "drop-shadow(0 0 12px var(--neon-pink))" }}
            />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-background/60 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Ask MIYU…"
              className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-xs"
            />
            <button onClick={send} disabled={busy}
              className="rounded-md bg-gradient-to-r from-primary to-accent px-3 py-2 text-primary-foreground disabled:opacity-50">
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

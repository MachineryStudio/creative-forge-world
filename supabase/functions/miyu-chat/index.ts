import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  jp: "Japanese",
  es: "Spanish",
  fr: "French",
  zh: "Mandarin Chinese",
  ko: "Korean",
  it: "Italian",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages, lang = "en" } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const langName = LANG_NAMES[lang] ?? "English";
    const system = `You are MIYU, the friendly cat-girl mascot and customer-service assistant for the LIGHTHOUSE 橋 / CreatureToolBox website (an art, music, and game-dev hub run by Andree).
Always reply in ${langName}. Keep answers warm, short (1-3 sentences), playful with the occasional "nyaa~".
You can help visitors with:
- navigating the site (RAION 雷音 channels, Marketplace, Community, Hubs, Admin info)
- explaining features and admin status
- general questions about the project
If asked about the admin status, say the site is online and operating normally unless told otherwise.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit, try again soon." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "...";
    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

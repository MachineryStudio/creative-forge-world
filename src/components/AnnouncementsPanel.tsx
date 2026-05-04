import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Announcement {
  id: string;
  title_en: string;
  title_jp: string;
  body_en: string;
  body_jp: string;
}

export function AnnouncementsPanel() {
  const [items, setItems] = useState<Announcement[]>([]);
  const { jpOnly, lang, bilingual } = useI18n();

  useEffect(() => {
    let mounted = true;
    let channel: { unsubscribe: () => void } | null = null;
    const load = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from("announcements")
          .select("id, title_en, title_jp, body_en, body_jp")
          .eq("is_active", true)
          .order("position", { ascending: true });
        if (mounted && data) setItems(data as Announcement[]);
        const { supabase: sb } = await import("@/integrations/supabase/client");
        channel = sb
          .channel("announcements_changes")
          .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, load)
          .subscribe();
      } catch {}
    };
    load();
    return () => { mounted = false; channel?.unsubscribe(); };
  }, []);

  if (items.length === 0) return null;

  const showJp = jpOnly || lang === "jp";

  return (
    <div className="panel scanlines relative p-5">
      <div className="mb-3 flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" />
        <h3 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Announcements</h3>
      </div>
      <div className="space-y-4">
        {items.map((a) => (
          <div key={a.id} className="rounded-md border border-border bg-background/40 p-3">
            {bilingual ? (
              <>
                <div className="font-display text-sm text-foreground" lang="ja">{a.title_jp || a.title_en}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground" lang="ja">{a.body_jp || a.body_en}</p>
                <hr className="my-2 border-border/50" />
                <div className="font-display text-sm text-foreground">{a.title_en || a.title_jp}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body_en || a.body_jp}</p>
              </>
            ) : (
              <>
                <div className="font-display text-sm text-foreground" lang={showJp ? "ja" : "en"}>
                  {showJp ? (a.title_jp || a.title_en) : (a.title_en || a.title_jp)}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground" lang={showJp ? "ja" : "en"}>
                  {showJp ? (a.body_jp || a.body_en) : (a.body_en || a.body_jp)}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Twitter, Globe, Github } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LIGHTHOUSE 橋" },
      { name: "description", content: "Send a message to LIGHTHOUSE 橋. Andre replies from andre@lighthashi.dev." },
      { property: "og:title", content: "Contact — LIGHTHOUSE 橋" },
      { property: "og:description", content: "Send a message to LIGHTHOUSE 橋. Andre replies from andre@lighthashi.dev." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const t = useT();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pt-12 pb-10">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.3em] text-primary">
            <Mail className="h-3 w-3" />
            {t("contact")}
          </div>
          <h1 className="font-display text-4xl neon-text md:text-6xl">LIGHTHOUSE 橋</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Send a message directly. Andre will reply from{" "}
            <a href="mailto:andre@lighthashi.dev" className="text-primary hover:underline">andre@lighthashi.dev</a>.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="panel scanlines p-5">
              <h2 className="font-display text-lg uppercase tracking-widest text-primary">Direct Email</h2>
              <a href="mailto:andre@lighthashi.dev" className="mt-2 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> andre@lighthashi.dev
              </a>
            </div>

            <div className="panel scanlines p-5">
              <h2 className="font-display text-lg uppercase tracking-widest text-primary">Social / Portfolios</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="https://twitter.com/9THE_BRIDGE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Twitter className="h-4 w-4" /> @9THE_BRIDGE
                  </a>
                </li>
                <li>
                  <a href="https://andreremi.artstation.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Globe className="h-4 w-4" /> ArtStation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/MachineryStudio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Github className="h-4 w-4" /> GitHub · MachineryStudio
                  </a>
                </li>
              </ul>
            </div>

            <div className="panel scanlines p-5">
              <h2 className="font-display text-lg uppercase tracking-widest text-primary">Location</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Remote · Worldwide
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="panel scanlines p-6">
            <h2 className="mb-4 font-display text-xl neon-text">Send a message · メッセージ</h2>
            <ContactForm mode="general" />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background/40">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LIGHTHOUSE 橋 · Prototype Software Pipeline
        </div>
      </footer>
    </div>
  );
}

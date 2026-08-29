import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { NAV_GROUPS, ITEM_LINKS } from "@/lib/nav";


const SECTIONS = [
  {
    titleKey: "pipeline" as const,
    items: [
      { label: "3D Mesh", to: "/hub/3d-mesh" },
      { label: "2D Conceptual", to: "/hub/2d-conceptual" },
      { label: "2D Creatures", to: "/hub/2d-creatures" },
      { label: "Concept & Reference / Base Mesh", to: "/hub/3d-mesh" },
      { label: "Sculpting · Retopo · UV · Bake", to: "/hub/3d-mesh" },
      { label: "Texturing & Material Authoring", to: "/hub/3d-mesh" },
      { label: "Rigging · Animation · Render", to: "/hub/rigging" },
    ],
  },
  {
    titleKey: "tools" as const,
    items: [
      { label: "Maya + Mudbox", to: "/hub/toolbox" },
      { label: "Maya + Zbrush + Substance", to: "/hub/toolbox" },
      { label: "Blender", to: "/hub/toolbox" },
      { label: "Marmoset Toolbag", to: "/hub/toolbox" },
      { label: "Marvelous Designer", to: "/hub/toolbox" },
      { label: "Clip Studio Paint", to: "/hub/toolbox" },
      { label: "Python Scripting", to: "/hub/toolbox" },
    ],
  },
  {
    titleKey: "rigging" as const,
    items: [
      { label: "Skeleton (Bone/Joint Placement)", to: "/hub/rigging" },
      { label: "Skinning / Weight Painting", to: "/hub/rigging" },
      { label: "Control System Design", to: "/hub/rigging" },
      { label: "Kinematics IK/FK · Deformers", to: "/hub/rigging" },
      { label: "Python & C++ Coding", to: "/hub/rigging" },
    ],
  },
  {
    titleKey: "artProjects" as const,
    items: [
      { label: "Comics-Manga", to: "/hub/comics" },
      { label: "3D Minitoires", to: "/hub/minitoires" },
      { label: "Scriptable Game Design", to: "/hub/scriptable" },
    ],
  },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const drawer = (
        <div className="fixed inset-0 z-[100] flex">
          <div className="flex-1 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[min(520px,92vw)] overflow-y-auto panel scanlines border-l-2 border-primary/40 p-8">

            <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-4">
              <span className="font-display text-2xl neon-text">{t("menu")}</span>
              <button onClick={() => { sfx.click(); setOpen(false); }} className="rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main navigation — primary way to navigate on mobile */}
            <nav className="mb-8">
              <h3 className="mb-3 font-display text-xs uppercase tracking-[0.3em] text-primary">Navigation</h3>
              <ul className="space-y-3">
                {NAV_GROUPS.map((g) => (
                  <li key={g.label}>
                    <Link
                      to={g.to}
                      onClick={() => { sfx.blip(); setOpen(false); }}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "border-primary bg-primary/25 text-primary shadow-[0_0_18px_var(--color-neon)]" }}
                      className="relative block rounded-md border border-primary/40 bg-primary/10 px-3 py-2 font-display text-xs uppercase tracking-widest text-primary transition hover:bg-primary/20 active:scale-95 data-[status=active]:before:absolute data-[status=active]:before:left-0 data-[status=active]:before:top-1/2 data-[status=active]:before:h-5 data-[status=active]:before:w-1 data-[status=active]:before:-translate-y-1/2 data-[status=active]:before:rounded-r data-[status=active]:before:bg-primary"
                    >
                      {g.label}
                    </Link>
                    <ul className="mt-1.5 ml-3 space-y-1 border-l border-border/40 pl-3">
                      {g.items.map((it) => {
                        const href = ITEM_LINKS[it];
                        const isExternal = href?.startsWith("http");
                        return (
                          <li key={it}>
                            {href && isExternal ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => { sfx.blip(); setOpen(false); }}
                                className="block rounded px-2 py-1 text-xs text-muted-foreground transition hover:text-primary"
                              >
                                › {it} ↗
                              </a>
                            ) : (
                              <Link
                                to={href ?? g.to}
                                onClick={() => { sfx.blip(); setOpen(false); }}
                                activeOptions={{ exact: true }}
                                activeProps={{ className: "bg-primary/10 text-primary" }}
                                className="block rounded px-2 py-1 text-xs text-muted-foreground transition hover:text-primary"
                              >
                                › {it}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}

                <li>
                  <Link
                    to="/auth"
                    onClick={() => { sfx.blip(); setOpen(false); }}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "border-accent bg-accent/25 shadow-[0_0_18px_var(--color-accent)]" }}
                    className="block rounded-md border border-accent/50 bg-accent/10 px-3 py-2 text-center font-display text-xs uppercase tracking-widest text-accent-foreground transition hover:bg-accent/20 active:scale-95"
                  >
                    {t("signIn").toUpperCase()}
                  </Link>
                </li>

              </ul>
            </nav>

            <div className="space-y-8">
              {SECTIONS.map((s, i) => (
                <div key={s.titleKey}>

                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-md border border-primary/60 bg-primary/10 font-display text-sm text-primary neon-glow">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-base uppercase tracking-widest text-foreground">{t(s.titleKey)}</h3>
                  </div>
                  <ul className="ml-11 space-y-1.5 border-l border-border/40 pl-4">
                    {s.items.map((it) => (
                      <li key={it.label}>
                        <Link
                          to={it.to}
                          onClick={() => { sfx.blip(); setOpen(false); }}
                          activeOptions={{ exact: true }}
                          activeProps={{ className: "bg-primary/15 pl-5 text-primary" }}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-primary/10 hover:pl-5 hover:text-primary"
                        >
                          › {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
  );

  return (
    <>
      <button
        onClick={() => { sfx.click(); setOpen(true); }}
        className="grid h-11 w-11 place-items-center rounded-md border border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition hover:scale-105 hover:from-primary/20 hover:to-accent/20 hover:shadow-[0_0_20px_var(--color-neon)]"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      {open && mounted && createPortal(drawer, document.body)}
    </>
  );
}


import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";

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
  const t = useT();

  return (
    <>
      <button
        onClick={() => { sfx.click(); setOpen(true); }}
        className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/60 text-foreground hover:text-primary"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="flex-1 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[min(440px,90vw)] overflow-y-auto panel scanlines border-l border-border p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg neon-text">{t("menu")}</span>
              <button onClick={() => { sfx.click(); setOpen(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {SECTIONS.map((s, i) => (
                <div key={s.titleKey}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded border border-primary/50 font-display text-xs text-primary">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-sm uppercase tracking-widest text-foreground">{t(s.titleKey)}</h3>
                  </div>
                  <ul className="ml-8 space-y-1">
                    {s.items.map((it) => (
                      <li key={it.label}>
                        <Link
                          to={it.to}
                          onClick={() => { sfx.blip(); setOpen(false); }}
                          className="block rounded px-2 py-1 text-sm text-muted-foreground transition hover:bg-secondary hover:text-primary"
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
      )}
    </>
  );
}

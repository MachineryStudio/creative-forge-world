import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/toolbox")({
  head: () => ({
    meta: [
      { title: "Technical Toolbox — World Space" },
      { name: "description", content: "Maya, ZBrush, Substance, Blender, Marmoset, Marvelous, Clip Studio, Python." },
      { property: "og:title", content: "Technical Toolbox — World Space" },
      { property: "og:description", content: "DCC stack and scripting." },
    ],
  }),
  component: () => (
    <HubPage
      title="Technical Toolbox"
      subtitle="DCC Stack · Scripting"
      hue={140}
      game="toggle"
      description="Regardless of software, the core technical pipeline remains. Maya + Mudbox · Maya + ZBrush + Substance · Blender · Marmoset Toolbag · Marvelous Designer · Clip Studio Paint · Python scripting."
    />
  ),
});

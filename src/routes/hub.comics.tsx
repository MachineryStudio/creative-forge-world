import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/comics")({
  head: () => ({
    meta: [
      { title: "Comics-Manga — World Space" },
      { name: "description", content: "Sequential art: panel, pacing, and ink." },
      { property: "og:title", content: "Comics-Manga — World Space" },
      { property: "og:description", content: "Sequential art: panel, pacing, and ink." },
    ],
  }),
  component: () => (
    <HubPage
      title="Comics-Manga"
      subtitle="Panel · Pacing · Ink"
      hue={350}
      game="rhythm"
      description="Sequential art and storytelling. Storyboards, panel composition, ink workflow in Clip Studio Paint."
    />
  ),
});

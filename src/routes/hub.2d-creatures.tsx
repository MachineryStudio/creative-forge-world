import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/2d-creatures")({
  head: () => ({
    meta: [
      { title: "2D Creatures — World Space" },
      { name: "description", content: "Creature concept design — morphology, phylogeny, anatomy." },
      { property: "og:title", content: "2D Creatures — World Space" },
      { property: "og:description", content: "Creature concept design — morphology, phylogeny, anatomy." },
    ],
  }),
  component: () => (
    <HubPage
      title="2D Creatures"
      subtitle="Morphology · Phylogeny · Anatomy"
      hue={75}
      game="shoot"
      description="Creature design rooted in real biology. Morphological studies, speculative phylogenies, and silhouette-driven exploration of unknown lifeforms."
    />
  ),
});

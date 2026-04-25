import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/2d-conceptual")({
  head: () => ({
    meta: [
      { title: "2D Conceptual — World Space" },
      { name: "description", content: "Visual development, mood, silhouette, and concept iteration." },
      { property: "og:title", content: "2D Conceptual — World Space" },
      { property: "og:description", content: "Visual development, mood, silhouette, and concept iteration." },
    ],
  }),
  component: () => (
    <HubPage
      title="2D Conceptual"
      subtitle="Visdev · Mood · Silhouette"
      hue={320}
      game="drag"
      description="Visual development for environments, props, and characters. Silhouette studies, value compositions, and color scripts that drive the 3D pipeline."
    />
  ),
});

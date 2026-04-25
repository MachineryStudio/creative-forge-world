import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/minitoires")({
  head: () => ({
    meta: [
      { title: "3D Minitoires — World Space" },
      { name: "description", content: "Miniatures for tabletop and printable collectibles." },
      { property: "og:title", content: "3D Minitoires — World Space" },
      { property: "og:description", content: "Miniatures for tabletop and printable collectibles." },
    ],
  }),
  component: () => (
    <HubPage
      title="3D Minitoires"
      subtitle="Tabletop · Printable Miniatures"
      hue={25}
      game="memory"
      description="High-detail miniatures designed for tabletop gaming and resin printing — sculpted and supported in production-ready formats."
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/scriptable")({
  head: () => ({
    meta: [
      { title: "Scriptable Game Design — World Space" },
      { name: "description", content: "Tools, pipelines, and game systems with Python and C++." },
      { property: "og:title", content: "Scriptable Game Design — World Space" },
      { property: "og:description", content: "Tools, pipelines, and game systems with Python and C++." },
    ],
  }),
  component: () => (
    <HubPage
      title="Scriptable Game Design"
      subtitle="Tools · Systems · Code"
      hue={220}
      game="type"
      description="Pipeline tools and game systems. Python for DCC automation; C++ for performance-critical code. Systems thinking for AI-assisted prototyping."
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/rigging")({
  head: () => ({
    meta: [
      { title: "Rigging — World Space" },
      { name: "description", content: "Skeleton, skinning, controls, IK/FK, deformers, kinematics." },
      { property: "og:title", content: "Rigging — World Space" },
      { property: "og:description", content: "Skeleton, skinning, controls, IK/FK, deformers, kinematics." },
    ],
  }),
  component: () => (
    <HubPage
      title="Rigging"
      subtitle="Skeleton · Skin · Controls · IK/FK"
      hue={280}
      game="memory"
      description="Bone/joint placement, skinning and weight painting, control system design, kinematics (IK/FK), deformers, constraint systems, matrix math, and anatomy. Python and C++ tooling."
    />
  ),
});

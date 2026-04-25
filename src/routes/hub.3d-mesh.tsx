import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/HubPage";

export const Route = createFileRoute("/hub/3d-mesh")({
  head: () => ({
    meta: [
      { title: "3D Mesh — World Space" },
      { name: "description", content: "Base mesh, sculpting, retopology, UV, baking, texturing." },
      { property: "og:title", content: "3D Mesh — World Space" },
      { property: "og:description", content: "Base mesh, sculpting, retopology, UV, baking, texturing." },
    ],
  }),
  component: () => (
    <HubPage
      title="3D Mesh"
      subtitle="Sculpt · Retopo · UV · Bake"
      hue={195}
      game="click"
      description="From blockout to production-ready asset. Build base meshes, sculpt high-poly forms, retopologize for performance, unwrap UVs, and bake normals/AO/curvature for texturing."
    />
  ),
});

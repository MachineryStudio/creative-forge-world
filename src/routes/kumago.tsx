import { createFileRoute, redirect } from "@tanstack/react-router";

const KUMAGO_URL = "https://kumago.lighthashi.dev";

export const Route = createFileRoute("/kumago")({
  beforeLoad: () => {
    throw redirect({ href: KUMAGO_URL });
  },
  head: () => ({
    meta: [
      { title: "kumaGO くまご — LIGHTHOUSE 橋" },
      { name: "description", content: "kumaGO くまご — Japanese-English Interactive Tutor." },
      { property: "og:title", content: "kumaGO くまご — LIGHTHOUSE 橋" },
      { property: "og:description", content: "kumaGO くまご — Japanese-English Interactive Tutor." },
    ],
  }),
  component: () => null,
});

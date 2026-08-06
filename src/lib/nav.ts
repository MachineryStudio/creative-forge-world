export type NavGroup = {
  label: string;
  to: string;
  items: string[];
};

export const TECH_ITEMS = [
  "kumaGO 橋 (Japanese-English Interactive Tutor)",
  "engiGO 橋 (Engineering Learning)",
  "radio raiON 雷音 (Interactive Game Radio Station)",
  "brushLabo 橋 Technical Arts",
  "cloudHunters (Animation)",
  "soraGomi (空ゴミ) Band JP-CAN",
  "construcTA 橋 (Civil Engineer Management)",
  "adminTA (Cost-Budget Management)",
];

export const GAMES_ITEMS = [
  "pacifiCA",
  "unidentiFIED",
  "planetUteUS",
  "fistchapterZ",
  "cloudHunters",
  "bananaRain",
  "banditStudios",
];

export const ANIMATION_ITEMS = ["cloudHunters", "soraGomi 空ゴミ", "2D Conceptual", "Minitoires"];
export const TECH_ART_ITEMS = ["brushLabo 橋", "3D Mesh", "Rigging", "Scriptable", "Toolbox"];
export const MUSIC_ITEMS = ["RAION 雷音 Radio", "soraGomi (空ゴミ) Band JP-CAN", "BeatSync Studio"];
export const WORKSHOP_ITEMS = ["Community", "Comics", "2D Creatures", "Open Sessions"];
export const CONSTRUCTION_ITEMS = ["construcTA 橋", "adminTA (Cost-Budget)", "engiGO 橋"];

export const NAV_GROUPS: NavGroup[] = [
  { label: "Tech", to: "/marketplace", items: TECH_ITEMS },
  { label: "Games", to: "/games", items: GAMES_ITEMS },
  { label: "Animation", to: "/hub/2d-conceptual", items: ANIMATION_ITEMS },
  { label: "Tech Art", to: "/hub/3d-mesh", items: TECH_ART_ITEMS },
  { label: "Music", to: "/radioneto", items: MUSIC_ITEMS },
  { label: "Workshop", to: "/community", items: WORKSHOP_ITEMS },
  { label: "Construction", to: "/marketplace", items: CONSTRUCTION_ITEMS },
];

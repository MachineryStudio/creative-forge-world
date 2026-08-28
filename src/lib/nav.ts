export type NavGroup = {
  label: string;
  to: string;
  items: string[];
};

export const EDUCATION_ITEMS = [
  "kumaGO くまご (Japanese-English Interactive Tutor)",
  "engiGO 橋 (Engineering Learning)",
];

export const TECH_ITEMS = [
  "engiGO 橋 (Engineering Learning)",
  "radio raiON 雷音 (Interactive Game Radio Station)",
  "brushLabo 橋 Technical Arts",
  "Voice-Operated SQL (おんせいそうさがた えすきゅーえる)",
  "RAPUSO ラポス",
  "SHISEI PIVOT しせい ぴぼっと",
  "construcTA 橋 (Civil Engineer Management)",
  "adminTA (Cost-Budget Management)",
  "KAWAII TASKU かわいいタスク — LIGHTHOUSE (光塔) Bluetooth Intelligence",
  "REF|FUSE | 概創タンク — Reference Pipeline",
  "NET大創生成器 (NET Daizō Seiseiki)",
  "PromptBridge プロンプトブリッジ",
  "KeiriKanri Studio",
];

export const GAMES_ITEMS = [
  "SUPERMETROID TOOL",
  "SUPERUNKNOWN",
  "PACIFICA",
  "PLANET UTERUS",
  "BANANA RAIN",
  "FIRST CHAPTER ZERO",
  "IRON QUEEN CHESS",
  "HARBOR 橋",
  "RUSTED SKY",
  "BANDIT STUDIOS",
  "11 BIT STUDIOS",
];

export const ANIMATION_ITEMS = ["RUSTED SKY", "2D Conceptual", "Minitoires"];
export const TECH_ART_ITEMS = ["brushLabo 橋", "3D Mesh", "Rigging", "Scriptable", "Toolbox"];
export const MUSIC_ITEMS = ["RAION 雷音 Radio", "KUMORU 「クモル」", "BeatSync Studio", "ONREI 音霊 Virtual Audio Studio"];
export const CONSTRUCTION_ITEMS = ["construcTA 橋", "adminTA (Cost-Budget)", "engiGO 橋"];

/** Optional routes for dropdown items that have a dedicated page. */
export const ITEM_LINKS: Record<string, string> = {
  "radio raiON 雷音 (Interactive Game Radio Station)": "/radioneto",
  "RAION 雷音 Radio": "/radioneto",
  "KUMORU 「クモル」": "/radioneto",
  "BeatSync Studio": "/radioneto",
  "brushLabo 橋": "/hub/3d-mesh",
  "3D Mesh": "/hub/3d-mesh",
  Rigging: "/hub/rigging",
  Scriptable: "/hub/scriptable",
  Toolbox: "/hub/toolbox",
  "2D Conceptual": "/hub/2d-conceptual",
  Minitoires: "/hub/minitoires",
  Comics: "/hub/comics",
  "2D Creatures": "/hub/2d-creatures",
  Community: "/community",
};

export const NAV_GROUPS: NavGroup[] = [
  { label: "Tech", to: "/marketplace", items: TECH_ITEMS },
  { label: "Education", to: "/marketplace", items: EDUCATION_ITEMS },
  { label: "Games", to: "/games", items: GAMES_ITEMS },
  { label: "Animation", to: "/hub/2d-conceptual", items: ANIMATION_ITEMS },
  { label: "Tech Art", to: "/hub/3d-mesh", items: TECH_ART_ITEMS },
  { label: "Music", to: "/radioneto", items: MUSIC_ITEMS },
  { label: "Construction", to: "/marketplace", items: CONSTRUCTION_ITEMS },
  { label: "Contact", to: "/contact", items: ["andre@lighthashi.dev", "Open Roles", "Collaboration"] },
];

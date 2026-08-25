import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "jp" | "fr" | "zh" | "es" | "it" | "ru";
export type Mode = "single" | "bilingual"; // bilingual = JP+EN side by side

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "jp", label: "Japanese", native: "日本" },
  { code: "fr", label: "French", native: "FR" },
  { code: "zh", label: "Mandarin", native: "中文" },
  { code: "es", label: "Spanish", native: "ES" },
  { code: "it", label: "Italian", native: "IT" },
  { code: "ru", label: "Russian", native: "RU" },
];

type Dict = Record<Lang, string>;
const T = (en: string, jp: string, fr: string, zh: string, es: string, it: string, ru: string): Dict => ({
  en, jp, fr, zh, es, it, ru,
});

const INTRO_EN = `Following people who deeply understand video games—whether in technical arts, gameplay mechanics, or character design—has become a cherished hobby of mine.

My life is dedicated to creating: developing my own games, designing levels, crafting animations, building software, and refining technical pipelines and blueprints for construction. This is what fuels me. I’m deeply grateful to all my professors from various universities and countries, whose teachings I continue to explore across languages and cultures.

What I love most, however, is the act of creation itself—including writing my own songs and music. My guitars have been my ears since I was 13 years old. Thank you, Mom, for my first Gibson guitar. And thanks to my childhood drummer and my Canadian Indigenous teacher from Saskatoon. Composing can be painfully beautiful.

As for friends—I have few, but they are deep. Chinese, Korean, French, Japanese, Canadian, American, and my beloved South American friends—you all inspire me. Thank you for fueling the growth of my company and for standing with me as I continue my family’s construction business.

A special thanks to my Japanese Angel’s band—I love you all.

Thank you, everyone, for inspiring my work, my inner world, and my evolution.

Onward—working, fighting, creating, learning, memorizing, and diving deeper.

No judgment. Just help, support, and presence.`;

const INTRO_JP = `ビデオゲームについて深く理解している人々——テクニカルアート、ゲームプレイ、キャラクターデザインなど——を追いかけることは、私の趣味の一つです。

私はゲーム開発、レベルデザイン、アニメーション、ソフトウェア、テクニカルパイプライン、そして建築用のブループリントを作り続けています。それが私の人生そのものです。さまざまな大学や国、言語の教授たちには心から感謝しています。今もなお、その教えに深く潜り続けています。

何より私が愛しているのは、創ることそのものです。そこには自分の歌や音楽も含まれます。13歳の頃から、ギターは私の耳そのものでした。初めてのギブソン・ギターをくれた母に、ありがとう。子供の頃のドラマーの友人、そしてカナダ・サスカトゥーンの先住民族の先生にも感謝しています。曲を作ることは、時にどれほど苦しいか——でもそれもまた美しい。

親友はもちろん少ないけれど、深い絆で結ばれています。中国人、韓国人、フランス人、日本人、カナダ人、アメリカ人、そして愛すべき南米の人々——みんな、ありがとう。あなたたちが私の会社の発展を後押しし、家族経営の建設事業を続ける力を与えてくれています。

特に、私の大好きなJapanese Angel's band——本当に愛しています。

皆さん、私の仕事と内面世界、そして成長を刺激してくれてありがとう。

これからも——働き、戦い、創り、学び、記憶し、そして深く潜り続けます。

判断はしない。ただ助けて、支えて、そばにいるだけ。`;

export const STRINGS = {

  brand: T("CreatureToolBox", "クリーチャーツールボックス", "CreatureToolBox", "生物工具箱", "CreatureToolBox", "CreatureToolBox", "CreatureToolBox"),
  bridge: T("BRIDGE2 · 3D Meshes · Pipeline · Code", "BRIDGE2 · 3Dメッシュ · パイプライン · コード", "BRIDGE2 · Maillages 3D · Pipeline · Code", "BRIDGE2 · 3D网格 · 流水线 · 代码", "BRIDGE2 · Mallas 3D · Pipeline · Código", "BRIDGE2 · Mesh 3D · Pipeline · Codice", "BRIDGE2 · 3D-меши · Пайплайн · Код"),
  tagline: T(
    "Algorithms & pipelines for game characters and creatures.",
    "ゲームのキャラクターとクリーチャーのためのアルゴリズムとパイプライン。",
    "Algorithmes et pipelines pour personnages et créatures de jeux.",
    "用于游戏角色与生物的算法与流水线。",
    "Algoritmos y pipelines para personajes y criaturas de videojuegos.",
    "Algoritmi e pipeline per personaggi e creature di videogiochi.",
    "Алгоритмы и пайплайны для персонажей и существ в играх."
  ),
  intro: T(
    INTRO_EN,
    INTRO_JP,
    INTRO_EN,
    INTRO_EN,
    INTRO_EN,
    INTRO_EN,
    INTRO_EN
  ),

  menu: T("Menu", "メニュー", "Menu", "菜单", "Menú", "Menu", "Меню"),
  pipeline: T("Pipeline", "パイプライン", "Pipeline", "流水线", "Pipeline", "Pipeline", "Пайплайн"),
  tools: T("Tools", "ツール", "Outils", "工具", "Herramientas", "Strumenti", "Инструменты"),
  rigging: T("Rigging", "リギング", "Rigging", "绑定", "Rigging", "Rigging", "Риггинг"),
  artProjects: T("Art Projects", "アートプロジェクト", "Projets Artistiques", "艺术项目", "Proyectos de Arte", "Progetti d'Arte", "Арт-проекты"),
  enter: T("Enter", "入る", "Entrer", "进入", "Entrar", "Entra", "Войти"),
  radio: T("RAION 雷音", "雷音", "RAION 雷音", "雷音", "RAION 雷音", "RAION 雷音", "RAION 雷音"),
  off: T("Off", "オフ", "Arrêt", "关", "Apagado", "Spento", "Выкл"),
  on: T("On", "オン", "Marche", "开", "Encendido", "Acceso", "Вкл"),
  community: T("Community", "コミュニティ", "Communauté", "社区", "Comunidad", "Comunità", "Сообщество"),
  signIn: T("Sign In", "サインイン", "Connexion", "登录", "Iniciar sesión", "Accedi", "Войти"),
  marketplace: T("Marketplace", "マーケット", "Marché", "市集", "Mercado", "Mercato", "Магазин"),
  hub3d: T("3D Mesh", "3Dメッシュ", "Maillage 3D", "3D 网格", "Malla 3D", "Mesh 3D", "3D-меш"),
  hub2dc: T("2D Conceptual", "2Dコンセプト", "2D Conceptuel", "2D 概念", "2D Conceptual", "2D Concettuale", "2D Концепт"),
  hub2dCr: T("2D Creatures", "2Dクリーチャー", "Créatures 2D", "2D 生物", "Criaturas 2D", "Creature 2D", "2D Существа"),
  hubComic: T("Comics-Manga", "漫画", "Comics-Manga", "漫画", "Cómic-Manga", "Fumetti-Manga", "Комиксы-Манга"),
  hubToolbox: T("Technical Toolbox", "ツールボックス", "Boîte à Outils", "技术工具箱", "Caja de Herramientas", "Cassetta degli Strumenti", "Тех. Набор"),
  hubMini: T("3D Minitoires", "3Dミニチュア", "Miniatures 3D", "3D 微缩模型", "Miniaturas 3D", "Miniature 3D", "3D Миниатюры"),
  hubScript: T("Scriptable Game", "スクリプトゲーム", "Jeu Scriptable", "可编程游戏", "Juego Scriptable", "Gioco Scriptable", "Скриптовая игра"),
  hiredProjects: T("Hired Projects", "募集プロジェクト", "Projets Recrutement", "招聘项目", "Proyectos de Contratación", "Progetti di Assunzione", "Проекты найма"),
  openRoles: T("Open Roles", "募集中の役割", "Postes Ouverts", "开放职位", "Roles Abiertos", "Ruoli Aperti", "Открытые роли"),
  apply: T("Apply", "応募する", "Postuler", "申请", "Aplicar", "Candidarsi", "Подать заявку"),
  contact: T("Contact", "お問い合わせ", "Contact", "联系", "Contacto", "Contatto", "Контакты"),
} as const;

export type StringKey = keyof typeof STRINGS;

interface I18nState {
  lang: Lang;
  bilingual: boolean; // when true: show JP + EN. The "lamp ON=white=JP" toggle.
  jpOnly: boolean;   // ON white = all JP, OFF black = all EN (only when bilingual=false)
  setLang: (l: Lang) => void;
  toggleBilingual: () => void;
  toggleJpOnly: () => void;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: "en",
      bilingual: false,
      jpOnly: false,
      setLang: (lang) => set({ lang, bilingual: false }),
      toggleBilingual: () => set((s) => ({ bilingual: !s.bilingual })),
      toggleJpOnly: () => set((s) => ({ jpOnly: !s.jpOnly, bilingual: false })),
    }),
    { name: "ws-i18n" }
  )
);

export function useT() {
  const { lang, bilingual, jpOnly } = useI18n();
  return (key: StringKey) => {
    const dict = STRINGS[key];
    if (bilingual) return `${dict.jp} / ${dict.en}`;
    if (jpOnly) return dict.jp;
    if (lang === "en") return dict.en;
    return dict[lang];
  };
}

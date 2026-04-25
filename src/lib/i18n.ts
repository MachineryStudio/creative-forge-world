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
    "World Space — I focus on algorithms and pipelines to create characters and creatures for video game development. Conceptually, I strive to understand Geometry, Form, Shape, Silhouette, Morphology, Phylogeny, Textures, and more properties of common and uncharted new life in video game prototyping including AI tools.",
    "ワールドスペース ― ビデオゲーム開発のためのキャラクターとクリーチャーを生み出すアルゴリズムとパイプラインに注力しています。概念的には、ジオメトリ、フォルム、シェイプ、シルエット、形態、系統発生、テクスチャなど、ゲームプロトタイピングにおける既知と未知の生命の特性を、AIツールも含めて理解することを目指しています。",
    "World Space — Je me concentre sur les algorithmes et les pipelines pour créer des personnages et créatures pour le développement de jeux vidéo. Je cherche à comprendre la géométrie, la forme, la silhouette, la morphologie, la phylogénie, les textures et d'autres propriétés du vivant connu et inconnu, outils d'IA inclus.",
    "World Space — 我专注于为电子游戏开发角色和生物的算法与流水线。 概念上,我努力理解几何、形态、轮廓、形貌、系统发育、纹理,以及在游戏原型设计(包括 AI 工具)中熟悉与未知生命的更多属性。",
    "World Space — Me dedico a algoritmos y pipelines para crear personajes y criaturas para el desarrollo de videojuegos. Busco entender geometría, forma, silueta, morfología, filogenia, texturas y más propiedades de la vida conocida y desconocida en el prototipado de videojuegos, incluidas herramientas de IA.",
    "World Space — Mi occupo di algoritmi e pipeline per creare personaggi e creature per lo sviluppo di videogiochi. Cerco di comprendere geometria, forma, silhouette, morfologia, filogenesi, texture e altre proprietà della vita nota e sconosciuta nel prototipazione di videogiochi, inclusi gli strumenti di IA.",
    "World Space — Я занимаюсь алгоритмами и пайплайнами для создания персонажей и существ в разработке видеоигр. Стремлюсь понять геометрию, форму, силуэт, морфологию, филогенез, текстуры и другие свойства известной и неизведанной жизни в прототипировании игр, включая ИИ-инструменты."
  ),
  menu: T("Menu", "メニュー", "Menu", "菜单", "Menú", "Menu", "Меню"),
  pipeline: T("Pipeline", "パイプライン", "Pipeline", "流水线", "Pipeline", "Pipeline", "Пайплайн"),
  tools: T("Tools", "ツール", "Outils", "工具", "Herramientas", "Strumenti", "Инструменты"),
  rigging: T("Rigging", "リギング", "Rigging", "绑定", "Rigging", "Rigging", "Риггинг"),
  artProjects: T("Art Projects", "アートプロジェクト", "Projets Artistiques", "艺术项目", "Proyectos de Arte", "Progetti d'Arte", "Арт-проекты"),
  enter: T("Enter", "入る", "Entrer", "进入", "Entrar", "Entra", "Войти"),
  radio: T("RadioNerd", "ラジオナード", "RadioNerd", "电台 Nerd", "RadioNerd", "RadioNerd", "RadioNerd"),
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

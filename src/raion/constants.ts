import { Language, Genre } from './types';

export const GENRES: Genre[] = [
  {
    id: 'vkei',
    name: { [Language.EN]: 'Visual Kei', [Language.JA]: 'ヴィジュアル系', [Language.ES]: 'Visual Kei', [Language.FR]: 'Visual Kei' },
    description: { [Language.EN]: 'Theatrical rock from Japan.', [Language.JA]: '日本のシアトリカルなロック。' },
    icon: 'Sparkles',
    color: '#ff00ff',
    gradient: 'from-purple-900 to-pink-900',
  },
  {
    id: 'jrock',
    name: { [Language.EN]: 'Japanese Rock', [Language.JA]: '日本製ロック', [Language.ES]: 'Rock Japonés', [Language.FR]: 'Rock Japonais' },
    description: { [Language.EN]: 'High energy rock from the rising sun.', [Language.JA]: '日出ずる国の高エネルギーロック。' },
    icon: 'RadioHigh',
    color: '#ff0000',
    gradient: 'from-red-900 to-black',
  },
  {
    id: 'jpop',
    name: { [Language.EN]: 'J-Pop', [Language.JA]: 'Jポップ', [Language.ES]: 'J-Pop', [Language.FR]: 'J-Pop' },
    description: { [Language.EN]: 'Japanese popular music.', [Language.JA]: '日本のポピュラー音楽。' },
    icon: 'Music',
    color: '#00ffff',
    gradient: 'from-cyan-900 to-blue-900',
  },
  {
    id: 'kpop',
    name: { [Language.EN]: 'K-Pop', [Language.JA]: 'Kポップ', [Language.ES]: 'K-Pop', [Language.FR]: 'K-Pop' },
    description: { [Language.EN]: 'Korean popular music.', [Language.JA]: '韓国のポピュラー音楽。' },
    icon: 'Star',
    color: '#ff69b4',
    gradient: 'from-pink-800 to-purple-800',
  },
  {
    id: 'anime',
    name: { [Language.EN]: 'Anime Music', [Language.JA]: 'アニメソング', [Language.ES]: 'Música de Anime', [Language.FR]: 'Musique d\'Anime' },
    description: { [Language.EN]: 'Iconic themes from your favorite anime.', [Language.JA]: 'お気に入りのアニメの象徴的なテーマ。' },
    icon: 'Tv',
    color: '#ffff00',
    gradient: 'from-yellow-900 to-orange-900',
  },
  // ... adding more as needed, but let's stick to these for initial implementation
];

export const LANGUAGES = [
  { code: Language.EN, name: 'English' },
  { code: Language.JA, name: '日本語' },
  { code: Language.FR, name: 'Français' },
  { code: Language.ES, name: 'Español' },
  { code: Language.IT, name: 'Italiano' },
  { code: Language.KO, name: '한국어' },
  { code: Language.ZH, name: '中文' },
];

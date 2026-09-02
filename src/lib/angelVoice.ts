/**
 * Angel's Fate — Japanese voice bank.
 * Phrases are organized by game event so each moment of play
 * triggers a fitting native-Japanese line.
 */

export interface AngelLine {
  /** Japanese text spoken + shown */
  jp: string;
  /** English gloss for subtitles */
  en: string;
  /** voice tuning */
  pitch?: number;
  rate?: number;
}

export const ANGEL_VOICE = {
  /** Giggle tease — multi-kill with the water sphere, or boss takes a hit */
  tease: [
    {
      jp: "くすくす…女の子に負けたの？",
      en: "Kusukusu… lost to a girl?",
      pitch: 1.5,
      rate: 1.05,
    },
  ] as AngelLine[],

  /** Small cheer — level up */
  cheer: [
    { jp: "やった！", en: "I did it!", pitch: 1.5, rate: 1.1 },
  ] as AngelLine[],

  /** Big cheer — boss defeated */
  bigCheer: [
    { jp: "やった、やった！", en: "I did it, I did it!", pitch: 1.55, rate: 1.15 },
  ] as AngelLine[],

  /** Victory declaration — game won */
  victory: [
    { jp: "私の勝ちね", en: "This win is mine.", pitch: 1.4, rate: 1.0 },
    { jp: "やった！", en: "Victory cheer!", pitch: 1.5, rate: 1.1 },
  ] as AngelLine[],

  /** Special thank-you — registered players (Andore love you) */
  love: [
    {
      jp: "アンドレ、大好き！",
      en: "Andre, love you!",
      pitch: 1.5,
      rate: 1.0,
    },
  ] as AngelLine[],
};

export type AngelMood = keyof typeof ANGEL_VOICE;

/** Picks a line from a mood bucket. */
export function angelLine(mood: AngelMood): AngelLine {
  const pool = ANGEL_VOICE[mood];
  return pool[Math.floor(Math.random() * pool.length)];
}

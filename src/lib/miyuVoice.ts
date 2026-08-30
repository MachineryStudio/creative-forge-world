/**
 * MIYU native-Japanese voice bank.
 * The uploaded TTS recording was split on silence into individual words,
 * so MIYU can speak one short word at a time instead of a long take.
 *
 * `text` labels are shown in her speech bubble. Update them to match the
 * real spoken word for each slot.
 */

export interface MiyuWord {
  /** clip index in /audio/miyu/ */
  id: number;
  src: string;
  /** Japanese text shown while the clip plays */
  text: string;
  /** English gloss */
  en: string;
  /** rough tone, used to pick a fitting reaction */
  mood: "greet" | "praise" | "cheer" | "thanks" | "curious" | "bye";
}

const clip = (n: number) => `/audio/miyu/w${String(n).padStart(2, "0")}.mp3`;

/** Ordered exactly as spoken in the source recording. */
export const MIYU_WORDS: MiyuWord[] = [
  { id: 1, src: clip(1), text: "かわいい", en: "Cute", mood: "praise" },
  { id: 2, src: clip(2), text: "にこにこ", en: "Smiling", mood: "greet" },
  { id: 3, src: clip(3), text: "わくわく", en: "So excited", mood: "cheer" },
  { id: 4, src: clip(4), text: "うきうき", en: "Cheerful", mood: "cheer" },
  { id: 5, src: clip(5), text: "きらきら", en: "Sparkling", mood: "praise" },
  { id: 6, src: clip(6), text: "ぴかぴか", en: "Gleaming", mood: "praise" },
  { id: 7, src: clip(7), text: "ふわふわ", en: "Fluffy-soft", mood: "curious" },
  { id: 8, src: clip(8), text: "もふもふ", en: "Fluffy", mood: "curious" },
  { id: 9, src: clip(9), text: "だいすき", en: "I love it", mood: "praise" },
  { id: 10, src: clip(10), text: "ときめき", en: "Heart-flutter", mood: "curious" },
  { id: 11, src: clip(11), text: "さくら", en: "Cherry blossom", mood: "curious" },
  { id: 12, src: clip(12), text: "こもれび", en: "Sunlight through leaves", mood: "curious" },
  { id: 13, src: clip(13), text: "にゃん", en: "Meow", mood: "greet" },
  { id: 14, src: clip(14), text: "ぴよ", en: "Peep", mood: "greet" },
  { id: 15, src: clip(15), text: "きゅん", en: "Heart-squeeze", mood: "thanks" },
  { id: 16, src: clip(16), text: "ぷり", en: "Puri", mood: "curious" },
  { id: 17, src: clip(17), text: "ぽんぽん", en: "Pom-pom", mood: "cheer" },
  { id: 18, src: clip(18), text: "ちび", en: "Tiny chibi", mood: "praise" },
  { id: 19, src: clip(19), text: "あまい", en: "Sweet", mood: "praise" },
  { id: 20, src: clip(20), text: "たのしい", en: "So fun", mood: "cheer" },
  { id: 21, src: clip(21), text: "こころ", en: "Heart", mood: "thanks" },
  { id: 22, src: clip(22), text: "ぺったんこ", en: "Pettanko", mood: "bye" },
];

export const byMood = (mood: MiyuWord["mood"]) =>
  MIYU_WORDS.filter((w) => w.mood === mood);

let audio: HTMLAudioElement | null = null;
let lastId = -1;
let muted = false;

export const setMiyuMuted = (v: boolean) => {
  muted = v;
  if (v && audio) audio.pause();
};
export const isMiyuMuted = () => muted;

/** Plays a single word clip. Returns the word so the UI can show its text. */
export function speakMiyu(word: MiyuWord): MiyuWord {
  if (typeof window === "undefined" || muted) return word;
  if (!audio) audio = new Audio();
  try {
    audio.pause();
    audio.src = word.src;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  } catch {
    /* autoplay may be blocked until first interaction */
  }
  return word;
}

/** Picks a non-repeating word from a mood bucket and speaks it. */
export function speakMood(mood: MiyuWord["mood"]): MiyuWord {
  const pool = byMood(mood).filter((w) => w.id !== lastId);
  const list = pool.length ? pool : byMood(mood);
  const word = list[Math.floor(Math.random() * list.length)] ?? MIYU_WORDS[0];
  lastId = word.id;
  return speakMiyu(word);
}

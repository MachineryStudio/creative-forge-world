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
  { id: 1, src: clip(1), text: "こんにちは", en: "Hello", mood: "greet" },
  { id: 2, src: clip(2), text: "はじめまして", en: "Nice to meet you", mood: "greet" },
  { id: 3, src: clip(3), text: "いらっしゃいませ", en: "Welcome", mood: "greet" },
  { id: 4, src: clip(4), text: "すごい", en: "Amazing", mood: "praise" },
  { id: 5, src: clip(5), text: "かわいい", en: "Cute", mood: "praise" },
  { id: 6, src: clip(6), text: "かっこいい", en: "Cool", mood: "praise" },
  { id: 7, src: clip(7), text: "がんばって", en: "Do your best", mood: "cheer" },
  { id: 8, src: clip(8), text: "だいじょうぶ", en: "It's okay", mood: "cheer" },
  { id: 9, src: clip(9), text: "いいね", en: "Nice", mood: "praise" },
  { id: 10, src: clip(10), text: "ありがとう", en: "Thank you", mood: "thanks" },
  { id: 11, src: clip(11), text: "よろしく", en: "Pleased to help", mood: "greet" },
  { id: 12, src: clip(12), text: "おもしろい", en: "Interesting", mood: "curious" },
  { id: 13, src: clip(13), text: "うん", en: "Mhm", mood: "curious" },
  { id: 14, src: clip(14), text: "ほんとう?", en: "Really?", mood: "curious" },
  { id: 15, src: clip(15), text: "なに?", en: "What's this?", mood: "curious" },
  { id: 16, src: clip(16), text: "どうぞ", en: "Go ahead", mood: "greet" },
  { id: 17, src: clip(17), text: "たのしい", en: "This is fun", mood: "praise" },
  { id: 18, src: clip(18), text: "やった", en: "Yay!", mood: "cheer" },
  { id: 19, src: clip(19), text: "そうだね", en: "That's right", mood: "curious" },
  { id: 20, src: clip(20), text: "きをつけて", en: "Take care", mood: "bye" },
  { id: 21, src: clip(21), text: "またね", en: "See you", mood: "bye" },
  { id: 22, src: clip(22), text: "おつかれさま", en: "Good work", mood: "bye" },
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

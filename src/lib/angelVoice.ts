/**
 * Angel's Fate — native Japanese/English voice bank.
 * The uploaded recording was split on silence into individual clips,
 * so each game event plays the exact spoken phrase instead of robot TTS.
 */

export interface AngelClip {
  id: number;
  src: string;
  jp: string;
  en: string;
  duration: number; // seconds
}

const clip = (n: number) => `/audio/angel/a${String(n).padStart(2, "0")}.mp3`;

/** Clips in the order they appear in the uploaded recording. */
export const ANGEL_CLIPS: AngelClip[] = [
  {
    id: 1,
    src: clip(1),
    jp: "くすくす…女の子に負けたの？",
    en: "Kusukusu… lost to a girl?",
    duration: 1.75,
  },
  {
    id: 2,
    src: clip(2),
    jp: "やった！",
    en: "I did it!",
    duration: 1.61,
  },
  {
    id: 3,
    src: clip(3),
    jp: "やった、やった！",
    en: "I did it, I did it!",
    duration: 2.02,
  },
  {
    id: 4,
    src: clip(4),
    jp: "私の勝ちね",
    en: "This win is mine.",
    duration: 1.27,
  },
  {
    id: 5,
    src: clip(5),
    jp: "アンドレ、大好き！",
    en: "Andre, love you!",
    duration: 1.56,
  },
];

export const ANGEL_VOICE = {
  /** Giggle tease — multi-kill with the water sphere, or boss takes a hit */
  tease: [ANGEL_CLIPS[0]],
  /** Small cheer — level up or a single kill */
  cheer: [ANGEL_CLIPS[1]],
  /** Big cheer — boss defeated */
  bigCheer: [ANGEL_CLIPS[2]],
  /** Victory declaration — game won */
  victory: [ANGEL_CLIPS[3]],
  /** Special thank-you — registered players */
  love: [ANGEL_CLIPS[4]],
};

export type AngelMood = keyof typeof ANGEL_VOICE;

/** Picks a line from a mood bucket. */
export function angelLine(mood: AngelMood): AngelClip {
  const pool = ANGEL_VOICE[mood];
  return pool[Math.floor(Math.random() * pool.length)];
}

let audio: HTMLAudioElement | null = null;
let muted = false;

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
  }
  return audio;
}

export const setAngelMuted = (v: boolean) => {
  muted = v;
  if (v && audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
export const isAngelMuted = () => muted;

/**
 * Plays a native Angel clip and drives the subtitle bar via the audio
 * element's real playback events. Returns a Promise that resolves when the
 * clip finishes (or immediately if it fails).
 */
export function speakAngel(
  mood: AngelMood,
  setSubtitle: (s: { en: string; jp: string } | null) => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || muted) {
      resolve();
      return;
    }
    const line = angelLine(mood);
    const a = ensureAudio();

    const clear = () => {
      setSubtitle(null);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onEnded);
      a.removeEventListener("pause", onPause);
      resolve();
    };

    const onEnded = () => clear();
    const onPause = () => {
      if (a.ended || a.currentTime >= a.duration - 0.05) clear();
    };

    a.addEventListener("ended", onEnded, { once: true });
    a.addEventListener("error", onEnded, { once: true });
    a.addEventListener("pause", onPause, { once: true });

    a.pause();
    a.src = line.src;
    a.currentTime = 0;

    // Subtitle shows as soon as playback actually begins.
    const onPlay = () => {
      setSubtitle({ en: line.en, jp: line.jp });
      a.removeEventListener("playing", onPlay);
    };
    a.addEventListener("playing", onPlay, { once: true });

    void a.play().catch(() => {
      setSubtitle(null);
      resolve();
    });
  });
}

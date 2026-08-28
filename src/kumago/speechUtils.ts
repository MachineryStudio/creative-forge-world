// @ts-nocheck
// ─── Voice cache ─────────────────────────────────────────────────────────────
let _voiceCache = null;

export function loadVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      _voiceCache = voices;
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        _voiceCache = window.speechSynthesis.getVoices();
        resolve(_voiceCache);
      };
    }
  });
}

// ─── Voice maps ───────────────────────────────────────────────────────────────
const LANG_CODES = {
  en: ['en-US', 'en-GB'],
  ja: ['ja-JP'],
  fr: ['fr-FR'],
  zh: ['zh-CN', 'zh-TW'],
  ko: ['ko-KR'],
  es: ['es-ES', 'es-MX'],
};

// Ordered priority lists — first match wins
const VOICE_PRIORITY = {
  ja: ['Google 日本語', 'Kyoko', 'O-ren', 'Microsoft Haruka', 'Haruka', 'Hattori'],
  en: ['Google US English', 'Samantha', 'Google UK English Female', 'Microsoft Zira', 'Victoria', 'Karen'],
  fr: ['Google français', 'Amelie', 'Microsoft Julie', 'Marie'],
  zh: ['Google 普通话（中国大陆）', 'Ting-Ting', 'Microsoft Huihui', 'Mei-Jia'],
  ko: ['Google 한국의', 'Yuna', 'Microsoft Heami'],
  es: ['Google español', 'Paulina', 'Monica', 'Microsoft Laura'],
};

const TTS_SETTINGS = {
  ja: { rate: 0.88, pitch: 1.1 },
  en: { rate: 0.93, pitch: 1.05 },
  fr: { rate: 0.93, pitch: 1.05 },
  zh: { rate: 0.88, pitch: 1.1 },
  ko: { rate: 0.9,  pitch: 1.1 },
  es: { rate: 0.93, pitch: 1.05 },
};

function pickVoice(lang) {
  const voices = _voiceCache || window.speechSynthesis.getVoices();
  const codes  = LANG_CODES[lang] || LANG_CODES.en;
  const prio   = VOICE_PRIORITY[lang] || [];

  // Tier 1: priority name list
  for (const name of prio) {
    const v = voices.find(v => v.name.includes(name) && codes.some(c => v.lang.startsWith(c.substring(0,2))));
    if (v) return v;
  }
  // Tier 2: premium/enhanced/neural label
  const premium = voices.find(v =>
    codes.some(c => v.lang.startsWith(c.substring(0,2))) &&
    /(premium|enhanced|neural)/i.test(v.name)
  );
  if (premium) return premium;
  // Tier 3: any matching language
  return voices.find(v => codes.some(c => v.lang.startsWith(c.substring(0,2)))) || null;
}

// ─── Core speak helper ────────────────────────────────────────────────────────
function _speak(text, lang, onEnd) {
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.lang   = (LANG_CODES[lang] || ['en-US'])[0];
  const cfg = TTS_SETTINGS[lang] || TTS_SETTINGS.en;
  u.rate   = cfg.rate;
  u.pitch  = cfg.pitch;
  u.volume = 1.0;

  // Chrome 15-second keep-alive
  let keepAlive;
  u.onstart = () => {
    keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
  };
  u.onend   = () => { clearInterval(keepAlive); onEnd?.(); };
  u.onerror = () => { clearInterval(keepAlive); onEnd?.(); };

  window.speechSynthesis.speak(u);
}

// ─── Japanese TTS (used by SpeakButton & conjugation views) ──────────────────
// Returns true if a NATIVE Japanese voice was used, false if none is available
// on the device (so the caller can fall back to server-generated speech).
export async function speakJapanese(text, onEnd) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return false; }
  await loadVoices();
  const voice = pickVoice('ja');
  if (!voice) { onEnd?.(); return false; }
  window.speechSynthesis.cancel();
  _speak(text, 'ja', onEnd);
  return true;
}

// ─── Mixed-language TTS (used by MiyuChat) ────────────────────────────────────
// Splits text on Japanese character boundaries so Japanese words are spoken
// with a native ja-JP voice even when the UI language is English/French/etc.
const JP_RE = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9fff]+/;

function segmentText(text, uiLang) {
  if (uiLang === 'ja') return [{ text, lang: 'ja' }]; // already all-Japanese

  const segments = [];
  let remaining = text;
  const split = new RegExp(`(${JP_RE.source}+)`, 'g');
  let last = 0;

  for (const m of text.matchAll(new RegExp(`(${JP_RE.source}+)`, 'g'))) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), lang: uiLang });
    segments.push({ text: m[0], lang: 'ja' });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), lang: uiLang });
  return segments.filter(s => s.text.trim());
}

export async function speakLocalized(text, uiLang, onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  await loadVoices();

  const segments = segmentText(text, uiLang || 'en');

  let i = 0;
  function next() {
    if (i >= segments.length) { onEnd?.(); return; }
    const seg = segments[i++];
    _speak(seg.text, seg.lang, next);
  }
  next();
}

// ─── Speech recognition ───────────────────────────────────────────────────────
export function startRecognition(onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { onError?.('Speech recognition not supported'); return null; }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event) => {
    const results = [];
    for (let i = 0; i < event.results[0].length; i++) {
      results.push({ transcript: event.results[0][i].transcript, confidence: event.results[0][i].confidence });
    }
    onResult?.(results);
  };
  recognition.onerror = (event) => onError?.(event.error);
  recognition.start();
  return recognition;
}

// ─── Pre-warm on module load ──────────────────────────────────────────────────
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices().catch(() => {});
}
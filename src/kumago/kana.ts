// Minimal romaji <-> hiragana conversion helpers for the kumaGO verb data.

const ROMAJI_TO_KANA: Array<[string, string]> = [
  ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'], ['shi', 'し'],
  ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'], ['ji', 'じ'],
  ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'], ['chi', 'ち'],
  ['tsu', 'つ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'],
  ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'],
  ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['fu', 'ふ'],
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'], ['ge', 'げ'], ['go', 'ご'],
  ['sa', 'さ'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['za', 'ざ'], ['zu', 'ず'], ['ze', 'ぜ'], ['zo', 'ぞ'],
  ['ta', 'た'], ['te', 'て'], ['to', 'と'],
  ['da', 'だ'], ['de', 'で'], ['do', 'ど'], ['di', 'ぢ'], ['du', 'づ'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wo', 'を'],
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'],
  ['n', 'ん'],
];

const KANA_TO_ROMAJI: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [r, k] of ROMAJI_TO_KANA) {
    if (!(k in map)) map[k] = r;
  }
  return map;
})();

/** Convert a romaji string into hiragana (best effort). */
export function romaji2kana(input: string): string {
  if (!input) return '';
  let s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    // small tsu (double consonant, not "nn")
    const c = s[i];
    const next = s[i + 1];
    if (c && next && c === next && /[bcdfghjkmprstwyz]/.test(c)) {
      out += 'っ';
      i += 1;
      continue;
    }
    let matched = false;
    for (const len of [3, 2, 1]) {
      const chunk = s.slice(i, i + len);
      const hit = ROMAJI_TO_KANA.find(([r]) => r === chunk);
      if (hit) {
        out += hit[1];
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += c ?? '';
      i += 1;
    }
  }
  return out;
}

/** Convert a hiragana string into romaji (best effort). */
export function kana2romaji(input: string): string {
  if (!input) return '';
  let out = '';
  let i = 0;
  let pendingSokuon = false;
  while (i < input.length) {
    const two = input.slice(i, i + 2);
    const one = input[i] as string;
    if (one === 'っ') {
      pendingSokuon = true;
      i += 1;
      continue;
    }
    let romaji: string | undefined;
    let step = 1;
    if (two.length === 2 && KANA_TO_ROMAJI[two]) {
      romaji = KANA_TO_ROMAJI[two];
      step = 2;
    } else if (KANA_TO_ROMAJI[one]) {
      romaji = KANA_TO_ROMAJI[one];
    }
    if (romaji === undefined) {
      out += one;
      i += 1;
      pendingSokuon = false;
      continue;
    }
    if (pendingSokuon) {
      out += romaji[0];
      pendingSokuon = false;
    }
    out += romaji;
    i += step;
  }
  if (pendingSokuon) out += 'tsu';
  return out;
}

export default { romaji2kana, kana2romaji };

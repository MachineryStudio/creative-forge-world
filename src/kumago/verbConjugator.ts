// @ts-nocheck
// Deterministic Japanese verb conjugation engine.
// Given { dictionary, hiragana, romaji, meaning_en, group, level } returns a
// full verb record with `forms` (kanji + okurigana) and `forms_romaji`.

import { kana2romaji } from './kana';

// Godan: final kana → { a, i, e, o rows, te, ta endings }
const GODAN = {
  'う': { a: 'わ', i: 'い', e: 'え', o: 'お', te: 'って', ta: 'った' },
  'く': { a: 'か', i: 'き', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
  'ぐ': { a: 'が', i: 'ぎ', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
  'す': { a: 'さ', i: 'し', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
  'つ': { a: 'た', i: 'ち', e: 'て', o: 'と', te: 'って', ta: 'った' },
  'ぬ': { a: 'な', i: 'に', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
  'ぶ': { a: 'ば', i: 'び', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
  'む': { a: 'ま', i: 'み', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
  'る': { a: 'ら', i: 'り', e: 'れ', o: 'ろ', te: 'って', ta: 'った' },
};

function hasKanji(s) {
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(s);
}

// Split a dictionary form into kanjiRoot + okurigana, and find the kana
// reading of the kanjiRoot (so we can rebuild kanji forms from hiragana ones).
function buildKanjiMap(dictionary, hiragana) {
  if (!hasKanji(dictionary)) return null;
  let i = dictionary.length - 1;
  while (i >= 0 && !hasKanji(dictionary[i])) i--;
  if (i < 0) return null;
  const splitAt = i + 1;
  const kanjiRoot = dictionary.slice(0, splitAt);
  const okurigana = dictionary.slice(splitAt); // trailing hiragana run
  const kanaRoot = hiragana.slice(0, Math.max(0, hiragana.length - okurigana.length));
  return { kanjiRoot, kanaRoot };
}

function toKanji(kanaForm, kanjiMap) {
  if (!kanjiMap) return kanaForm;
  const { kanjiRoot, kanaRoot } = kanjiMap;
  if (kanaRoot && kanaForm.startsWith(kanaRoot)) {
    return kanjiRoot + kanaForm.slice(kanaRoot.length);
  }
  return kanaForm;
}

// Build all 20 hiragana conjugations.
function conjugateHiragana(verb) {
  const { group, hiragana, dictionary } = verb;
  const f = {};

  if (group === 'irregular') {
    if (dictionary === 'する' || verb.romaji === 'suru') {
      Object.assign(f, {
        present: 'する', present_polite: 'します', past: 'した', past_polite: 'しました',
        negative: 'しない', negative_polite: 'しません', neg_past: 'しなかった', neg_past_polite: 'しませんでした',
        te_form: 'して', neg_te: 'しなくて', ing_form: 'している', tai_form: 'したい',
        potential: 'できる', potential_neg: 'できない', volitional: 'しよう', passive: 'される',
        causative: 'させる', imperative: 'しろ', conditional: 'すれば', conditional_neg: 'しなければ',
      });
    } else {
      Object.assign(f, {
        present: 'くる', present_polite: 'きます', past: 'きた', past_polite: 'きました',
        negative: 'こない', negative_polite: 'きません', neg_past: 'こなかった', neg_past_polite: 'きませんでした',
        te_form: 'きて', neg_te: 'こなくて', ing_form: 'きている', tai_form: 'きたい',
        potential: 'こられる', potential_neg: 'こられない', volitional: 'こよう', passive: 'こられる',
        causative: 'こさせる', imperative: 'こい', conditional: 'くれば', conditional_neg: 'こなければ',
      });
    }
    return f;
  }

  if (group === 'ichidan') {
    const stem = hiragana.slice(0, -1); // drop る
    Object.assign(f, {
      present: stem + 'る', present_polite: stem + 'ます', past: stem + 'た', past_polite: stem + 'ました',
      negative: stem + 'ない', negative_polite: stem + 'ません', neg_past: stem + 'なかった', neg_past_polite: stem + 'ませんでした',
      te_form: stem + 'て', neg_te: stem + 'なくて', ing_form: stem + 'ている', tai_form: stem + 'たい',
      potential: stem + 'られる', potential_neg: stem + 'られない', volitional: stem + 'よう', passive: stem + 'られる',
      causative: stem + 'させる', imperative: stem + 'ろ', conditional: stem + 'れば', conditional_neg: stem + 'なければ',
    });
    return f;
  }

  // godan
  const h = hiragana;
  const last = h[h.length - 1];
  const end = GODAN[last];
  const stem = h.slice(0, -1);

  f.present = hiragana;
  f.present_polite = stem + end.i + 'ます';
  f.past = stem + end.ta;
  f.past_polite = stem + end.i + 'ました';
  f.negative = (verb.romaji === 'aru') ? 'ない' : (stem + end.a + 'ない');
  f.negative_polite = (verb.romaji === 'aru') ? 'ありません' : (stem + end.i + 'ません');
  f.neg_past = (verb.romaji === 'aru') ? 'なかった' : (stem + end.a + 'なかった');
  f.neg_past_polite = (verb.romaji === 'aru') ? 'ありませんでした' : (stem + end.i + 'ませんでした');
  f.te_form = stem + end.te;
  f.neg_te = stem + end.a + 'なくて';
  f.ing_form = stem + end.te + 'いる';
  f.tai_form = stem + end.i + 'たい';
  f.potential = (verb.romaji === 'aru') ? '' : (stem + end.e + 'る');
  f.potential_neg = (verb.romaji === 'aru') ? '' : (stem + end.e + 'ない');
  f.volitional = stem + end.o + 'う';
  f.passive = stem + end.a + 'れる';
  f.causative = stem + end.a + 'せる';
  f.imperative = stem + end.e;
  f.conditional = stem + end.e + 'ば';
  f.conditional_neg = stem + end.a + 'なければ';

  // 行く etc. te/past exceptions
  if (dictionary === '行く' || verb.romaji === 'iku') {
    f.te_form = stem + 'って';
    f.past = stem + 'った';
  }
  return f;
}

export function conjugate(verb) {
  const kanjiMap = buildKanjiMap(verb.dictionary, verb.hiragana);
  const hForms = conjugateHiragana(verb);

  const forms = {};
  const forms_romaji = {};
  for (const key in hForms) {
    forms[key] = toKanji(hForms[key], kanjiMap);
    forms_romaji[key] = kana2romaji(hForms[key]);
  }

  return {
    dictionary: verb.dictionary,
    hiragana: verb.hiragana,
    romaji: verb.romaji,
    meaning_en: verb.meaning_en,
    group: verb.group,
    level: verb.level,
    forms,
    forms_romaji,
    example_sentence: '',
    example_sentence_en: '',
  };
}
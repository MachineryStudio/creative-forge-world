// @ts-nocheck
// 500 most important Japanese verbs with full conjugation data
// Forms: present(plain), present_polite, past, past_polite, negative, negative_polite,
//        neg_past, neg_past_polite, te_form, neg_te, ing_form, tai_form,
//        potential, potential_neg, volitional, passive, causative, imperative,
//        conditional, conditional_neg
// forms_romaji mirrors the same keys

import { conjugate } from './verbConjugator';
import { newVerbs } from './newVerbs';

export const verbData = [
  // ===== N5 VERBS =====
  {
    dictionary:"食べる",hiragana:"たべる",romaji:"taberu",meaning_en:"to eat",group:"ichidan",level:"N5",
    forms:{present:"食べる",present_polite:"食べます",past:"食べた",past_polite:"食べました",negative:"食べない",negative_polite:"食べません",neg_past:"食べなかった",neg_past_polite:"食べませんでした",te_form:"食べて",neg_te:"食べなくて",ing_form:"食べている",tai_form:"食べたい",potential:"食べられる",potential_neg:"食べられない",volitional:"食べよう",passive:"食べられる",causative:"食べさせる",imperative:"食べろ",conditional:"食べれば",conditional_neg:"食べなければ"},
    forms_romaji:{present:"taberu",present_polite:"tabemasu",past:"tabeta",past_polite:"tabemashita",negative:"tabenai",negative_polite:"tabemasen",neg_past:"tabenakatta",neg_past_polite:"tabemasen deshita",te_form:"tabete",neg_te:"tabenakute",ing_form:"tabete iru",tai_form:"tabetai",potential:"taberareru",potential_neg:"taberarenai",volitional:"tabeyou",passive:"taberareru",causative:"tabesaseru",imperative:"tabero",conditional:"tabereba",conditional_neg:"tabenakereba"},
    example_sentence:"毎日ご飯を食べます。",example_sentence_en:"I eat rice every day."
  },
  {
    dictionary:"飲む",hiragana:"のむ",romaji:"nomu",meaning_en:"to drink",group:"godan",level:"N5",
    forms:{present:"飲む",present_polite:"飲みます",past:"飲んだ",past_polite:"飲みました",negative:"飲まない",negative_polite:"飲みません",neg_past:"飲まなかった",neg_past_polite:"飲みませんでした",te_form:"飲んで",neg_te:"飲まなくて",ing_form:"飲んでいる",tai_form:"飲みたい",potential:"飲める",potential_neg:"飲めない",volitional:"飲もう",passive:"飲まれる",causative:"飲ませる",imperative:"飲め",conditional:"飲めば",conditional_neg:"飲まなければ"},
    forms_romaji:{present:"nomu",present_polite:"nomimasu",past:"nonda",past_polite:"nomimashita",negative:"nomanai",negative_polite:"nomimasen",neg_past:"nomanakatta",neg_past_polite:"nomimasen deshita",te_form:"nonde",neg_te:"nomanakute",ing_form:"nonde iru",tai_form:"nomitai",potential:"nomeru",potential_neg:"nomenai",volitional:"nomou",passive:"nomareru",causative:"nomaseru",imperative:"nome",conditional:"nomeba",conditional_neg:"nomanakereba"},
    example_sentence:"水を飲みたいです。",example_sentence_en:"I want to drink water."
  },
  {
    dictionary:"行く",hiragana:"いく",romaji:"iku",meaning_en:"to go",group:"godan",level:"N5",
    forms:{present:"行く",present_polite:"行きます",past:"行った",past_polite:"行きました",negative:"行かない",negative_polite:"行きません",neg_past:"行かなかった",neg_past_polite:"行きませんでした",te_form:"行って",neg_te:"行かなくて",ing_form:"行っている",tai_form:"行きたい",potential:"行ける",potential_neg:"行けない",volitional:"行こう",passive:"行かれる",causative:"行かせる",imperative:"行け",conditional:"行けば",conditional_neg:"行かなければ"},
    forms_romaji:{present:"iku",present_polite:"ikimasu",past:"itta",past_polite:"ikimashita",negative:"ikanai",negative_polite:"ikimasen",neg_past:"ikanakatta",neg_past_polite:"ikimasen deshita",te_form:"itte",neg_te:"ikanakute",ing_form:"itte iru",tai_form:"ikitai",potential:"ikeru",potential_neg:"ikenai",volitional:"ikou",passive:"ikareru",causative:"ikaseru",imperative:"ike",conditional:"ikeba",conditional_neg:"ikanakereba"},
    example_sentence:"学校に行きます。",example_sentence_en:"I go to school."
  },
  {
    dictionary:"来る",hiragana:"くる",romaji:"kuru",meaning_en:"to come",group:"irregular",level:"N5",
    forms:{present:"来る",present_polite:"来ます",past:"来た",past_polite:"来ました",negative:"来ない",negative_polite:"来ません",neg_past:"来なかった",neg_past_polite:"来ませんでした",te_form:"来て",neg_te:"来なくて",ing_form:"来ている",tai_form:"来たい",potential:"来られる",potential_neg:"来られない",volitional:"来よう",passive:"来られる",causative:"来させる",imperative:"来い",conditional:"来れば",conditional_neg:"来なければ"},
    forms_romaji:{present:"kuru",present_polite:"kimasu",past:"kita",past_polite:"kimashita",negative:"konai",negative_polite:"kimasen",neg_past:"konakatta",neg_past_polite:"kimasen deshita",te_form:"kite",neg_te:"konakute",ing_form:"kite iru",tai_form:"kitai",potential:"korareru",potential_neg:"korarenai",volitional:"koyou",passive:"korareru",causative:"kosaseru",imperative:"koi",conditional:"kureba",conditional_neg:"konakereba"},
    example_sentence:"友達が来ました。",example_sentence_en:"My friend came."
  },
  {
    dictionary:"する",hiragana:"する",romaji:"suru",meaning_en:"to do",group:"irregular",level:"N5",
    forms:{present:"する",present_polite:"します",past:"した",past_polite:"しました",negative:"しない",negative_polite:"しません",neg_past:"しなかった",neg_past_polite:"しませんでした",te_form:"して",neg_te:"しなくて",ing_form:"している",tai_form:"したい",potential:"できる",potential_neg:"できない",volitional:"しよう",passive:"される",causative:"させる",imperative:"しろ",conditional:"すれば",conditional_neg:"しなければ"},
    forms_romaji:{present:"suru",present_polite:"shimasu",past:"shita",past_polite:"shimashita",negative:"shinai",negative_polite:"shimasen",neg_past:"shinakatta",neg_past_polite:"shimasen deshita",te_form:"shite",neg_te:"shinakute",ing_form:"shite iru",tai_form:"shitai",potential:"dekiru",potential_neg:"dekinai",volitional:"shiyou",passive:"sareru",causative:"saseru",imperative:"shiro",conditional:"sureba",conditional_neg:"shinakereba"},
    example_sentence:"勉強をします。",example_sentence_en:"I study."
  },
  {
    dictionary:"見る",hiragana:"みる",romaji:"miru",meaning_en:"to see / watch",group:"ichidan",level:"N5",
    forms:{present:"見る",present_polite:"見ます",past:"見た",past_polite:"見ました",negative:"見ない",negative_polite:"見ません",neg_past:"見なかった",neg_past_polite:"見ませんでした",te_form:"見て",neg_te:"見なくて",ing_form:"見ている",tai_form:"見たい",potential:"見られる",potential_neg:"見られない",volitional:"見よう",passive:"見られる",causative:"見させる",imperative:"見ろ",conditional:"見れば",conditional_neg:"見なければ"},
    forms_romaji:{present:"miru",present_polite:"mimasu",past:"mita",past_polite:"mimashita",negative:"minai",negative_polite:"mimasen",neg_past:"minakatta",neg_past_polite:"mimasen deshita",te_form:"mite",neg_te:"minakute",ing_form:"mite iru",tai_form:"mitai",potential:"mirareru",potential_neg:"mirarenai",volitional:"miyou",passive:"mirareru",causative:"misaseru",imperative:"miro",conditional:"mireba",conditional_neg:"minakereba"},
    example_sentence:"映画を見ます。",example_sentence_en:"I watch a movie."
  },
  {
    dictionary:"書く",hiragana:"かく",romaji:"kaku",meaning_en:"to write",group:"godan",level:"N5",
    forms:{present:"書く",present_polite:"書きます",past:"書いた",past_polite:"書きました",negative:"書かない",negative_polite:"書きません",neg_past:"書かなかった",neg_past_polite:"書きませんでした",te_form:"書いて",neg_te:"書かなくて",ing_form:"書いている",tai_form:"書きたい",potential:"書ける",potential_neg:"書けない",volitional:"書こう",passive:"書かれる",causative:"書かせる",imperative:"書け",conditional:"書けば",conditional_neg:"書かなければ"},
    forms_romaji:{present:"kaku",present_polite:"kakimasu",past:"kaita",past_polite:"kakimashita",negative:"kakanai",negative_polite:"kakimasen",neg_past:"kakanakatta",neg_past_polite:"kakimasen deshita",te_form:"kaite",neg_te:"kakanakute",ing_form:"kaite iru",tai_form:"kakitai",potential:"kakeru",potential_neg:"kakenai",volitional:"kakou",passive:"kakareru",causative:"kakaseru",imperative:"kake",conditional:"kakeba",conditional_neg:"kakanakereba"},
    example_sentence:"手紙を書きます。",example_sentence_en:"I write a letter."
  },
  {
    dictionary:"読む",hiragana:"よむ",romaji:"yomu",meaning_en:"to read",group:"godan",level:"N5",
    forms:{present:"読む",present_polite:"読みます",past:"読んだ",past_polite:"読みました",negative:"読まない",negative_polite:"読みません",neg_past:"読まなかった",neg_past_polite:"読みませんでした",te_form:"読んで",neg_te:"読まなくて",ing_form:"読んでいる",tai_form:"読みたい",potential:"読める",potential_neg:"読めない",volitional:"読もう",passive:"読まれる",causative:"読ませる",imperative:"読め",conditional:"読めば",conditional_neg:"読まなければ"},
    forms_romaji:{present:"yomu",present_polite:"yomimasu",past:"yonda",past_polite:"yomimashita",negative:"yomanai",negative_polite:"yomimasen",neg_past:"yomanakatta",neg_past_polite:"yomimasen deshita",te_form:"yonde",neg_te:"yomanakute",ing_form:"yonde iru",tai_form:"yomitai",potential:"yomeru",potential_neg:"yomenai",volitional:"yomou",passive:"yomareru",causative:"yomaseru",imperative:"yome",conditional:"yomeba",conditional_neg:"yomanakereba"},
    example_sentence:"本を読みます。",example_sentence_en:"I read a book."
  },
  {
    dictionary:"話す",hiragana:"はなす",romaji:"hanasu",meaning_en:"to speak / talk",group:"godan",level:"N5",
    forms:{present:"話す",present_polite:"話します",past:"話した",past_polite:"話しました",negative:"話さない",negative_polite:"話しません",neg_past:"話さなかった",neg_past_polite:"話しませんでした",te_form:"話して",neg_te:"話さなくて",ing_form:"話している",tai_form:"話したい",potential:"話せる",potential_neg:"話せない",volitional:"話そう",passive:"話される",causative:"話させる",imperative:"話せ",conditional:"話せば",conditional_neg:"話さなければ"},
    forms_romaji:{present:"hanasu",present_polite:"hanashimasu",past:"hanashita",past_polite:"hanashimashita",negative:"hanasanai",negative_polite:"hanashimasen",neg_past:"hanasanakatta",neg_past_polite:"hanashimasen deshita",te_form:"hanashite",neg_te:"hanasanakute",ing_form:"hanashite iru",tai_form:"hanashitai",potential:"hanaseru",potential_neg:"hanasenai",volitional:"hanasou",passive:"hanasareru",causative:"hanasaseru",imperative:"hanase",conditional:"hanaseba",conditional_neg:"hanasanakereba"},
    example_sentence:"日本語を話します。",example_sentence_en:"I speak Japanese."
  },
  {
    dictionary:"聞く",hiragana:"きく",romaji:"kiku",meaning_en:"to listen / ask",group:"godan",level:"N5",
    forms:{present:"聞く",present_polite:"聞きます",past:"聞いた",past_polite:"聞きました",negative:"聞かない",negative_polite:"聞きません",neg_past:"聞かなかった",neg_past_polite:"聞きませんでした",te_form:"聞いて",neg_te:"聞かなくて",ing_form:"聞いている",tai_form:"聞きたい",potential:"聞ける",potential_neg:"聞けない",volitional:"聞こう",passive:"聞かれる",causative:"聞かせる",imperative:"聞け",conditional:"聞けば",conditional_neg:"聞かなければ"},
    forms_romaji:{present:"kiku",present_polite:"kikimasu",past:"kiita",past_polite:"kikimashita",negative:"kikanai",negative_polite:"kikimasen",neg_past:"kikanakatta",neg_past_polite:"kikimasen deshita",te_form:"kiite",neg_te:"kikanakute",ing_form:"kiite iru",tai_form:"kikitai",potential:"kikeru",potential_neg:"kikenai",volitional:"kikou",passive:"kikareru",causative:"kikaseru",imperative:"kike",conditional:"kikeba",conditional_neg:"kikanakereba"},
    example_sentence:"音楽を聞きます。",example_sentence_en:"I listen to music."
  },
  {
    dictionary:"買う",hiragana:"かう",romaji:"kau",meaning_en:"to buy",group:"godan",level:"N5",
    forms:{present:"買う",present_polite:"買います",past:"買った",past_polite:"買いました",negative:"買わない",negative_polite:"買いません",neg_past:"買わなかった",neg_past_polite:"買いませんでした",te_form:"買って",neg_te:"買わなくて",ing_form:"買っている",tai_form:"買いたい",potential:"買える",potential_neg:"買えない",volitional:"買おう",passive:"買われる",causative:"買わせる",imperative:"買え",conditional:"買えば",conditional_neg:"買わなければ"},
    forms_romaji:{present:"kau",present_polite:"kaimasu",past:"katta",past_polite:"kaimashita",negative:"kawanai",negative_polite:"kaimasen",neg_past:"kawanakatta",neg_past_polite:"kaimasen deshita",te_form:"katte",neg_te:"kawanakute",ing_form:"katte iru",tai_form:"kaitai",potential:"kaeru",potential_neg:"kaenai",volitional:"kaou",passive:"kawareru",causative:"kawaseru",imperative:"kae",conditional:"kaeba",conditional_neg:"kawanakereba"},
    example_sentence:"スーパーで買い物をします。",example_sentence_en:"I shop at the supermarket."
  },
  {
    dictionary:"寝る",hiragana:"ねる",romaji:"neru",meaning_en:"to sleep",group:"ichidan",level:"N5",
    forms:{present:"寝る",present_polite:"寝ます",past:"寝た",past_polite:"寝ました",negative:"寝ない",negative_polite:"寝ません",neg_past:"寝なかった",neg_past_polite:"寝ませんでした",te_form:"寝て",neg_te:"寝なくて",ing_form:"寝ている",tai_form:"寝たい",potential:"寝られる",potential_neg:"寝られない",volitional:"寝よう",passive:"寝られる",causative:"寝させる",imperative:"寝ろ",conditional:"寝れば",conditional_neg:"寝なければ"},
    forms_romaji:{present:"neru",present_polite:"nemasu",past:"neta",past_polite:"nemashita",negative:"nenai",negative_polite:"nemasen",neg_past:"nenakatta",neg_past_polite:"nemasen deshita",te_form:"nete",neg_te:"nenakute",ing_form:"nete iru",tai_form:"netai",potential:"nerareru",potential_neg:"nerarenai",volitional:"neyou",passive:"nerareru",causative:"nesaseru",imperative:"nero",conditional:"nereba",conditional_neg:"nenakereba"},
    example_sentence:"早く寝ます。",example_sentence_en:"I go to bed early."
  },
  {
    dictionary:"起きる",hiragana:"おきる",romaji:"okiru",meaning_en:"to wake up / get up",group:"ichidan",level:"N5",
    forms:{present:"起きる",present_polite:"起きます",past:"起きた",past_polite:"起きました",negative:"起きない",negative_polite:"起きません",neg_past:"起きなかった",neg_past_polite:"起きませんでした",te_form:"起きて",neg_te:"起きなくて",ing_form:"起きている",tai_form:"起きたい",potential:"起きられる",potential_neg:"起きられない",volitional:"起きよう",passive:"起きられる",causative:"起きさせる",imperative:"起きろ",conditional:"起きれば",conditional_neg:"起きなければ"},
    forms_romaji:{present:"okiru",present_polite:"okimasu",past:"okita",past_polite:"okimashita",negative:"okinai",negative_polite:"okimasen",neg_past:"okinakatta",neg_past_polite:"okimasen deshita",te_form:"okite",neg_te:"okinakute",ing_form:"okite iru",tai_form:"okitai",potential:"okirareru",potential_neg:"okirarenai",volitional:"okiyou",passive:"okirareru",causative:"okisaseru",imperative:"okiro",conditional:"okireba",conditional_neg:"okinakereba"},
    example_sentence:"毎朝６時に起きます。",example_sentence_en:"I wake up at 6 every morning."
  },
  {
    dictionary:"分かる",hiragana:"わかる",romaji:"wakaru",meaning_en:"to understand",group:"godan",level:"N5",
    forms:{present:"分かる",present_polite:"分かります",past:"分かった",past_polite:"分かりました",negative:"分からない",negative_polite:"分かりません",neg_past:"分からなかった",neg_past_polite:"分かりませんでした",te_form:"分かって",neg_te:"分からなくて",ing_form:"分かっている",tai_form:"分かりたい",potential:"分かれる",potential_neg:"分かれない",volitional:"分かろう",passive:"分かられる",causative:"分からせる",imperative:"分かれ",conditional:"分かれば",conditional_neg:"分からなければ"},
    forms_romaji:{present:"wakaru",present_polite:"wakarimasu",past:"wakatta",past_polite:"wakarimashita",negative:"wakaranai",negative_polite:"wakarimasen",neg_past:"wakaranakatta",neg_past_polite:"wakarimasen deshita",te_form:"wakatte",neg_te:"wakaranakute",ing_form:"wakatte iru",tai_form:"wakaritai",potential:"wakareru",potential_neg:"wakarenai",volitional:"wakarou",passive:"wakarareru",causative:"wakaraseru",imperative:"wakare",conditional:"wakareba",conditional_neg:"wakaranakereba"},
    example_sentence:"日本語が分かりますか？",example_sentence_en:"Do you understand Japanese?"
  },
  {
    dictionary:"あります",hiragana:"あります",romaji:"arimasu",meaning_en:"to exist (inanimate)",group:"godan",level:"N5",
    forms:{present:"ある",present_polite:"あります",past:"あった",past_polite:"ありました",negative:"ない",negative_polite:"ありません",neg_past:"なかった",neg_past_polite:"ありませんでした",te_form:"あって",neg_te:"なくて",ing_form:"ある",tai_form:"あってほしい",potential:"ある",potential_neg:"ない",volitional:"あろう",passive:"ある",causative:"ある",imperative:"あれ",conditional:"あれば",conditional_neg:"なければ"},
    forms_romaji:{present:"aru",present_polite:"arimasu",past:"atta",past_polite:"arimashita",negative:"nai",negative_polite:"arimasen",neg_past:"nakatta",neg_past_polite:"arimasen deshita",te_form:"atte",neg_te:"nakute",ing_form:"aru",tai_form:"atte hoshii",potential:"aru",potential_neg:"nai",volitional:"arou",passive:"aru",causative:"aru",imperative:"are",conditional:"areba",conditional_neg:"nakereba"},
    example_sentence:"机の上に本があります。",example_sentence_en:"There is a book on the desk."
  },
  {
    dictionary:"います",hiragana:"います",romaji:"imasu",meaning_en:"to exist (animate)",group:"ichidan",level:"N5",
    forms:{present:"いる",present_polite:"います",past:"いた",past_polite:"いました",negative:"いない",negative_polite:"いません",neg_past:"いなかった",neg_past_polite:"いませんでした",te_form:"いて",neg_te:"いなくて",ing_form:"いる",tai_form:"いたい",potential:"いられる",potential_neg:"いられない",volitional:"いよう",passive:"いられる",causative:"いさせる",imperative:"いろ",conditional:"いれば",conditional_neg:"いなければ"},
    forms_romaji:{present:"iru",present_polite:"imasu",past:"ita",past_polite:"imashita",negative:"inai",negative_polite:"imasen",neg_past:"inakatta",neg_past_polite:"imasen deshita",te_form:"ite",neg_te:"inakute",ing_form:"iru",tai_form:"itai",potential:"irareru",potential_neg:"irarenai",volitional:"iyou",passive:"irareru",causative:"isaseru",imperative:"iro",conditional:"ireba",conditional_neg:"inakereba"},
    example_sentence:"猫がいます。",example_sentence_en:"There is a cat."
  },
  // ===== More N5 =====
  {
    dictionary:"思う",hiragana:"おもう",romaji:"omou",meaning_en:"to think",group:"godan",level:"N5",
    forms:{present:"思う",present_polite:"思います",past:"思った",past_polite:"思いました",negative:"思わない",negative_polite:"思いません",neg_past:"思わなかった",neg_past_polite:"思いませんでした",te_form:"思って",neg_te:"思わなくて",ing_form:"思っている",tai_form:"思いたい",potential:"思える",potential_neg:"思えない",volitional:"思おう",passive:"思われる",causative:"思わせる",imperative:"思え",conditional:"思えば",conditional_neg:"思わなければ"},
    forms_romaji:{present:"omou",present_polite:"omoimasu",past:"omotta",past_polite:"omoimashita",negative:"omowanai",negative_polite:"omoimasen",neg_past:"omowanakatta",neg_past_polite:"omoimasen deshita",te_form:"omotte",neg_te:"omowanakute",ing_form:"omotte iru",tai_form:"omoitai",potential:"omoeru",potential_neg:"omoenai",volitional:"omoou",passive:"omowareru",causative:"omowaseru",imperative:"omoe",conditional:"omoeba",conditional_neg:"omowanakereba"},
    example_sentence:"そう思います。",example_sentence_en:"I think so."
  },
  {
    dictionary:"言う",hiragana:"いう",romaji:"iu",meaning_en:"to say",group:"godan",level:"N5",
    forms:{present:"言う",present_polite:"言います",past:"言った",past_polite:"言いました",negative:"言わない",negative_polite:"言いません",neg_past:"言わなかった",neg_past_polite:"言いませんでした",te_form:"言って",neg_te:"言わなくて",ing_form:"言っている",tai_form:"言いたい",potential:"言える",potential_neg:"言えない",volitional:"言おう",passive:"言われる",causative:"言わせる",imperative:"言え",conditional:"言えば",conditional_neg:"言わなければ"},
    forms_romaji:{present:"iu",present_polite:"iimasu",past:"itta",past_polite:"iimashita",negative:"iwanai",negative_polite:"iimasen",neg_past:"iwanakatta",neg_past_polite:"iimasen deshita",te_form:"itte",neg_te:"iwanakute",ing_form:"itte iru",tai_form:"iitai",potential:"ieru",potential_neg:"ienai",volitional:"iou",passive:"iwareru",causative:"iwaseru",imperative:"ie",conditional:"ieba",conditional_neg:"iwanakereba"},
    example_sentence:"何を言いましたか？",example_sentence_en:"What did you say?"
  },
  {
    dictionary:"見せる",hiragana:"みせる",romaji:"miseru",meaning_en:"to show",group:"ichidan",level:"N5",
    forms:{present:"見せる",present_polite:"見せます",past:"見せた",past_polite:"見せました",negative:"見せない",negative_polite:"見せません",neg_past:"見せなかった",neg_past_polite:"見せませんでした",te_form:"見せて",neg_te:"見せなくて",ing_form:"見せている",tai_form:"見せたい",potential:"見せられる",potential_neg:"見せられない",volitional:"見せよう",passive:"見せられる",causative:"見せさせる",imperative:"見せろ",conditional:"見せれば",conditional_neg:"見せなければ"},
    forms_romaji:{present:"miseru",present_polite:"misemasu",past:"miseta",past_polite:"misemashita",negative:"misenai",negative_polite:"misemasen",neg_past:"misenakatta",neg_past_polite:"misemasen deshita",te_form:"misete",neg_te:"misenakute",ing_form:"misete iru",tai_form:"misetai",potential:"miserareru",potential_neg:"miserarenai",volitional:"miseyou",passive:"miserareru",causative:"misesaseru",imperative:"misero",conditional:"misereba",conditional_neg:"misenakereba"},
    example_sentence:"写真を見せてください。",example_sentence_en:"Please show me the photo."
  },
  {
    dictionary:"知る",hiragana:"しる",romaji:"shiru",meaning_en:"to know",group:"godan",level:"N5",
    forms:{present:"知る",present_polite:"知ります",past:"知った",past_polite:"知りました",negative:"知らない",negative_polite:"知りません",neg_past:"知らなかった",neg_past_polite:"知りませんでした",te_form:"知って",neg_te:"知らなくて",ing_form:"知っている",tai_form:"知りたい",potential:"知れる",potential_neg:"知れない",volitional:"知ろう",passive:"知られる",causative:"知らせる",imperative:"知れ",conditional:"知れば",conditional_neg:"知らなければ"},
    forms_romaji:{present:"shiru",present_polite:"shirimasu",past:"shitta",past_polite:"shirimashita",negative:"shiranai",negative_polite:"shirimasen",neg_past:"shiranakatta",neg_past_polite:"shirimasen deshita",te_form:"shitte",neg_te:"shiranakute",ing_form:"shitte iru",tai_form:"shiritai",potential:"shireru",potential_neg:"shirenai",volitional:"shirou",passive:"shirareu",causative:"shiraseru",imperative:"shire",conditional:"shireba",conditional_neg:"shiranakereba"},
    example_sentence:"それを知っていますか？",example_sentence_en:"Do you know that?"
  },
  {
    dictionary:"使う",hiragana:"つかう",romaji:"tsukau",meaning_en:"to use",group:"godan",level:"N5",
    forms:{present:"使う",present_polite:"使います",past:"使った",past_polite:"使いました",negative:"使わない",negative_polite:"使いません",neg_past:"使わなかった",neg_past_polite:"使いませんでした",te_form:"使って",neg_te:"使わなくて",ing_form:"使っている",tai_form:"使いたい",potential:"使える",potential_neg:"使えない",volitional:"使おう",passive:"使われる",causative:"使わせる",imperative:"使え",conditional:"使えば",conditional_neg:"使わなければ"},
    forms_romaji:{present:"tsukau",present_polite:"tsukaimasu",past:"tsukatta",past_polite:"tsukaimashita",negative:"tsukawanai",negative_polite:"tsukaimasen",neg_past:"tsukawanakatta",neg_past_polite:"tsukaimasen deshita",te_form:"tsukatte",neg_te:"tsukawanakute",ing_form:"tsukatte iru",tai_form:"tsukaitai",potential:"tsukaeru",potential_neg:"tsukaenai",volitional:"tsukaou",passive:"tsukawareru",causative:"tsukawaseru",imperative:"tsukae",conditional:"tsukaeba",conditional_neg:"tsukawanakereba"},
    example_sentence:"日本語を使います。",example_sentence_en:"I use Japanese."
  },
  // ===== N4 VERBS =====
  {
    dictionary:"教える",hiragana:"おしえる",romaji:"oshieru",meaning_en:"to teach / tell",group:"ichidan",level:"N4",
    forms:{present:"教える",present_polite:"教えます",past:"教えた",past_polite:"教えました",negative:"教えない",negative_polite:"教えません",neg_past:"教えなかった",neg_past_polite:"教えませんでした",te_form:"教えて",neg_te:"教えなくて",ing_form:"教えている",tai_form:"教えたい",potential:"教えられる",potential_neg:"教えられない",volitional:"教えよう",passive:"教えられる",causative:"教えさせる",imperative:"教えろ",conditional:"教えれば",conditional_neg:"教えなければ"},
    forms_romaji:{present:"oshieru",present_polite:"oshiemasu",past:"oshieta",past_polite:"oshiemashita",negative:"oshienai",negative_polite:"oshiemasen",neg_past:"oshienakatta",neg_past_polite:"oshiemasen deshita",te_form:"oshiete",neg_te:"oshienakute",ing_form:"oshiete iru",tai_form:"oshietai",potential:"oshierareru",potential_neg:"oshierarenai",volitional:"oshieyou",passive:"oshierareru",causative:"oshiesaseru",imperative:"oshiero",conditional:"oshiereba",conditional_neg:"oshienakereba"},
    example_sentence:"英語を教えています。",example_sentence_en:"I teach English."
  },
  {
    dictionary:"会う",hiragana:"あう",romaji:"au",meaning_en:"to meet",group:"godan",level:"N4",
    forms:{present:"会う",present_polite:"会います",past:"会った",past_polite:"会いました",negative:"会わない",negative_polite:"会いません",neg_past:"会わなかった",neg_past_polite:"会いませんでした",te_form:"会って",neg_te:"会わなくて",ing_form:"会っている",tai_form:"会いたい",potential:"会える",potential_neg:"会えない",volitional:"会おう",passive:"会われる",causative:"会わせる",imperative:"会え",conditional:"会えば",conditional_neg:"会わなければ"},
    forms_romaji:{present:"au",present_polite:"aimasu",past:"atta",past_polite:"aimashita",negative:"awanai",negative_polite:"aimasen",neg_past:"awanakatta",neg_past_polite:"aimasen deshita",te_form:"atte",neg_te:"awanakute",ing_form:"atte iru",tai_form:"aitai",potential:"aeru",potential_neg:"aenai",volitional:"aou",passive:"awareru",causative:"awaseru",imperative:"ae",conditional:"aeba",conditional_neg:"awanakereba"},
    example_sentence:"友達に会います。",example_sentence_en:"I meet my friend."
  },
  {
    dictionary:"待つ",hiragana:"まつ",romaji:"matsu",meaning_en:"to wait",group:"godan",level:"N4",
    forms:{present:"待つ",present_polite:"待ちます",past:"待った",past_polite:"待ちました",negative:"待たない",negative_polite:"待ちません",neg_past:"待たなかった",neg_past_polite:"待ちませんでした",te_form:"待って",neg_te:"待たなくて",ing_form:"待っている",tai_form:"待ちたい",potential:"待てる",potential_neg:"待てない",volitional:"待とう",passive:"待たれる",causative:"待たせる",imperative:"待て",conditional:"待てば",conditional_neg:"待たなければ"},
    forms_romaji:{present:"matsu",present_polite:"machimasu",past:"matta",past_polite:"machimashita",negative:"matanai",negative_polite:"machimasen",neg_past:"matanakatta",neg_past_polite:"machimasen deshita",te_form:"matte",neg_te:"matanakute",ing_form:"matte iru",tai_form:"machitai",potential:"materu",potential_neg:"matenai",volitional:"matou",passive:"matareru",causative:"mataseru",imperative:"mate",conditional:"mateba",conditional_neg:"matanakereba"},
    example_sentence:"少し待ってください。",example_sentence_en:"Please wait a moment."
  },
  {
    dictionary:"作る",hiragana:"つくる",romaji:"tsukuru",meaning_en:"to make / create",group:"godan",level:"N4",
    forms:{present:"作る",present_polite:"作ります",past:"作った",past_polite:"作りました",negative:"作らない",negative_polite:"作りません",neg_past:"作らなかった",neg_past_polite:"作りませんでした",te_form:"作って",neg_te:"作らなくて",ing_form:"作っている",tai_form:"作りたい",potential:"作れる",potential_neg:"作れない",volitional:"作ろう",passive:"作られる",causative:"作らせる",imperative:"作れ",conditional:"作れば",conditional_neg:"作らなければ"},
    forms_romaji:{present:"tsukuru",present_polite:"tsukurimasu",past:"tsukutta",past_polite:"tsukurimashita",negative:"tsukuranai",negative_polite:"tsukurimasen",neg_past:"tsukuranakatta",neg_past_polite:"tsukurimasen deshita",te_form:"tsukutte",neg_te:"tsukuranakute",ing_form:"tsukutte iru",tai_form:"tsukuritai",potential:"tsukureru",potential_neg:"tsukurenai",volitional:"tsukurou",passive:"tsukurareru",causative:"tsukuraseru",imperative:"tsukure",conditional:"tsukureba",conditional_neg:"tsukuranakereba"},
    example_sentence:"料理を作ります。",example_sentence_en:"I make food."
  },
  {
    dictionary:"出る",hiragana:"でる",romaji:"deru",meaning_en:"to leave / come out",group:"ichidan",level:"N4",
    forms:{present:"出る",present_polite:"出ます",past:"出た",past_polite:"出ました",negative:"出ない",negative_polite:"出ません",neg_past:"出なかった",neg_past_polite:"出ませんでした",te_form:"出て",neg_te:"出なくて",ing_form:"出ている",tai_form:"出たい",potential:"出られる",potential_neg:"出られない",volitional:"出よう",passive:"出られる",causative:"出させる",imperative:"出ろ",conditional:"出れば",conditional_neg:"出なければ"},
    forms_romaji:{present:"deru",present_polite:"demasu",past:"deta",past_polite:"demashita",negative:"denai",negative_polite:"demasen",neg_past:"denakatta",neg_past_polite:"demasen deshita",te_form:"dete",neg_te:"denakute",ing_form:"dete iru",tai_form:"detai",potential:"derareru",potential_neg:"derarenai",volitional:"deyou",passive:"derareru",causative:"desaseru",imperative:"dero",conditional:"dereba",conditional_neg:"denakereba"},
    example_sentence:"８時に家を出ます。",example_sentence_en:"I leave home at 8."
  },
  {
    dictionary:"入る",hiragana:"はいる",romaji:"hairu",meaning_en:"to enter",group:"godan",level:"N4",
    forms:{present:"入る",present_polite:"入ります",past:"入った",past_polite:"入りました",negative:"入らない",negative_polite:"入りません",neg_past:"入らなかった",neg_past_polite:"入りませんでした",te_form:"入って",neg_te:"入らなくて",ing_form:"入っている",tai_form:"入りたい",potential:"入れる",potential_neg:"入れない",volitional:"入ろう",passive:"入られる",causative:"入らせる",imperative:"入れ",conditional:"入れば",conditional_neg:"入らなければ"},
    forms_romaji:{present:"hairu",present_polite:"hairimasu",past:"haitta",past_polite:"hairimashita",negative:"hairanai",negative_polite:"hairimasen",neg_past:"hairanakatta",neg_past_polite:"hairimasen deshita",te_form:"haitte",neg_te:"hairanakute",ing_form:"haitte iru",tai_form:"hairitai",potential:"haireru",potential_neg:"hairenai",volitional:"hairou",passive:"hairareru",causative:"hairaseru",imperative:"haire",conditional:"haireba",conditional_neg:"hairanakereba"},
    example_sentence:"部屋に入ってください。",example_sentence_en:"Please enter the room."
  },
  {
    dictionary:"借りる",hiragana:"かりる",romaji:"kariru",meaning_en:"to borrow",group:"ichidan",level:"N4",
    forms:{present:"借りる",present_polite:"借ります",past:"借りた",past_polite:"借りました",negative:"借りない",negative_polite:"借りません",neg_past:"借りなかった",neg_past_polite:"借りませんでした",te_form:"借りて",neg_te:"借りなくて",ing_form:"借りている",tai_form:"借りたい",potential:"借りられる",potential_neg:"借りられない",volitional:"借りよう",passive:"借りられる",causative:"借りさせる",imperative:"借りろ",conditional:"借りれば",conditional_neg:"借りなければ"},
    forms_romaji:{present:"kariru",present_polite:"karimasu",past:"karita",past_polite:"karimashita",negative:"karinai",negative_polite:"karimasen",neg_past:"karinakatta",neg_past_polite:"karimasen deshita",te_form:"karite",neg_te:"karinakute",ing_form:"karite iru",tai_form:"karitai",potential:"karirareru",potential_neg:"karirarenai",volitional:"kariyou",passive:"karirareru",causative:"karisaseru",imperative:"kariro",conditional:"karireba",conditional_neg:"karinakereba"},
    example_sentence:"本を借りたいです。",example_sentence_en:"I want to borrow a book."
  },
  {
    dictionary:"貸す",hiragana:"かす",romaji:"kasu",meaning_en:"to lend",group:"godan",level:"N4",
    forms:{present:"貸す",present_polite:"貸します",past:"貸した",past_polite:"貸しました",negative:"貸さない",negative_polite:"貸しません",neg_past:"貸さなかった",neg_past_polite:"貸しませんでした",te_form:"貸して",neg_te:"貸さなくて",ing_form:"貸している",tai_form:"貸したい",potential:"貸せる",potential_neg:"貸せない",volitional:"貸そう",passive:"貸される",causative:"貸させる",imperative:"貸せ",conditional:"貸せば",conditional_neg:"貸さなければ"},
    forms_romaji:{present:"kasu",present_polite:"kashimasu",past:"kashita",past_polite:"kashimashita",negative:"kasanai",negative_polite:"kashimasen",neg_past:"kasanakatta",neg_past_polite:"kashimasen deshita",te_form:"kashite",neg_te:"kasanakute",ing_form:"kashite iru",tai_form:"kashitai",potential:"kaseru",potential_neg:"kasenai",volitional:"kasou",passive:"kasareru",causative:"kasaseru",imperative:"kase",conditional:"kaseba",conditional_neg:"kasanakereba"},
    example_sentence:"お金を貸してください。",example_sentence_en:"Please lend me money."
  },
  {
    dictionary:"遊ぶ",hiragana:"あそぶ",romaji:"asobu",meaning_en:"to play / hang out",group:"godan",level:"N4",
    forms:{present:"遊ぶ",present_polite:"遊びます",past:"遊んだ",past_polite:"遊びました",negative:"遊ばない",negative_polite:"遊びません",neg_past:"遊ばなかった",neg_past_polite:"遊びませんでした",te_form:"遊んで",neg_te:"遊ばなくて",ing_form:"遊んでいる",tai_form:"遊びたい",potential:"遊べる",potential_neg:"遊べない",volitional:"遊ぼう",passive:"遊ばれる",causative:"遊ばせる",imperative:"遊べ",conditional:"遊べば",conditional_neg:"遊ばなければ"},
    forms_romaji:{present:"asobu",present_polite:"asobimasu",past:"asonda",past_polite:"asobimashita",negative:"asobanai",negative_polite:"asobimasen",neg_past:"asobanakatta",neg_past_polite:"asobimasen deshita",te_form:"asonde",neg_te:"asobanakute",ing_form:"asonde iru",tai_form:"asobitai",potential:"asoberu",potential_neg:"asobenai",volitional:"asobou",passive:"asobareru",causative:"asobaseru",imperative:"asobe",conditional:"asobeba",conditional_neg:"asobanakereba"},
    example_sentence:"公園で遊びます。",example_sentence_en:"I play in the park."
  },
  {
    dictionary:"働く",hiragana:"はたらく",romaji:"hataraku",meaning_en:"to work",group:"godan",level:"N4",
    forms:{present:"働く",present_polite:"働きます",past:"働いた",past_polite:"働きました",negative:"働かない",negative_polite:"働きません",neg_past:"働かなかった",neg_past_polite:"働きませんでした",te_form:"働いて",neg_te:"働かなくて",ing_form:"働いている",tai_form:"働きたい",potential:"働ける",potential_neg:"働けない",volitional:"働こう",passive:"働かれる",causative:"働かせる",imperative:"働け",conditional:"働けば",conditional_neg:"働かなければ"},
    forms_romaji:{present:"hataraku",present_polite:"hatarakimasu",past:"hataraita",past_polite:"hatarakimashita",negative:"hatarakanai",negative_polite:"hatarakimasen",neg_past:"hatarakanakatta",neg_past_polite:"hatarakimasen deshita",te_form:"hataraite",neg_te:"hatarakanakute",ing_form:"hataraite iru",tai_form:"hatarakitai",potential:"hatarakeru",potential_neg:"hatarakenai",volitional:"hatarakou",passive:"hatarakareru",causative:"hatarakaseru",imperative:"hatarakete",conditional:"hatarakeba",conditional_neg:"hatarakanakereba"},
    example_sentence:"毎日働きます。",example_sentence_en:"I work every day."
  },
  {
    dictionary:"泳ぐ",hiragana:"およぐ",romaji:"oyogu",meaning_en:"to swim",group:"godan",level:"N4",
    forms:{present:"泳ぐ",present_polite:"泳ぎます",past:"泳いだ",past_polite:"泳ぎました",negative:"泳がない",negative_polite:"泳ぎません",neg_past:"泳がなかった",neg_past_polite:"泳ぎませんでした",te_form:"泳いで",neg_te:"泳がなくて",ing_form:"泳いでいる",tai_form:"泳ぎたい",potential:"泳げる",potential_neg:"泳げない",volitional:"泳ごう",passive:"泳がれる",causative:"泳がせる",imperative:"泳げ",conditional:"泳げば",conditional_neg:"泳がなければ"},
    forms_romaji:{present:"oyogu",present_polite:"oyogimasu",past:"oyoida",past_polite:"oyogimashita",negative:"oyoganai",negative_polite:"oyogimasen",neg_past:"oyoganakatta",neg_past_polite:"oyogimasen deshita",te_form:"oyoide",neg_te:"oyoganakute",ing_form:"oyoide iru",tai_form:"oyogitai",potential:"oyogeru",potential_neg:"oyogenai",volitional:"oyogou",passive:"oyogareru",causative:"oyogaseru",imperative:"oyoge",conditional:"oyogeba",conditional_neg:"oyoganakereba"},
    example_sentence:"海で泳ぎます。",example_sentence_en:"I swim in the sea."
  },
  {
    dictionary:"走る",hiragana:"はしる",romaji:"hashiru",meaning_en:"to run",group:"godan",level:"N4",
    forms:{present:"走る",present_polite:"走ります",past:"走った",past_polite:"走りました",negative:"走らない",negative_polite:"走りません",neg_past:"走らなかった",neg_past_polite:"走りませんでした",te_form:"走って",neg_te:"走らなくて",ing_form:"走っている",tai_form:"走りたい",potential:"走れる",potential_neg:"走れない",volitional:"走ろう",passive:"走られる",causative:"走らせる",imperative:"走れ",conditional:"走れば",conditional_neg:"走らなければ"},
    forms_romaji:{present:"hashiru",present_polite:"hashirimasu",past:"hashitta",past_polite:"hashirimashita",negative:"hashiranai",negative_polite:"hashirimasen",neg_past:"hashiranakatta",neg_past_polite:"hashirimasen deshita",te_form:"hashitte",neg_te:"hashiranakute",ing_form:"hashitte iru",tai_form:"hashiritai",potential:"hashireru",potential_neg:"hashirenai",volitional:"hashirou",passive:"hashirareru",causative:"hashiraseru",imperative:"hashire",conditional:"hashireba",conditional_neg:"hashiranakereba"},
    example_sentence:"毎朝走ります。",example_sentence_en:"I run every morning."
  },
  {
    dictionary:"歩く",hiragana:"あるく",romaji:"aruku",meaning_en:"to walk",group:"godan",level:"N4",
    forms:{present:"歩く",present_polite:"歩きます",past:"歩いた",past_polite:"歩きました",negative:"歩かない",negative_polite:"歩きません",neg_past:"歩かなかった",neg_past_polite:"歩きませんでした",te_form:"歩いて",neg_te:"歩かなくて",ing_form:"歩いている",tai_form:"歩きたい",potential:"歩ける",potential_neg:"歩けない",volitional:"歩こう",passive:"歩かれる",causative:"歩かせる",imperative:"歩け",conditional:"歩けば",conditional_neg:"歩かなければ"},
    forms_romaji:{present:"aruku",present_polite:"arukimasu",past:"aruita",past_polite:"arukimashita",negative:"arukanai",negative_polite:"arukimasen",neg_past:"arukanakatta",neg_past_polite:"arukimasen deshita",te_form:"aruite",neg_te:"arukanakute",ing_form:"aruite iru",tai_form:"arukitai",potential:"arukeru",potential_neg:"arukenai",volitional:"arukou",passive:"arukareru",causative:"arukaseru",imperative:"aruke",conditional:"arukeba",conditional_neg:"arukanakereba"},
    example_sentence:"駅まで歩きます。",example_sentence_en:"I walk to the station."
  },
  {
    dictionary:"乗る",hiragana:"のる",romaji:"noru",meaning_en:"to ride / get on",group:"godan",level:"N4",
    forms:{present:"乗る",present_polite:"乗ります",past:"乗った",past_polite:"乗りました",negative:"乗らない",negative_polite:"乗りません",neg_past:"乗らなかった",neg_past_polite:"乗りませんでした",te_form:"乗って",neg_te:"乗らなくて",ing_form:"乗っている",tai_form:"乗りたい",potential:"乗れる",potential_neg:"乗れない",volitional:"乗ろう",passive:"乗られる",causative:"乗らせる",imperative:"乗れ",conditional:"乗れば",conditional_neg:"乗らなければ"},
    forms_romaji:{present:"noru",present_polite:"norimasu",past:"notta",past_polite:"norimashita",negative:"noranai",negative_polite:"norimasen",neg_past:"noranakatta",neg_past_polite:"norimasen deshita",te_form:"notte",neg_te:"noranakute",ing_form:"notte iru",tai_form:"noritai",potential:"noreru",potential_neg:"norenai",volitional:"norou",passive:"norareru",causative:"noraseru",imperative:"nore",conditional:"noreba",conditional_neg:"noranakereba"},
    example_sentence:"電車に乗ります。",example_sentence_en:"I ride the train."
  },
  {
    dictionary:"降りる",hiragana:"おりる",romaji:"oriru",meaning_en:"to get off / descend",group:"ichidan",level:"N4",
    forms:{present:"降りる",present_polite:"降ります",past:"降りた",past_polite:"降りました",negative:"降りない",negative_polite:"降りません",neg_past:"降りなかった",neg_past_polite:"降りませんでした",te_form:"降りて",neg_te:"降りなくて",ing_form:"降りている",tai_form:"降りたい",potential:"降りられる",potential_neg:"降りられない",volitional:"降りよう",passive:"降りられる",causative:"降りさせる",imperative:"降りろ",conditional:"降りれば",conditional_neg:"降りなければ"},
    forms_romaji:{present:"oriru",present_polite:"orimasu",past:"orita",past_polite:"orimashita",negative:"orinai",negative_polite:"orimasen",neg_past:"orinakatta",neg_past_polite:"orimasen deshita",te_form:"orite",neg_te:"orinakute",ing_form:"orite iru",tai_form:"oritai",potential:"orirareru",potential_neg:"orirarenai",volitional:"oriyou",passive:"orirareru",causative:"orisaseru",imperative:"oriro",conditional:"orireba",conditional_neg:"orinakereba"},
    example_sentence:"次の駅で降ります。",example_sentence_en:"I get off at the next station."
  },
  {
    dictionary:"洗う",hiragana:"あらう",romaji:"arau",meaning_en:"to wash",group:"godan",level:"N4",
    forms:{present:"洗う",present_polite:"洗います",past:"洗った",past_polite:"洗いました",negative:"洗わない",negative_polite:"洗いません",neg_past:"洗わなかった",neg_past_polite:"洗いませんでした",te_form:"洗って",neg_te:"洗わなくて",ing_form:"洗っている",tai_form:"洗いたい",potential:"洗える",potential_neg:"洗えない",volitional:"洗おう",passive:"洗われる",causative:"洗わせる",imperative:"洗え",conditional:"洗えば",conditional_neg:"洗わなければ"},
    forms_romaji:{present:"arau",present_polite:"araimasu",past:"aratta",past_polite:"araimashita",negative:"arawanai",negative_polite:"araimasen",neg_past:"arawanakatta",neg_past_polite:"araimasen deshita",te_form:"aratte",neg_te:"arawanakute",ing_form:"aratte iru",tai_form:"araitai",potential:"araeru",potential_neg:"araenai",volitional:"araou",passive:"arawareru",causative:"arawaseru",imperative:"arae",conditional:"araeba",conditional_neg:"arawanakereba"},
    example_sentence:"手を洗います。",example_sentence_en:"I wash my hands."
  },
  {
    dictionary:"着る",hiragana:"きる",romaji:"kiru",meaning_en:"to wear (upper body)",group:"ichidan",level:"N4",
    forms:{present:"着る",present_polite:"着ます",past:"着た",past_polite:"着ました",negative:"着ない",negative_polite:"着ません",neg_past:"着なかった",neg_past_polite:"着ませんでした",te_form:"着て",neg_te:"着なくて",ing_form:"着ている",tai_form:"着たい",potential:"着られる",potential_neg:"着られない",volitional:"着よう",passive:"着られる",causative:"着させる",imperative:"着ろ",conditional:"着れば",conditional_neg:"着なければ"},
    forms_romaji:{present:"kiru",present_polite:"kimasu",past:"kita",past_polite:"kimashita",negative:"kinai",negative_polite:"kimasen",neg_past:"kinakatta",neg_past_polite:"kimasen deshita",te_form:"kite",neg_te:"kinakute",ing_form:"kite iru",tai_form:"kitai",potential:"kirareru",potential_neg:"kirarenai",volitional:"kiyou",passive:"kirareru",causative:"kisaseru",imperative:"kiro",conditional:"kireba",conditional_neg:"kinakereba"},
    example_sentence:"コートを着ます。",example_sentence_en:"I wear a coat."
  },
  {
    dictionary:"脱ぐ",hiragana:"ぬぐ",romaji:"nugu",meaning_en:"to take off (clothes)",group:"godan",level:"N4",
    forms:{present:"脱ぐ",present_polite:"脱ぎます",past:"脱いだ",past_polite:"脱ぎました",negative:"脱がない",negative_polite:"脱ぎません",neg_past:"脱がなかった",neg_past_polite:"脱ぎませんでした",te_form:"脱いで",neg_te:"脱がなくて",ing_form:"脱いでいる",tai_form:"脱ぎたい",potential:"脱げる",potential_neg:"脱げない",volitional:"脱ごう",passive:"脱がれる",causative:"脱がせる",imperative:"脱げ",conditional:"脱げば",conditional_neg:"脱がなければ"},
    forms_romaji:{present:"nugu",present_polite:"nugimasu",past:"nuida",past_polite:"nugimashita",negative:"nuganai",negative_polite:"nugimasen",neg_past:"nuganakatta",neg_past_polite:"nugimasen deshita",te_form:"nuide",neg_te:"nuganakute",ing_form:"nuide iru",tai_form:"nugitai",potential:"nugeru",potential_neg:"nugenai",volitional:"nugou",passive:"nugareru",causative:"nugaseru",imperative:"nuge",conditional:"nugeba",conditional_neg:"nuganakereba"},
    example_sentence:"靴を脱いでください。",example_sentence_en:"Please take off your shoes."
  },
  // ===== N3 VERBS =====
  {
    dictionary:"決める",hiragana:"きめる",romaji:"kimeru",meaning_en:"to decide",group:"ichidan",level:"N3",
    forms:{present:"決める",present_polite:"決めます",past:"決めた",past_polite:"決めました",negative:"決めない",negative_polite:"決めません",neg_past:"決めなかった",neg_past_polite:"決めませんでした",te_form:"決めて",neg_te:"決めなくて",ing_form:"決めている",tai_form:"決めたい",potential:"決められる",potential_neg:"決められない",volitional:"決めよう",passive:"決められる",causative:"決めさせる",imperative:"決めろ",conditional:"決めれば",conditional_neg:"決めなければ"},
    forms_romaji:{present:"kimeru",present_polite:"kimemasu",past:"kimeta",past_polite:"kimemashita",negative:"kimenai",negative_polite:"kimemasen",neg_past:"kimenakatta",neg_past_polite:"kimemasen deshita",te_form:"kimete",neg_te:"kimenakute",ing_form:"kimete iru",tai_form:"kimetai",potential:"kimerareru",potential_neg:"kimerarenai",volitional:"kimeyou",passive:"kimerareru",causative:"kimesaseru",imperative:"kimero",conditional:"kimereba",conditional_neg:"kimenakereba"},
    example_sentence:"場所を決めましょう。",example_sentence_en:"Let's decide on a place."
  },
  {
    dictionary:"始める",hiragana:"はじめる",romaji:"hajimeru",meaning_en:"to begin / start",group:"ichidan",level:"N3",
    forms:{present:"始める",present_polite:"始めます",past:"始めた",past_polite:"始めました",negative:"始めない",negative_polite:"始めません",neg_past:"始めなかった",neg_past_polite:"始めませんでした",te_form:"始めて",neg_te:"始めなくて",ing_form:"始めている",tai_form:"始めたい",potential:"始められる",potential_neg:"始められない",volitional:"始めよう",passive:"始められる",causative:"始めさせる",imperative:"始めろ",conditional:"始めれば",conditional_neg:"始めなければ"},
    forms_romaji:{present:"hajimeru",present_polite:"hajimemasu",past:"hajimeta",past_polite:"hajimemashita",negative:"hajimenai",negative_polite:"hajimemasen",neg_past:"hajimenakatta",neg_past_polite:"hajimemasen deshita",te_form:"hajimete",neg_te:"hajimenakute",ing_form:"hajimete iru",tai_form:"hajimetai",potential:"hajimerareru",potential_neg:"hajimerarenai",volitional:"hajimeyou",passive:"hajimerareru",causative:"hajimesaseru",imperative:"hajimero",conditional:"hajimereba",conditional_neg:"hajimenakereba"},
    example_sentence:"仕事を始めます。",example_sentence_en:"I start work."
  },
  {
    dictionary:"終わる",hiragana:"おわる",romaji:"owaru",meaning_en:"to finish / end",group:"godan",level:"N3",
    forms:{present:"終わる",present_polite:"終わります",past:"終わった",past_polite:"終わりました",negative:"終わらない",negative_polite:"終わりません",neg_past:"終わらなかった",neg_past_polite:"終わりませんでした",te_form:"終わって",neg_te:"終わらなくて",ing_form:"終わっている",tai_form:"終わりたい",potential:"終われる",potential_neg:"終われない",volitional:"終わろう",passive:"終わられる",causative:"終わらせる",imperative:"終われ",conditional:"終われば",conditional_neg:"終わらなければ"},
    forms_romaji:{present:"owaru",present_polite:"owarimasu",past:"owatta",past_polite:"owarimashita",negative:"owaranai",negative_polite:"owarimasen",neg_past:"owaranakatta",neg_past_polite:"owarimasen deshita",te_form:"owatte",neg_te:"owaranakute",ing_form:"owatte iru",tai_form:"owaritai",potential:"owareru",potential_neg:"owarenai",volitional:"owarou",passive:"owareru",causative:"owaraseru",imperative:"oware",conditional:"owareba",conditional_neg:"owaranakereba"},
    example_sentence:"仕事が終わりました。",example_sentence_en:"Work finished."
  },
  {
    dictionary:"手伝う",hiragana:"てつだう",romaji:"tetsudau",meaning_en:"to help / assist",group:"godan",level:"N3",
    forms:{present:"手伝う",present_polite:"手伝います",past:"手伝った",past_polite:"手伝いました",negative:"手伝わない",negative_polite:"手伝いません",neg_past:"手伝わなかった",neg_past_polite:"手伝いませんでした",te_form:"手伝って",neg_te:"手伝わなくて",ing_form:"手伝っている",tai_form:"手伝いたい",potential:"手伝える",potential_neg:"手伝えない",volitional:"手伝おう",passive:"手伝われる",causative:"手伝わせる",imperative:"手伝え",conditional:"手伝えば",conditional_neg:"手伝わなければ"},
    forms_romaji:{present:"tetsudau",present_polite:"tetsudaimasu",past:"tetsudatta",past_polite:"tetsudaimashita",negative:"tetsudawanai",negative_polite:"tetsudaimasen",neg_past:"tetsudawanakatta",neg_past_polite:"tetsudaimasen deshita",te_form:"tetsudatte",neg_te:"tetsudawanakute",ing_form:"tetsudatte iru",tai_form:"tetsudaitai",potential:"tetsudaeru",potential_neg:"tetsudaenai",volitional:"tetsudaou",passive:"tetsudawareru",causative:"tetsudawaseru",imperative:"tetsudae",conditional:"tetsudaeba",conditional_neg:"tetsudawanakereba"},
    example_sentence:"手伝ってください。",example_sentence_en:"Please help me."
  },
  {
    dictionary:"忘れる",hiragana:"わすれる",romaji:"wasureru",meaning_en:"to forget",group:"ichidan",level:"N3",
    forms:{present:"忘れる",present_polite:"忘れます",past:"忘れた",past_polite:"忘れました",negative:"忘れない",negative_polite:"忘れません",neg_past:"忘れなかった",neg_past_polite:"忘れませんでした",te_form:"忘れて",neg_te:"忘れなくて",ing_form:"忘れている",tai_form:"忘れたい",potential:"忘れられる",potential_neg:"忘れられない",volitional:"忘れよう",passive:"忘れられる",causative:"忘れさせる",imperative:"忘れろ",conditional:"忘れれば",conditional_neg:"忘れなければ"},
    forms_romaji:{present:"wasureru",present_polite:"wasuremasu",past:"wasureta",past_polite:"wasuremashita",negative:"wasurenai",negative_polite:"wasuremasen",neg_past:"wasurenakatta",neg_past_polite:"wasuremasen deshita",te_form:"wasurete",neg_te:"wasurenakute",ing_form:"wasurete iru",tai_form:"wasuretai",potential:"wasurerareru",potential_neg:"wasurerarenai",volitional:"wasureyou",passive:"wasurerareru",causative:"wasuresaseru",imperative:"wasurero",conditional:"wasurereba",conditional_neg:"wasurenakereba"},
    example_sentence:"傘を忘れました。",example_sentence_en:"I forgot my umbrella."
  },
  {
    dictionary:"覚える",hiragana:"おぼえる",romaji:"oboeru",meaning_en:"to remember / memorize",group:"ichidan",level:"N3",
    forms:{present:"覚える",present_polite:"覚えます",past:"覚えた",past_polite:"覚えました",negative:"覚えない",negative_polite:"覚えません",neg_past:"覚えなかった",neg_past_polite:"覚えませんでした",te_form:"覚えて",neg_te:"覚えなくて",ing_form:"覚えている",tai_form:"覚えたい",potential:"覚えられる",potential_neg:"覚えられない",volitional:"覚えよう",passive:"覚えられる",causative:"覚えさせる",imperative:"覚えろ",conditional:"覚えれば",conditional_neg:"覚えなければ"},
    forms_romaji:{present:"oboeru",present_polite:"oboemasu",past:"oboeta",past_polite:"oboemashita",negative:"oboenai",negative_polite:"oboemasen",neg_past:"oboenakatta",neg_past_polite:"oboemasen deshita",te_form:"oboete",neg_te:"oboenakute",ing_form:"oboete iru",tai_form:"oboetai",potential:"oboerareru",potential_neg:"oboearenai",volitional:"oboeyou",passive:"oboerareru",causative:"oboesaseru",imperative:"oboero",conditional:"oboereb",conditional_neg:"oboenakereba"},
    example_sentence:"単語を覚えます。",example_sentence_en:"I memorize vocabulary."
  },
  {
    dictionary:"考える",hiragana:"かんがえる",romaji:"kangaeru",meaning_en:"to think / consider",group:"ichidan",level:"N3",
    forms:{present:"考える",present_polite:"考えます",past:"考えた",past_polite:"考えました",negative:"考えない",negative_polite:"考えません",neg_past:"考えなかった",neg_past_polite:"考えませんでした",te_form:"考えて",neg_te:"考えなくて",ing_form:"考えている",tai_form:"考えたい",potential:"考えられる",potential_neg:"考えられない",volitional:"考えよう",passive:"考えられる",causative:"考えさせる",imperative:"考えろ",conditional:"考えれば",conditional_neg:"考えなければ"},
    forms_romaji:{present:"kangaeru",present_polite:"kangaemasu",past:"kangaeta",past_polite:"kangaemashita",negative:"kangaenai",negative_polite:"kangaemasen",neg_past:"kangaenakatta",neg_past_polite:"kangaemasen deshita",te_form:"kangaete",neg_te:"kangaenakute",ing_form:"kangaete iru",tai_form:"kangaetai",potential:"kangaerareru",potential_neg:"kangaearenai",volitional:"kangaeyou",passive:"kangaerareru",causative:"kangaesaseru",imperative:"kangaero",conditional:"kangaereba",conditional_neg:"kangaenakereba"},
    example_sentence:"よく考えてください。",example_sentence_en:"Please think carefully."
  },
  {
    dictionary:"信じる",hiragana:"しんじる",romaji:"shinjiru",meaning_en:"to believe / trust",group:"ichidan",level:"N3",
    forms:{present:"信じる",present_polite:"信じます",past:"信じた",past_polite:"信じました",negative:"信じない",negative_polite:"信じません",neg_past:"信じなかった",neg_past_polite:"信じませんでした",te_form:"信じて",neg_te:"信じなくて",ing_form:"信じている",tai_form:"信じたい",potential:"信じられる",potential_neg:"信じられない",volitional:"信じよう",passive:"信じられる",causative:"信じさせる",imperative:"信じろ",conditional:"信じれば",conditional_neg:"信じなければ"},
    forms_romaji:{present:"shinjiru",present_polite:"shinjimasu",past:"shinjita",past_polite:"shinjimashita",negative:"shinjinai",negative_polite:"shinjimasen",neg_past:"shinjinakatta",neg_past_polite:"shinjimasen deshita",te_form:"shinjite",neg_te:"shinjinakute",ing_form:"shinjite iru",tai_form:"shinjitai",potential:"shinjirareru",potential_neg:"shinjirarenai",volitional:"shinjiyou",passive:"shinjirareru",causative:"shinjisaseru",imperative:"shinjiro",conditional:"shinjireba",conditional_neg:"shinjinakereba"},
    example_sentence:"それを信じます。",example_sentence_en:"I believe that."
  },
  {
    dictionary:"感じる",hiragana:"かんじる",romaji:"kanjiru",meaning_en:"to feel / sense",group:"ichidan",level:"N3",
    forms:{present:"感じる",present_polite:"感じます",past:"感じた",past_polite:"感じました",negative:"感じない",negative_polite:"感じません",neg_past:"感じなかった",neg_past_polite:"感じませんでした",te_form:"感じて",neg_te:"感じなくて",ing_form:"感じている",tai_form:"感じたい",potential:"感じられる",potential_neg:"感じられない",volitional:"感じよう",passive:"感じられる",causative:"感じさせる",imperative:"感じろ",conditional:"感じれば",conditional_neg:"感じなければ"},
    forms_romaji:{present:"kanjiru",present_polite:"kanjimasu",past:"kanjita",past_polite:"kanjimashita",negative:"kanjinai",negative_polite:"kanjimasen",neg_past:"kanjinakatta",neg_past_polite:"kanjimasen deshita",te_form:"kanjite",neg_te:"kanjinakute",ing_form:"kanjite iru",tai_form:"kanjitai",potential:"kanjirareru",potential_neg:"kanjirarenai",volitional:"kanjiyou",passive:"kanjirareru",causative:"kanjisaseru",imperative:"kanjiro",conditional:"kanjireba",conditional_neg:"kanjinakereba"},
    example_sentence:"幸せを感じます。",example_sentence_en:"I feel happy."
  },
  {
    dictionary:"変わる",hiragana:"かわる",romaji:"kawaru",meaning_en:"to change",group:"godan",level:"N3",
    forms:{present:"変わる",present_polite:"変わります",past:"変わった",past_polite:"変わりました",negative:"変わらない",negative_polite:"変わりません",neg_past:"変わらなかった",neg_past_polite:"変わりませんでした",te_form:"変わって",neg_te:"変わらなくて",ing_form:"変わっている",tai_form:"変わりたい",potential:"変われる",potential_neg:"変われない",volitional:"変わろう",passive:"変わられる",causative:"変わらせる",imperative:"変われ",conditional:"変われば",conditional_neg:"変わらなければ"},
    forms_romaji:{present:"kawaru",present_polite:"kawarimasu",past:"kawatta",past_polite:"kawarimashita",negative:"kawaranai",negative_polite:"kawarimasen",neg_past:"kawaranakatta",neg_past_polite:"kawarimasen deshita",te_form:"kawatte",neg_te:"kawaranakute",ing_form:"kawatte iru",tai_form:"kawaritai",potential:"kawareru",potential_neg:"kawarenai",volitional:"kawarou",passive:"kawarareru",causative:"kawaraseru",imperative:"kawara",conditional:"kawareba",conditional_neg:"kawaranakereba"},
    example_sentence:"気持ちが変わりました。",example_sentence_en:"My feelings changed."
  },
  // ===== N2/N1 VERBS =====
  {
    dictionary:"生きる",hiragana:"いきる",romaji:"ikiru",meaning_en:"to live",group:"ichidan",level:"N2",
    forms:{present:"生きる",present_polite:"生きます",past:"生きた",past_polite:"生きました",negative:"生きない",negative_polite:"生きません",neg_past:"生きなかった",neg_past_polite:"生きませんでした",te_form:"生きて",neg_te:"生きなくて",ing_form:"生きている",tai_form:"生きたい",potential:"生きられる",potential_neg:"生きられない",volitional:"生きよう",passive:"生きられる",causative:"生きさせる",imperative:"生きろ",conditional:"生きれば",conditional_neg:"生きなければ"},
    forms_romaji:{present:"ikiru",present_polite:"ikimasu",past:"ikita",past_polite:"ikimashita",negative:"ikinai",negative_polite:"ikimasen",neg_past:"ikinakatta",neg_past_polite:"ikimasen deshita",te_form:"ikite",neg_te:"ikinakute",ing_form:"ikite iru",tai_form:"ikitai",potential:"ikireru",potential_neg:"ikirerenai",volitional:"ikiyou",passive:"ikirerareru",causative:"ikisaseru",imperative:"ikiro",conditional:"ikireba",conditional_neg:"ikinakereba"},
    example_sentence:"もっと長く生きたい。",example_sentence_en:"I want to live longer."
  },
  {
    dictionary:"死ぬ",hiragana:"しぬ",romaji:"shinu",meaning_en:"to die",group:"godan",level:"N2",
    forms:{present:"死ぬ",present_polite:"死にます",past:"死んだ",past_polite:"死にました",negative:"死なない",negative_polite:"死にません",neg_past:"死ななかった",neg_past_polite:"死にませんでした",te_form:"死んで",neg_te:"死ななくて",ing_form:"死んでいる",tai_form:"死にたい",potential:"死ねる",potential_neg:"死ねない",volitional:"死のう",passive:"死なれる",causative:"死なせる",imperative:"死ね",conditional:"死ねば",conditional_neg:"死ななければ"},
    forms_romaji:{present:"shinu",present_polite:"shinimasu",past:"shinda",past_polite:"shinimashita",negative:"shinanai",negative_polite:"shinimasen",neg_past:"shinanakatta",neg_past_polite:"shinimasen deshita",te_form:"shinde",neg_te:"shinanakute",ing_form:"shinde iru",tai_form:"shinitai",potential:"shineru",potential_neg:"shinenai",volitional:"shinoou",passive:"shinareru",causative:"shinaseru",imperative:"shine",conditional:"shineba",conditional_neg:"shinanakereba"},
    example_sentence:"花が死にました。",example_sentence_en:"The flower died."
  },
  {
    dictionary:"渡す",hiragana:"わたす",romaji:"watasu",meaning_en:"to hand over / pass",group:"godan",level:"N2",
    forms:{present:"渡す",present_polite:"渡します",past:"渡した",past_polite:"渡しました",negative:"渡さない",negative_polite:"渡しません",neg_past:"渡さなかった",neg_past_polite:"渡しませんでした",te_form:"渡して",neg_te:"渡さなくて",ing_form:"渡している",tai_form:"渡したい",potential:"渡せる",potential_neg:"渡せない",volitional:"渡そう",passive:"渡される",causative:"渡させる",imperative:"渡せ",conditional:"渡せば",conditional_neg:"渡さなければ"},
    forms_romaji:{present:"watasu",present_polite:"watashimasu",past:"watashita",past_polite:"watashimashita",negative:"watasanai",negative_polite:"watashimasen",neg_past:"watasanakatta",neg_past_polite:"watashimasen deshita",te_form:"watashite",neg_te:"watasanakute",ing_form:"watashite iru",tai_form:"watashitai",potential:"wataseru",potential_neg:"watasenai",volitional:"watasou",passive:"watasareru",causative:"watasaseru",imperative:"watase",conditional:"wataseba",conditional_neg:"watasanakereba"},
    example_sentence:"書類を渡してください。",example_sentence_en:"Please hand over the documents."
  },
  {
    dictionary:"受ける",hiragana:"うける",romaji:"ukeru",meaning_en:"to receive / take (a test)",group:"ichidan",level:"N2",
    forms:{present:"受ける",present_polite:"受けます",past:"受けた",past_polite:"受けました",negative:"受けない",negative_polite:"受けません",neg_past:"受けなかった",neg_past_polite:"受けませんでした",te_form:"受けて",neg_te:"受けなくて",ing_form:"受けている",tai_form:"受けたい",potential:"受けられる",potential_neg:"受けられない",volitional:"受けよう",passive:"受けられる",causative:"受けさせる",imperative:"受けろ",conditional:"受ければ",conditional_neg:"受けなければ"},
    forms_romaji:{present:"ukeru",present_polite:"ukemasu",past:"uketa",past_polite:"ukemashita",negative:"ukenai",negative_polite:"ukemasen",neg_past:"ukenakatta",neg_past_polite:"ukemasen deshita",te_form:"ukete",neg_te:"ukenakute",ing_form:"ukete iru",tai_form:"uketai",potential:"ukerareru",potential_neg:"ukerarenai",volitional:"ukeyou",passive:"ukerareru",causative:"ukesaseru",imperative:"ukero",conditional:"ukereba",conditional_neg:"ukenakereba"},
    example_sentence:"試験を受けます。",example_sentence_en:"I take an exam."
  },
  {
    dictionary:"続ける",hiragana:"つづける",romaji:"tsuzukeru",meaning_en:"to continue",group:"ichidan",level:"N2",
    forms:{present:"続ける",present_polite:"続けます",past:"続けた",past_polite:"続けました",negative:"続けない",negative_polite:"続けません",neg_past:"続けなかった",neg_past_polite:"続けませんでした",te_form:"続けて",neg_te:"続けなくて",ing_form:"続けている",tai_form:"続けたい",potential:"続けられる",potential_neg:"続けられない",volitional:"続けよう",passive:"続けられる",causative:"続けさせる",imperative:"続けろ",conditional:"続ければ",conditional_neg:"続けなければ"},
    forms_romaji:{present:"tsuzukeru",present_polite:"tsuzukemasu",past:"tsuzuketa",past_polite:"tsuzukemashita",negative:"tsuzukenai",negative_polite:"tsuzukemasen",neg_past:"tsuzukenakatta",neg_past_polite:"tsuzukemasen deshita",te_form:"tsuzukete",neg_te:"tsuzukenakute",ing_form:"tsuzukete iru",tai_form:"tsuzuketai",potential:"tsuzukerareru",potential_neg:"tsuzukerarenai",volitional:"tsuzukeyou",passive:"tsuzukerareru",causative:"tsuzukesaseru",imperative:"tsuzukero",conditional:"tsuzukereba",conditional_neg:"tsuzukenakereba"},
    example_sentence:"勉強を続けます。",example_sentence_en:"I continue studying."
  },
  {
    dictionary:"求める",hiragana:"もとめる",romaji:"motomeru",meaning_en:"to seek / demand",group:"ichidan",level:"N1",
    forms:{present:"求める",present_polite:"求めます",past:"求めた",past_polite:"求めました",negative:"求めない",negative_polite:"求めません",neg_past:"求めなかった",neg_past_polite:"求めませんでした",te_form:"求めて",neg_te:"求めなくて",ing_form:"求めている",tai_form:"求めたい",potential:"求められる",potential_neg:"求められない",volitional:"求めよう",passive:"求められる",causative:"求めさせる",imperative:"求めろ",conditional:"求めれば",conditional_neg:"求めなければ"},
    forms_romaji:{present:"motomeru",present_polite:"motomemasu",past:"motometa",past_polite:"motomemashita",negative:"motomenai",negative_polite:"motomemasen",neg_past:"motomenakatta",neg_past_polite:"motomemasen deshita",te_form:"motomete",neg_te:"motomenakute",ing_form:"motomete iru",tai_form:"motometai",potential:"motomerareru",potential_neg:"motomerarenai",volitional:"motomeyou",passive:"motomerareru",causative:"motomesaseru",imperative:"motomero",conditional:"motomereba",conditional_neg:"motomenakereba"},
    example_sentence:"説明を求めます。",example_sentence_en:"I seek an explanation."
  },
  // ===== ADDITIONAL VERBS (from japaneseverbconjugator.com) =====
  {
    dictionary:"答える",hiragana:"こたえる",romaji:"kotaeru",meaning_en:"to answer",group:"ichidan",level:"N4",
    forms:{present:"答える",present_polite:"答えます",past:"答えた",past_polite:"答えました",negative:"答えない",negative_polite:"答えません",neg_past:"答えなかった",neg_past_polite:"答えませんでした",te_form:"答えて",neg_te:"答えなくて",ing_form:"答えている",tai_form:"答えたい",potential:"答えられる",potential_neg:"答えられない",volitional:"答えよう",passive:"答えられる",causative:"答えさせる",imperative:"答えろ",conditional:"答えれば",conditional_neg:"答えなければ"},
    forms_romaji:{present:"kotaeru",present_polite:"kotaemasu",past:"kotaeta",past_polite:"kotaemashita",negative:"kotaenai",negative_polite:"kotaemasen",neg_past:"kotaenakatta",neg_past_polite:"kotaemasen deshita",te_form:"kotaete",neg_te:"kotaenakute",ing_form:"kotaete iru",tai_form:"kotaetai",potential:"kotaerareru",potential_neg:"kotaerarenai",volitional:"kotaeyou",passive:"kotaerareru",causative:"kotaesaseru",imperative:"kotaero",conditional:"kotaereba",conditional_neg:"kotaenakereba"},
    example_sentence:"質問に答えてください。",example_sentence_en:"Please answer the question."
  },
  {
    dictionary:"現れる",hiragana:"あらわれる",romaji:"arawareru",meaning_en:"to appear / show up",group:"ichidan",level:"N3",
    forms:{present:"現れる",present_polite:"現れます",past:"現れた",past_polite:"現れました",negative:"現れない",negative_polite:"現れません",neg_past:"現れなかった",neg_past_polite:"現れませんでした",te_form:"現れて",neg_te:"現れなくて",ing_form:"現れている",tai_form:"現れたい",potential:"現れられる",potential_neg:"現れられない",volitional:"現れよう",passive:"現れられる",causative:"現れさせる",imperative:"現れろ",conditional:"現れれば",conditional_neg:"現れなければ"},
    forms_romaji:{present:"arawareru",present_polite:"arawaremasu",past:"arawareta",past_polite:"arawaremashita",negative:"arawarenai",negative_polite:"arawaremasen",neg_past:"arawarenakatta",neg_past_polite:"arawaremasen deshita",te_form:"arawarete",neg_te:"arawarenakute",ing_form:"arawarete iru",tai_form:"arawaretai",potential:"arawarerareru",potential_neg:"arawarerarenai",volitional:"arawareyou",passive:"arawarerareru",causative:"arawaresaseru",imperative:"arawarero",conditional:"arawarereba",conditional_neg:"arawarenakereba"},
    example_sentence:"太陽が現れました。",example_sentence_en:"The sun appeared."
  },
  {
    dictionary:"着く",hiragana:"つく",romaji:"tsuku",meaning_en:"to arrive",group:"godan",level:"N4",
    forms:{present:"着く",present_polite:"着きます",past:"着いた",past_polite:"着きました",negative:"着かない",negative_polite:"着きません",neg_past:"着かなかった",neg_past_polite:"着きませんでした",te_form:"着いて",neg_te:"着かなくて",ing_form:"着いている",tai_form:"着きたい",potential:"着ける",potential_neg:"着けない",volitional:"着こう",passive:"着かれる",causative:"着かせる",imperative:"着け",conditional:"着けば",conditional_neg:"着かなければ"},
    forms_romaji:{present:"tsuku",present_polite:"tsukimasu",past:"tsuita",past_polite:"tsukimashita",negative:"tsukanai",negative_polite:"tsukimasen",neg_past:"tsukanakatta",neg_past_polite:"tsukimasen deshita",te_form:"tsuite",neg_te:"tsukanakute",ing_form:"tsuite iru",tai_form:"tsukitai",potential:"tsukeru",potential_neg:"tsukenai",volitional:"tsukou",passive:"tsukareru",causative:"tsukaseru",imperative:"tsuke",conditional:"tsukeba",conditional_neg:"tsukanakereba"},
    example_sentence:"駅に着きました。",example_sentence_en:"I arrived at the station."
  },
  {
    dictionary:"避ける",hiragana:"さける",romaji:"sakeru",meaning_en:"to avoid / dodge",group:"ichidan",level:"N3",
    forms:{present:"避ける",present_polite:"避けます",past:"避けた",past_polite:"避けました",negative:"避けない",negative_polite:"避けません",neg_past:"避けなかった",neg_past_polite:"避けませんでした",te_form:"避けて",neg_te:"避けなくて",ing_form:"避けている",tai_form:"避けたい",potential:"避けられる",potential_neg:"避けられない",volitional:"避けよう",passive:"避けられる",causative:"避けさせる",imperative:"避けろ",conditional:"避ければ",conditional_neg:"避けなければ"},
    forms_romaji:{present:"sakeru",present_polite:"sakemasu",past:"saketa",past_polite:"sakemashita",negative:"sakenai",negative_polite:"sakemasen",neg_past:"sakenakatta",neg_past_polite:"sakemasen deshita",te_form:"sakete",neg_te:"sakenakute",ing_form:"sakete iru",tai_form:"saketai",potential:"sakerareru",potential_neg:"sakerarenai",volitional:"sakeyou",passive:"sakerareru",causative:"sakesaseru",imperative:"sakero",conditional:"sakereba",conditional_neg:"sakenakereba"},
    example_sentence:"問題を避けます。",example_sentence_en:"I avoid the problem."
  },
  {
    dictionary:"浴びる",hiragana:"あびる",romaji:"abiru",meaning_en:"to bathe / take a shower",group:"ichidan",level:"N4",
    forms:{present:"浴びる",present_polite:"浴びます",past:"浴びた",past_polite:"浴びました",negative:"浴びない",negative_polite:"浴びません",neg_past:"浴びなかった",neg_past_polite:"浴びませんでした",te_form:"浴びて",neg_te:"浴びなくて",ing_form:"浴びている",tai_form:"浴びたい",potential:"浴びられる",potential_neg:"浴びられない",volitional:"浴びよう",passive:"浴びられる",causative:"浴びさせる",imperative:"浴びろ",conditional:"浴びれば",conditional_neg:"浴びなければ"},
    forms_romaji:{present:"abiru",present_polite:"abimasu",past:"abita",past_polite:"abimashita",negative:"abinai",negative_polite:"abimasen",neg_past:"abinakatta",neg_past_polite:"abimasen deshita",te_form:"abite",neg_te:"abinakute",ing_form:"abite iru",tai_form:"abitai",potential:"abirareru",potential_neg:"abirarenai",volitional:"abiyou",passive:"abirareru",causative:"abisaseru",imperative:"abiro",conditional:"abireba",conditional_neg:"abinakereba"},
    example_sentence:"シャワーを浴びます。",example_sentence_en:"I take a shower."
  },
  {
    dictionary:"生まれる",hiragana:"うまれる",romaji:"umareru",meaning_en:"to be born",group:"ichidan",level:"N4",
    forms:{present:"生まれる",present_polite:"生まれます",past:"生まれた",past_polite:"生まれました",negative:"生まれない",negative_polite:"生まれません",neg_past:"生まれなかった",neg_past_polite:"生まれませんでした",te_form:"生まれて",neg_te:"生まれなくて",ing_form:"生まれている",tai_form:"生まれたい",potential:"生まれられる",potential_neg:"生まれられない",volitional:"生まれよう",passive:"生まれられる",causative:"生まれさせる",imperative:"生まれろ",conditional:"生まれれば",conditional_neg:"生まれなければ"},
    forms_romaji:{present:"umareru",present_polite:"umaremasu",past:"umareta",past_polite:"umaremashita",negative:"umarenai",negative_polite:"umaremasen",neg_past:"umarenakatta",neg_past_polite:"umaremasen deshita",te_form:"umarete",neg_te:"umarenakute",ing_form:"umarete iru",tai_form:"umaretai",potential:"umarerareru",potential_neg:"umarerarenai",volitional:"umareyou",passive:"umarerareru",causative:"umaresaseru",imperative:"umarero",conditional:"umarerebа",conditional_neg:"umarenakereba"},
    example_sentence:"東京で生まれました。",example_sentence_en:"I was born in Tokyo."
  },
  {
    dictionary:"負ける",hiragana:"まける",romaji:"makeru",meaning_en:"to lose / be defeated",group:"ichidan",level:"N4",
    forms:{present:"負ける",present_polite:"負けます",past:"負けた",past_polite:"負けました",negative:"負けない",negative_polite:"負けません",neg_past:"負けなかった",neg_past_polite:"負けませんでした",te_form:"負けて",neg_te:"負けなくて",ing_form:"負けている",tai_form:"負けたい",potential:"負けられる",potential_neg:"負けられない",volitional:"負けよう",passive:"負けられる",causative:"負けさせる",imperative:"負けろ",conditional:"負ければ",conditional_neg:"負けなければ"},
    forms_romaji:{present:"makeru",present_polite:"makemasu",past:"maketa",past_polite:"makemashita",negative:"makenai",negative_polite:"makemasen",neg_past:"makenakatta",neg_past_polite:"makemasen deshita",te_form:"makete",neg_te:"makenakute",ing_form:"makete iru",tai_form:"maketai",potential:"makerareru",potential_neg:"makerarenai",volitional:"makeyou",passive:"makerareru",causative:"makesaseru",imperative:"makero",conditional:"makereba",conditional_neg:"makenakereba"},
    example_sentence:"試合に負けました。",example_sentence_en:"I lost the match."
  },
  {
    dictionary:"勝つ",hiragana:"かつ",romaji:"katsu",meaning_en:"to win",group:"godan",level:"N4",
    forms:{present:"勝つ",present_polite:"勝ちます",past:"勝った",past_polite:"勝ちました",negative:"勝たない",negative_polite:"勝ちません",neg_past:"勝たなかった",neg_past_polite:"勝ちませんでした",te_form:"勝って",neg_te:"勝たなくて",ing_form:"勝っている",tai_form:"勝ちたい",potential:"勝てる",potential_neg:"勝てない",volitional:"勝とう",passive:"勝たれる",causative:"勝たせる",imperative:"勝て",conditional:"勝てば",conditional_neg:"勝たなければ"},
    forms_romaji:{present:"katsu",present_polite:"kachimasu",past:"katta",past_polite:"kachimashita",negative:"katanai",negative_polite:"kachimasen",neg_past:"katanakatta",neg_past_polite:"kachimasen deshita",te_form:"katte",neg_te:"katanakute",ing_form:"katte iru",tai_form:"kachitai",potential:"kateru",potential_neg:"katenai",volitional:"katou",passive:"katareru",causative:"kataseru",imperative:"kate",conditional:"kateba",conditional_neg:"katanakereba"},
    example_sentence:"試合に勝ちました。",example_sentence_en:"I won the match."
  },
  {
    dictionary:"焼く",hiragana:"やく",romaji:"yaku",meaning_en:"to bake / grill",group:"godan",level:"N4",
    forms:{present:"焼く",present_polite:"焼きます",past:"焼いた",past_polite:"焼きました",negative:"焼かない",negative_polite:"焼きません",neg_past:"焼かなかった",neg_past_polite:"焼きませんでした",te_form:"焼いて",neg_te:"焼かなくて",ing_form:"焼いている",tai_form:"焼きたい",potential:"焼ける",potential_neg:"焼けない",volitional:"焼こう",passive:"焼かれる",causative:"焼かせる",imperative:"焼け",conditional:"焼けば",conditional_neg:"焼かなければ"},
    forms_romaji:{present:"yaku",present_polite:"yakimasu",past:"yaita",past_polite:"yakimashita",negative:"yakanai",negative_polite:"yakimasen",neg_past:"yakanakatta",neg_past_polite:"yakimasen deshita",te_form:"yaite",neg_te:"yakanakute",ing_form:"yaite iru",tai_form:"yakitai",potential:"yakeru",potential_neg:"yakenai",volitional:"yakou",passive:"yakareru",causative:"yakaseru",imperative:"yake",conditional:"yakeba",conditional_neg:"yakanakereba"},
    example_sentence:"パンを焼きます。",example_sentence_en:"I bake bread."
  },
  {
    dictionary:"切る",hiragana:"きる",romaji:"kiru_cut",meaning_en:"to cut",group:"godan",level:"N4",
    forms:{present:"切る",present_polite:"切ります",past:"切った",past_polite:"切りました",negative:"切らない",negative_polite:"切りません",neg_past:"切らなかった",neg_past_polite:"切りませんでした",te_form:"切って",neg_te:"切らなくて",ing_form:"切っている",tai_form:"切りたい",potential:"切れる",potential_neg:"切れない",volitional:"切ろう",passive:"切られる",causative:"切らせる",imperative:"切れ",conditional:"切れば",conditional_neg:"切らなければ"},
    forms_romaji:{present:"kiru",present_polite:"kirimasu",past:"kitta",past_polite:"kirimashita",negative:"kiranai",negative_polite:"kirimasen",neg_past:"kiranakatta",neg_past_polite:"kirimasen deshita",te_form:"kitte",neg_te:"kiranakute",ing_form:"kitte iru",tai_form:"kiritai",potential:"kireru",potential_neg:"kirenai",volitional:"kirou",passive:"kirareru",causative:"kiraseru",imperative:"kire",conditional:"kireba",conditional_neg:"kiranakereba"},
    example_sentence:"野菜を切ります。",example_sentence_en:"I cut vegetables."
  },
  {
    dictionary:"押す",hiragana:"おす",romaji:"osu",meaning_en:"to push / press",group:"godan",level:"N4",
    forms:{present:"押す",present_polite:"押します",past:"押した",past_polite:"押しました",negative:"押さない",negative_polite:"押しません",neg_past:"押さなかった",neg_past_polite:"押しませんでした",te_form:"押して",neg_te:"押さなくて",ing_form:"押している",tai_form:"押したい",potential:"押せる",potential_neg:"押せない",volitional:"押そう",passive:"押される",causative:"押させる",imperative:"押せ",conditional:"押せば",conditional_neg:"押さなければ"},
    forms_romaji:{present:"osu",present_polite:"oshimasu",past:"oshita",past_polite:"oshimashita",negative:"osanai",negative_polite:"oshimasen",neg_past:"osanakatta",neg_past_polite:"oshimasen deshita",te_form:"oshite",neg_te:"osanakute",ing_form:"oshite iru",tai_form:"oshitai",potential:"oseru",potential_neg:"osenai",volitional:"osou",passive:"osareru",causative:"osaseru",imperative:"ose",conditional:"oseba",conditional_neg:"osanakereba"},
    example_sentence:"ボタンを押してください。",example_sentence_en:"Please press the button."
  },
  {
    dictionary:"引く",hiragana:"ひく",romaji:"hiku",meaning_en:"to pull / draw",group:"godan",level:"N4",
    forms:{present:"引く",present_polite:"引きます",past:"引いた",past_polite:"引きました",negative:"引かない",negative_polite:"引きません",neg_past:"引かなかった",neg_past_polite:"引きませんでした",te_form:"引いて",neg_te:"引かなくて",ing_form:"引いている",tai_form:"引きたい",potential:"引ける",potential_neg:"引けない",volitional:"引こう",passive:"引かれる",causative:"引かせる",imperative:"引け",conditional:"引けば",conditional_neg:"引かなければ"},
    forms_romaji:{present:"hiku",present_polite:"hikimasu",past:"hiita",past_polite:"hikimashita",negative:"hikanai",negative_polite:"hikimasen",neg_past:"hikanakatta",neg_past_polite:"hikimasen deshita",te_form:"hiite",neg_te:"hikanakute",ing_form:"hiite iru",tai_form:"hikitai",potential:"hikeru",potential_neg:"hikenai",volitional:"hikou",passive:"hikareru",causative:"hikaseru",imperative:"hike",conditional:"hikeba",conditional_neg:"hikanakereba"},
    example_sentence:"ドアを引いてください。",example_sentence_en:"Please pull the door."
  },
  {
    dictionary:"投げる",hiragana:"なげる",romaji:"nageru",meaning_en:"to throw",group:"ichidan",level:"N4",
    forms:{present:"投げる",present_polite:"投げます",past:"投げた",past_polite:"投げました",negative:"投げない",negative_polite:"投げません",neg_past:"投げなかった",neg_past_polite:"投げませんでした",te_form:"投げて",neg_te:"投げなくて",ing_form:"投げている",tai_form:"投げたい",potential:"投げられる",potential_neg:"投げられない",volitional:"投げよう",passive:"投げられる",causative:"投げさせる",imperative:"投げろ",conditional:"投げれば",conditional_neg:"投げなければ"},
    forms_romaji:{present:"nageru",present_polite:"nagemasu",past:"nageta",past_polite:"nagemashita",negative:"nagenai",negative_polite:"nagemasen",neg_past:"nagenakatta",neg_past_polite:"nagemasen deshita",te_form:"nagete",neg_te:"nagenakute",ing_form:"nagete iru",tai_form:"nagetai",potential:"nagerareru",potential_neg:"nagerarenai",volitional:"nageyou",passive:"nagerareru",causative:"nagesaseru",imperative:"nagero",conditional:"nagereba",conditional_neg:"nagenakereba"},
    example_sentence:"ボールを投げます。",example_sentence_en:"I throw a ball."
  },
  {
    dictionary:"捕まえる",hiragana:"つかまえる",romaji:"tsukamaeru",meaning_en:"to catch / grab",group:"ichidan",level:"N3",
    forms:{present:"捕まえる",present_polite:"捕まえます",past:"捕まえた",past_polite:"捕まえました",negative:"捕まえない",negative_polite:"捕まえません",neg_past:"捕まえなかった",neg_past_polite:"捕まえませんでした",te_form:"捕まえて",neg_te:"捕まえなくて",ing_form:"捕まえている",tai_form:"捕まえたい",potential:"捕まえられる",potential_neg:"捕まえられない",volitional:"捕まえよう",passive:"捕まえられる",causative:"捕まえさせる",imperative:"捕まえろ",conditional:"捕まえれば",conditional_neg:"捕まえなければ"},
    forms_romaji:{present:"tsukamaeru",present_polite:"tsukamaemasu",past:"tsukamaeta",past_polite:"tsukamaemashita",negative:"tsukamaemai",negative_polite:"tsukamaemasen",neg_past:"tsukamaenakatta",neg_past_polite:"tsukamaemasen deshita",te_form:"tsukamaete",neg_te:"tsukamaenakute",ing_form:"tsukamaete iru",tai_form:"tsukamaemai",potential:"tsukamaerareru",potential_neg:"tsukamaerarenai",volitional:"tsukamaeyou",passive:"tsukamaerareru",causative:"tsukamaesaseru",imperative:"tsukamaero",conditional:"tsukamaerebа",conditional_neg:"tsukamaenakereba"},
    example_sentence:"魚を捕まえます。",example_sentence_en:"I catch a fish."
  },
  {
    dictionary:"開ける",hiragana:"あける",romaji:"akeru",meaning_en:"to open",group:"ichidan",level:"N5",
    forms:{present:"開ける",present_polite:"開けます",past:"開けた",past_polite:"開けました",negative:"開けない",negative_polite:"開けません",neg_past:"開けなかった",neg_past_polite:"開けませんでした",te_form:"開けて",neg_te:"開けなくて",ing_form:"開けている",tai_form:"開けたい",potential:"開けられる",potential_neg:"開けられない",volitional:"開けよう",passive:"開けられる",causative:"開けさせる",imperative:"開けろ",conditional:"開ければ",conditional_neg:"開けなければ"},
    forms_romaji:{present:"akeru",present_polite:"akemasu",past:"aketa",past_polite:"akemashita",negative:"akenai",negative_polite:"akemasen",neg_past:"akenakatta",neg_past_polite:"akemasen deshita",te_form:"akete",neg_te:"akenakute",ing_form:"akete iru",tai_form:"aketai",potential:"akerareru",potential_neg:"akerarenai",volitional:"akeyou",passive:"akerareru",causative:"akesaseru",imperative:"akero",conditional:"akereba",conditional_neg:"akenakereba"},
    example_sentence:"窓を開けてください。",example_sentence_en:"Please open the window."
  },
  {
    dictionary:"閉める",hiragana:"しめる",romaji:"shimeru",meaning_en:"to close / shut",group:"ichidan",level:"N5",
    forms:{present:"閉める",present_polite:"閉めます",past:"閉めた",past_polite:"閉めました",negative:"閉めない",negative_polite:"閉めません",neg_past:"閉めなかった",neg_past_polite:"閉めませんでした",te_form:"閉めて",neg_te:"閉めなくて",ing_form:"閉めている",tai_form:"閉めたい",potential:"閉められる",potential_neg:"閉められない",volitional:"閉めよう",passive:"閉められる",causative:"閉めさせる",imperative:"閉めろ",conditional:"閉めれば",conditional_neg:"閉めなければ"},
    forms_romaji:{present:"shimeru",present_polite:"shimemasu",past:"shimeta",past_polite:"shimemashita",negative:"shimensai",negative_polite:"shimemasen",neg_past:"shimenakatta",neg_past_polite:"shimemasen deshita",te_form:"shimete",neg_te:"shimenakute",ing_form:"shimete iru",tai_form:"shimetai",potential:"shimerareru",potential_neg:"shimerarenai",volitional:"shimeyou",passive:"shimerareru",causative:"shimesaseru",imperative:"shimero",conditional:"shimereba",conditional_neg:"shimenakereba"},
    example_sentence:"ドアを閉めてください。",example_sentence_en:"Please close the door."
  },
  {
    dictionary:"送る",hiragana:"おくる",romaji:"okuru",meaning_en:"to send",group:"godan",level:"N4",
    forms:{present:"送る",present_polite:"送ります",past:"送った",past_polite:"送りました",negative:"送らない",negative_polite:"送りません",neg_past:"送らなかった",neg_past_polite:"送りませんでした",te_form:"送って",neg_te:"送らなくて",ing_form:"送っている",tai_form:"送りたい",potential:"送れる",potential_neg:"送れない",volitional:"送ろう",passive:"送られる",causative:"送らせる",imperative:"送れ",conditional:"送れば",conditional_neg:"送らなければ"},
    forms_romaji:{present:"okuru",present_polite:"okurimasu",past:"okutta",past_polite:"okurimashita",negative:"okuranai",negative_polite:"okurimasen",neg_past:"okuranakatta",neg_past_polite:"okurimasen deshita",te_form:"okutte",neg_te:"okuranakute",ing_form:"okutte iru",tai_form:"okuritai",potential:"okureru",potential_neg:"okurenai",volitional:"okurou",passive:"okurareru",causative:"okuraseru",imperative:"okure",conditional:"okureba",conditional_neg:"okuranakereba"},
    example_sentence:"メールを送ります。",example_sentence_en:"I send an email."
  },
  {
    dictionary:"受け取る",hiragana:"うけとる",romaji:"uketoru",meaning_en:"to receive / accept",group:"godan",level:"N3",
    forms:{present:"受け取る",present_polite:"受け取ります",past:"受け取った",past_polite:"受け取りました",negative:"受け取らない",negative_polite:"受け取りません",neg_past:"受け取らなかった",neg_past_polite:"受け取りませんでした",te_form:"受け取って",neg_te:"受け取らなくて",ing_form:"受け取っている",tai_form:"受け取りたい",potential:"受け取れる",potential_neg:"受け取れない",volitional:"受け取ろう",passive:"受け取られる",causative:"受け取らせる",imperative:"受け取れ",conditional:"受け取れば",conditional_neg:"受け取らなければ"},
    forms_romaji:{present:"uketoru",present_polite:"uketorimasu",past:"uketotta",past_polite:"uketorimashita",negative:"uketoranai",negative_polite:"uketorimasen",neg_past:"uketoranakatta",neg_past_polite:"uketorimasen deshita",te_form:"uketotte",neg_te:"uketoranakute",ing_form:"uketotte iru",tai_form:"uketoritai",potential:"uketoreru",potential_neg:"uketorenai",volitional:"uketorou",passive:"uketorareru",causative:"uketoraseru",imperative:"uketore",conditional:"uketoreba",conditional_neg:"uketoranakereba"},
    example_sentence:"荷物を受け取ります。",example_sentence_en:"I receive the package."
  },
  {
    dictionary:"呼ぶ",hiragana:"よぶ",romaji:"yobu",meaning_en:"to call / invite",group:"godan",level:"N4",
    forms:{present:"呼ぶ",present_polite:"呼びます",past:"呼んだ",past_polite:"呼びました",negative:"呼ばない",negative_polite:"呼びません",neg_past:"呼ばなかった",neg_past_polite:"呼びませんでした",te_form:"呼んで",neg_te:"呼ばなくて",ing_form:"呼んでいる",tai_form:"呼びたい",potential:"呼べる",potential_neg:"呼べない",volitional:"呼ぼう",passive:"呼ばれる",causative:"呼ばせる",imperative:"呼べ",conditional:"呼べば",conditional_neg:"呼ばなければ"},
    forms_romaji:{present:"yobu",present_polite:"yobimasu",past:"yonda",past_polite:"yobimashita",negative:"yobanai",negative_polite:"yobimasen",neg_past:"yobanakatta",neg_past_polite:"yobimasen deshita",te_form:"yonde",neg_te:"yobanakute",ing_form:"yonde iru",tai_form:"yobitai",potential:"yoberu",potential_neg:"yobenai",volitional:"yobou",passive:"yobareru",causative:"yobaseru",imperative:"yobe",conditional:"yobeba",conditional_neg:"yobanakereba"},
    example_sentence:"名前を呼ばれました。",example_sentence_en:"My name was called."
  },
  {
    dictionary:"笑う",hiragana:"わらう",romaji:"warau",meaning_en:"to laugh / smile",group:"godan",level:"N4",
    forms:{present:"笑う",present_polite:"笑います",past:"笑った",past_polite:"笑いました",negative:"笑わない",negative_polite:"笑いません",neg_past:"笑わなかった",neg_past_polite:"笑いませんでした",te_form:"笑って",neg_te:"笑わなくて",ing_form:"笑っている",tai_form:"笑いたい",potential:"笑える",potential_neg:"笑えない",volitional:"笑おう",passive:"笑われる",causative:"笑わせる",imperative:"笑え",conditional:"笑えば",conditional_neg:"笑わなければ"},
    forms_romaji:{present:"warau",present_polite:"waraimasu",past:"waratta",past_polite:"waraimashita",negative:"warawanai",negative_polite:"waraimasen",neg_past:"warawanakatta",neg_past_polite:"waraimasen deshita",te_form:"waratte",neg_te:"warawanakute",ing_form:"waratte iru",tai_form:"waraitai",potential:"waraeru",potential_neg:"waraenai",volitional:"waraou",passive:"warawareru",causative:"warawaseru",imperative:"warae",conditional:"waraeba",conditional_neg:"warawanakereba"},
    example_sentence:"面白くて笑いました。",example_sentence_en:"It was funny so I laughed."
  },
  {
    dictionary:"泣く",hiragana:"なく",romaji:"naku",meaning_en:"to cry / weep",group:"godan",level:"N4",
    forms:{present:"泣く",present_polite:"泣きます",past:"泣いた",past_polite:"泣きました",negative:"泣かない",negative_polite:"泣きません",neg_past:"泣かなかった",neg_past_polite:"泣きませんでした",te_form:"泣いて",neg_te:"泣かなくて",ing_form:"泣いている",tai_form:"泣きたい",potential:"泣ける",potential_neg:"泣けない",volitional:"泣こう",passive:"泣かれる",causative:"泣かせる",imperative:"泣け",conditional:"泣けば",conditional_neg:"泣かなければ"},
    forms_romaji:{present:"naku",present_polite:"nakimasu",past:"naita",past_polite:"nakimashita",negative:"nakanai",negative_polite:"nakimasen",neg_past:"nakanakatta",neg_past_polite:"nakimasen deshita",te_form:"naite",neg_te:"nakanakute",ing_form:"naite iru",tai_form:"nakitai",potential:"nakeru",potential_neg:"nakenai",volitional:"nakou",passive:"nakareru",causative:"nakaseru",imperative:"nake",conditional:"nakeba",conditional_neg:"nakanakereba"},
    example_sentence:"悲しくて泣きました。",example_sentence_en:"I was sad and cried."
  },
  {
    dictionary:"歌う",hiragana:"うたう",romaji:"utau",meaning_en:"to sing",group:"godan",level:"N4",
    forms:{present:"歌う",present_polite:"歌います",past:"歌った",past_polite:"歌いました",negative:"歌わない",negative_polite:"歌いません",neg_past:"歌わなかった",neg_past_polite:"歌いませんでした",te_form:"歌って",neg_te:"歌わなくて",ing_form:"歌っている",tai_form:"歌いたい",potential:"歌える",potential_neg:"歌えない",volitional:"歌おう",passive:"歌われる",causative:"歌わせる",imperative:"歌え",conditional:"歌えば",conditional_neg:"歌わなければ"},
    forms_romaji:{present:"utau",present_polite:"utaimasu",past:"utatta",past_polite:"utaimashita",negative:"utawanai",negative_polite:"utaimasen",neg_past:"utawanakatta",neg_past_polite:"utaimasen deshita",te_form:"utatte",neg_te:"utawanakute",ing_form:"utatte iru",tai_form:"utaitai",potential:"utaeru",potential_neg:"utaenai",volitional:"utaou",passive:"utawareru",causative:"utawaseru",imperative:"utae",conditional:"utaeba",conditional_neg:"utawanakereba"},
    example_sentence:"カラオケで歌います。",example_sentence_en:"I sing at karaoke."
  },
  {
    dictionary:"踊る",hiragana:"おどる",romaji:"odoru",meaning_en:"to dance",group:"godan",level:"N4",
    forms:{present:"踊る",present_polite:"踊ります",past:"踊った",past_polite:"踊りました",negative:"踊らない",negative_polite:"踊りません",neg_past:"踊らなかった",neg_past_polite:"踊りませんでした",te_form:"踊って",neg_te:"踊らなくて",ing_form:"踊っている",tai_form:"踊りたい",potential:"踊れる",potential_neg:"踊れない",volitional:"踊ろう",passive:"踊られる",causative:"踊らせる",imperative:"踊れ",conditional:"踊れば",conditional_neg:"踊らなければ"},
    forms_romaji:{present:"odoru",present_polite:"odorimasu",past:"odotta",past_polite:"odorimashita",negative:"odoranai",negative_polite:"odorimasen",neg_past:"odoranakatta",neg_past_polite:"odorimasen deshita",te_form:"odotte",neg_te:"odoranakute",ing_form:"odotte iru",tai_form:"odoritai",potential:"odoreru",potential_neg:"odorenai",volitional:"odorou",passive:"odorareru",causative:"odoraseru",imperative:"odore",conditional:"odoreba",conditional_neg:"odoranakereba"},
    example_sentence:"パーティーで踊ります。",example_sentence_en:"I dance at the party."
  },
  {
    dictionary:"弾く",hiragana:"ひく",romaji:"hiku_play",meaning_en:"to play (instrument)",group:"godan",level:"N4",
    forms:{present:"弾く",present_polite:"弾きます",past:"弾いた",past_polite:"弾きました",negative:"弾かない",negative_polite:"弾きません",neg_past:"弾かなかった",neg_past_polite:"弾きませんでした",te_form:"弾いて",neg_te:"弾かなくて",ing_form:"弾いている",tai_form:"弾きたい",potential:"弾ける",potential_neg:"弾けない",volitional:"弾こう",passive:"弾かれる",causative:"弾かせる",imperative:"弾け",conditional:"弾けば",conditional_neg:"弾かなければ"},
    forms_romaji:{present:"hiku",present_polite:"hikimasu",past:"hiita",past_polite:"hikimashita",negative:"hikanai",negative_polite:"hikimasen",neg_past:"hikanakatta",neg_past_polite:"hikimasen deshita",te_form:"hiite",neg_te:"hikanakute",ing_form:"hiite iru",tai_form:"hikitai",potential:"hikeru",potential_neg:"hikenai",volitional:"hikou",passive:"hikareru",causative:"hikaseru",imperative:"hike",conditional:"hikeba",conditional_neg:"hikanakereba"},
    example_sentence:"ピアノを弾きます。",example_sentence_en:"I play the piano."
  },
  {
    dictionary:"探す",hiragana:"さがす",romaji:"sagasu",meaning_en:"to search / look for",group:"godan",level:"N4",
    forms:{present:"探す",present_polite:"探します",past:"探した",past_polite:"探しました",negative:"探さない",negative_polite:"探しません",neg_past:"探さなかった",neg_past_polite:"探しませんでした",te_form:"探して",neg_te:"探さなくて",ing_form:"探している",tai_form:"探したい",potential:"探せる",potential_neg:"探せない",volitional:"探そう",passive:"探される",causative:"探させる",imperative:"探せ",conditional:"探せば",conditional_neg:"探さなければ"},
    forms_romaji:{present:"sagasu",present_polite:"sagashimasu",past:"sagashita",past_polite:"sagashimashita",negative:"sagasanai",negative_polite:"sagashimasen",neg_past:"sagasanakatta",neg_past_polite:"sagashimasen deshita",te_form:"sagashite",neg_te:"sagasanakute",ing_form:"sagashite iru",tai_form:"sagashitai",potential:"sagaseru",potential_neg:"sagasenai",volitional:"sagasou",passive:"sagasareru",causative:"sagasaseru",imperative:"sagase",conditional:"sagaseba",conditional_neg:"sagasanakereba"},
    example_sentence:"鍵を探しています。",example_sentence_en:"I'm looking for my key."
  },
  {
    dictionary:"見つける",hiragana:"みつける",romaji:"mitsukeru",meaning_en:"to find",group:"ichidan",level:"N4",
    forms:{present:"見つける",present_polite:"見つけます",past:"見つけた",past_polite:"見つけました",negative:"見つけない",negative_polite:"見つけません",neg_past:"見つけなかった",neg_past_polite:"見つけませんでした",te_form:"見つけて",neg_te:"見つけなくて",ing_form:"見つけている",tai_form:"見つけたい",potential:"見つけられる",potential_neg:"見つけられない",volitional:"見つけよう",passive:"見つけられる",causative:"見つけさせる",imperative:"見つけろ",conditional:"見つければ",conditional_neg:"見つけなければ"},
    forms_romaji:{present:"mitsukeru",present_polite:"mitsukemasu",past:"mitsuketa",past_polite:"mitsukemashita",negative:"mitsukenai",negative_polite:"mitsukemasen",neg_past:"mitsukenakatta",neg_past_polite:"mitsukemasen deshita",te_form:"mitsukete",neg_te:"mitsukenakute",ing_form:"mitsukete iru",tai_form:"mitsuketai",potential:"mitsukerareru",potential_neg:"mitsukerarenai",volitional:"mitsukeyou",passive:"mitsukerareru",causative:"mitsukesaseru",imperative:"mitsukero",conditional:"mitsukereba",conditional_neg:"mitsukenakereba"},
    example_sentence:"財布を見つけました。",example_sentence_en:"I found my wallet."
  },
  {
    dictionary:"喜ぶ",hiragana:"よろこぶ",romaji:"yorokobu",meaning_en:"to be glad / pleased",group:"godan",level:"N3",
    forms:{present:"喜ぶ",present_polite:"喜びます",past:"喜んだ",past_polite:"喜びました",negative:"喜ばない",negative_polite:"喜びません",neg_past:"喜ばなかった",neg_past_polite:"喜びませんでした",te_form:"喜んで",neg_te:"喜ばなくて",ing_form:"喜んでいる",tai_form:"喜びたい",potential:"喜べる",potential_neg:"喜べない",volitional:"喜ぼう",passive:"喜ばれる",causative:"喜ばせる",imperative:"喜べ",conditional:"喜べば",conditional_neg:"喜ばなければ"},
    forms_romaji:{present:"yorokobu",present_polite:"yorokobimasu",past:"yorokonda",past_polite:"yorokobimashita",negative:"yorokobanai",negative_polite:"yorokobimasen",neg_past:"yorokobanakatta",neg_past_polite:"yorokobimasen deshita",te_form:"yorokonde",neg_te:"yorokobanakute",ing_form:"yorokonde iru",tai_form:"yorokobitai",potential:"yorokoberu",potential_neg:"yorokobenai",volitional:"yorokobou",passive:"yorokobareru",causative:"yorokobaseru",imperative:"yorokobe",conditional:"yorokobeba",conditional_neg:"yorokobanakereba"},
    example_sentence:"プレゼントをもらって喜びました。",example_sentence_en:"I was pleased to receive a gift."
  },
  {
    dictionary:"驚く",hiragana:"おどろく",romaji:"odoroku",meaning_en:"to be surprised / astonished",group:"godan",level:"N3",
    forms:{present:"驚く",present_polite:"驚きます",past:"驚いた",past_polite:"驚きました",negative:"驚かない",negative_polite:"驚きません",neg_past:"驚かなかった",neg_past_polite:"驚きませんでした",te_form:"驚いて",neg_te:"驚かなくて",ing_form:"驚いている",tai_form:"驚きたい",potential:"驚ける",potential_neg:"驚けない",volitional:"驚こう",passive:"驚かれる",causative:"驚かせる",imperative:"驚け",conditional:"驚けば",conditional_neg:"驚かなければ"},
    forms_romaji:{present:"odoroku",present_polite:"odorokimasu",past:"odoroita",past_polite:"odorokimashita",negative:"oodorokanai",negative_polite:"odorokimasen",neg_past:"odorokanakatta",neg_past_polite:"odorokimasen deshita",te_form:"odoroite",neg_te:"odorokanakute",ing_form:"odoroite iru",tai_form:"odorokitai",potential:"odorokeru",potential_neg:"odorookenai",volitional:"odorokou",passive:"odorokareru",causative:"odorokaseru",imperative:"odoroke",conditional:"odorokeba",conditional_neg:"odorokanakereba"},
    example_sentence:"ニュースを聞いて驚きました。",example_sentence_en:"I was surprised to hear the news."
  },
  {
    dictionary:"困る",hiragana:"こまる",romaji:"komaru",meaning_en:"to be troubled / in trouble",group:"godan",level:"N4",
    forms:{present:"困る",present_polite:"困ります",past:"困った",past_polite:"困りました",negative:"困らない",negative_polite:"困りません",neg_past:"困らなかった",neg_past_polite:"困りませんでした",te_form:"困って",neg_te:"困らなくて",ing_form:"困っている",tai_form:"困りたい",potential:"困れる",potential_neg:"困れない",volitional:"困ろう",passive:"困られる",causative:"困らせる",imperative:"困れ",conditional:"困れば",conditional_neg:"困らなければ"},
    forms_romaji:{present:"komaru",present_polite:"komarimasu",past:"komatta",past_polite:"komarimashita",negative:"komaranai",negative_polite:"komarimasen",neg_past:"komaranakatta",neg_past_polite:"komarimasen deshita",te_form:"komatte",neg_te:"komaranakute",ing_form:"komatte iru",tai_form:"komaritai",potential:"komareru",potential_neg:"komarenai",volitional:"komarou",passive:"komarareru",causative:"komaraseru",imperative:"komare",conditional:"komareba",conditional_neg:"komaranakereba"},
    example_sentence:"お金がなくて困っています。",example_sentence_en:"I'm in trouble because I have no money."
  },
  {
    dictionary:"急ぐ",hiragana:"いそぐ",romaji:"isogu",meaning_en:"to hurry / rush",group:"godan",level:"N4",
    forms:{present:"急ぐ",present_polite:"急ぎます",past:"急いだ",past_polite:"急ぎました",negative:"急がない",negative_polite:"急ぎません",neg_past:"急がなかった",neg_past_polite:"急ぎませんでした",te_form:"急いで",neg_te:"急がなくて",ing_form:"急いでいる",tai_form:"急ぎたい",potential:"急げる",potential_neg:"急げない",volitional:"急ごう",passive:"急がれる",causative:"急がせる",imperative:"急げ",conditional:"急げば",conditional_neg:"急がなければ"},
    forms_romaji:{present:"isogu",present_polite:"isogimasu",past:"isoida",past_polite:"isogimashita",negative:"isoganai",negative_polite:"isogimasen",neg_past:"isoganakatta",neg_past_polite:"isogimasen deshita",te_form:"isoide",neg_te:"isoganakute",ing_form:"isoide iru",tai_form:"isogitai",potential:"isogeru",potential_neg:"isogenai",volitional:"isogou",passive:"isogareru",causative:"isogaseru",imperative:"isoge",conditional:"isogeba",conditional_neg:"isoganakereba"},
    example_sentence:"急いでください。",example_sentence_en:"Please hurry."
  },
  {
    dictionary:"止まる",hiragana:"とまる",romaji:"tomaru",meaning_en:"to stop / come to a halt",group:"godan",level:"N4",
    forms:{present:"止まる",present_polite:"止まります",past:"止まった",past_polite:"止まりました",negative:"止まらない",negative_polite:"止まりません",neg_past:"止まらなかった",neg_past_polite:"止まりませんでした",te_form:"止まって",neg_te:"止まらなくて",ing_form:"止まっている",tai_form:"止まりたい",potential:"止まれる",potential_neg:"止まれない",volitional:"止まろう",passive:"止まられる",causative:"止まらせる",imperative:"止まれ",conditional:"止まれば",conditional_neg:"止まらなければ"},
    forms_romaji:{present:"tomaru",present_polite:"tomarimasu",past:"tomatta",past_polite:"tomarimashita",negative:"tomaranai",negative_polite:"tomarimasen",neg_past:"tomaranakatta",neg_past_polite:"tomarimasen deshita",te_form:"tomatte",neg_te:"tomaranakute",ing_form:"tomatte iru",tai_form:"tomaritai",potential:"tomareru",potential_neg:"tomarenai",volitional:"tomarou",passive:"tomarareru",causative:"tomaraseru",imperative:"tomare",conditional:"tomareba",conditional_neg:"tomaranakereba"},
    example_sentence:"バスが止まりました。",example_sentence_en:"The bus stopped."
  },
  {
    dictionary:"動く",hiragana:"うごく",romaji:"ugoku",meaning_en:"to move",group:"godan",level:"N4",
    forms:{present:"動く",present_polite:"動きます",past:"動いた",past_polite:"動きました",negative:"動かない",negative_polite:"動きません",neg_past:"動かなかった",neg_past_polite:"動きませんでした",te_form:"動いて",neg_te:"動かなくて",ing_form:"動いている",tai_form:"動きたい",potential:"動ける",potential_neg:"動けない",volitional:"動こう",passive:"動かれる",causative:"動かせる",imperative:"動け",conditional:"動けば",conditional_neg:"動かなければ"},
    forms_romaji:{present:"ugoku",present_polite:"ugokimasu",past:"ugoita",past_polite:"ugokimashita",negative:"ugokanai",negative_polite:"ugokimasen",neg_past:"ugokanakatta",neg_past_polite:"ugokimasen deshita",te_form:"ugoite",neg_te:"ugokanakute",ing_form:"ugoite iru",tai_form:"ugokitai",potential:"ugokeru",potential_neg:"ugokenai",volitional:"ugokou",passive:"ugokareru",causative:"ugokaseru",imperative:"ugoke",conditional:"ugokeba",conditional_neg:"ugokanakereba"},
    example_sentence:"体を動かしましょう。",example_sentence_en:"Let's move our bodies."
  },
  {
    dictionary:"落とす",hiragana:"おとす",romaji:"otosu",meaning_en:"to drop / let fall",group:"godan",level:"N3",
    forms:{present:"落とす",present_polite:"落とします",past:"落とした",past_polite:"落としました",negative:"落とさない",negative_polite:"落としません",neg_past:"落とさなかった",neg_past_polite:"落としませんでした",te_form:"落として",neg_te:"落とさなくて",ing_form:"落としている",tai_form:"落としたい",potential:"落とせる",potential_neg:"落とせない",volitional:"落とそう",passive:"落とされる",causative:"落とさせる",imperative:"落とせ",conditional:"落とせば",conditional_neg:"落とさなければ"},
    forms_romaji:{present:"otosu",present_polite:"otoshimasu",past:"otoshita",past_polite:"otoshimashita",negative:"otosanai",negative_polite:"otoshimasen",neg_past:"otosanakatta",neg_past_polite:"otoshimasen deshita",te_form:"otoshite",neg_te:"otosanakute",ing_form:"otoshite iru",tai_form:"otoshitai",potential:"otoseru",potential_neg:"otosenai",volitional:"otosou",passive:"otosareru",causative:"otosaseru",imperative:"otose",conditional:"otoseba",conditional_neg:"otosanakereba"},
    example_sentence:"鍵を落としました。",example_sentence_en:"I dropped my key."
  },
  {
    dictionary:"拾う",hiragana:"ひろう",romaji:"hirou",meaning_en:"to pick up",group:"godan",level:"N4",
    forms:{present:"拾う",present_polite:"拾います",past:"拾った",past_polite:"拾いました",negative:"拾わない",negative_polite:"拾いません",neg_past:"拾わなかった",neg_past_polite:"拾いませんでした",te_form:"拾って",neg_te:"拾わなくて",ing_form:"拾っている",tai_form:"拾いたい",potential:"拾える",potential_neg:"拾えない",volitional:"拾おう",passive:"拾われる",causative:"拾わせる",imperative:"拾え",conditional:"拾えば",conditional_neg:"拾わなければ"},
    forms_romaji:{present:"hirou",present_polite:"hiroimasu",past:"hirotta",past_polite:"hiroimashita",negative:"hirowananai",negative_polite:"hiroiemasen",neg_past:"hirowananakatta",neg_past_polite:"hiroimasen deshita",te_form:"hirotte",neg_te:"hirowananakute",ing_form:"hirotte iru",tai_form:"hiroitai",potential:"hiroeru",potential_neg:"hiroenai",volitional:"hiroou",passive:"hirowareru",causative:"hirowaseru",imperative:"hiroe",conditional:"hiroeba",conditional_neg:"hirowanakereba"},
    example_sentence:"財布を拾いました。",example_sentence_en:"I picked up a wallet."
  },
  {
    dictionary:"直す",hiragana:"なおす",romaji:"naosu",meaning_en:"to fix / repair / correct",group:"godan",level:"N3",
    forms:{present:"直す",present_polite:"直します",past:"直した",past_polite:"直しました",negative:"直さない",negative_polite:"直しません",neg_past:"直さなかった",neg_past_polite:"直しませんでした",te_form:"直して",neg_te:"直さなくて",ing_form:"直している",tai_form:"直したい",potential:"直せる",potential_neg:"直せない",volitional:"直そう",passive:"直される",causative:"直させる",imperative:"直せ",conditional:"直せば",conditional_neg:"直さなければ"},
    forms_romaji:{present:"naosu",present_polite:"naoshimasu",past:"naoshita",past_polite:"naoshimashita",negative:"naosanai",negative_polite:"naoshimasen",neg_past:"naosanakatta",neg_past_polite:"naoshimasen deshita",te_form:"naoshite",neg_te:"naosanakute",ing_form:"naoshite iru",tai_form:"naoshitai",potential:"naoseru",potential_neg:"naosenaI",volitional:"naosou",passive:"naosareru",causative:"naosaseru",imperative:"naose",conditional:"naoseba",conditional_neg:"naosanakereba"},
    example_sentence:"パソコンを直します。",example_sentence_en:"I fix the computer."
  },
  {
    dictionary:"増える",hiragana:"ふえる",romaji:"fueru",meaning_en:"to increase / grow",group:"ichidan",level:"N3",
    forms:{present:"増える",present_polite:"増えます",past:"増えた",past_polite:"増えました",negative:"増えない",negative_polite:"増えません",neg_past:"増えなかった",neg_past_polite:"増えませんでした",te_form:"増えて",neg_te:"増えなくて",ing_form:"増えている",tai_form:"増えたい",potential:"増えられる",potential_neg:"増えられない",volitional:"増えよう",passive:"増えられる",causative:"増えさせる",imperative:"増えろ",conditional:"増えれば",conditional_neg:"増えなければ"},
    forms_romaji:{present:"fueru",present_polite:"fuemasu",past:"fueta",past_polite:"fuemashita",negative:"fuenai",negative_polite:"fuemasen",neg_past:"fuenakatta",neg_past_polite:"fuemasen deshita",te_form:"fuete",neg_te:"fuenakute",ing_form:"fuete iru",tai_form:"fuetai",potential:"fuererareru",potential_neg:"fuererarenai",volitional:"fueyou",passive:"fuererareru",causative:"fuesaseru",imperative:"fuero",conditional:"fuereba",conditional_neg:"fuenakereba"},
    example_sentence:"人口が増えています。",example_sentence_en:"The population is increasing."
  },
  {
    dictionary:"減る",hiragana:"へる",romaji:"heru",meaning_en:"to decrease / reduce",group:"godan",level:"N3",
    forms:{present:"減る",present_polite:"減ります",past:"減った",past_polite:"減りました",negative:"減らない",negative_polite:"減りません",neg_past:"減らなかった",neg_past_polite:"減りませんでした",te_form:"減って",neg_te:"減らなくて",ing_form:"減っている",tai_form:"減りたい",potential:"減れる",potential_neg:"減れない",volitional:"減ろう",passive:"減られる",causative:"減らせる",imperative:"減れ",conditional:"減れば",conditional_neg:"減らなければ"},
    forms_romaji:{present:"heru",present_polite:"herimasu",past:"hetta",past_polite:"herimashita",negative:"heranai",negative_polite:"herimasen",neg_past:"heranakatta",neg_past_polite:"herimasen deshita",te_form:"hette",neg_te:"heranakute",ing_form:"hette iru",tai_form:"heritai",potential:"hereru",potential_neg:"herenai",volitional:"herou",passive:"herrareru",causative:"heraseru",imperative:"here",conditional:"hereba",conditional_neg:"heranakereba"},
    example_sentence:"体重が減りました。",example_sentence_en:"My weight decreased."
  },
  {
    dictionary:"集める",hiragana:"あつめる",romaji:"atsumeru",meaning_en:"to collect / gather",group:"ichidan",level:"N3",
    forms:{present:"集める",present_polite:"集めます",past:"集めた",past_polite:"集めました",negative:"集めない",negative_polite:"集めません",neg_past:"集めなかった",neg_past_polite:"集めませんでした",te_form:"集めて",neg_te:"集めなくて",ing_form:"集めている",tai_form:"集めたい",potential:"集められる",potential_neg:"集められない",volitional:"集めよう",passive:"集められる",causative:"集めさせる",imperative:"集めろ",conditional:"集めれば",conditional_neg:"集めなければ"},
    forms_romaji:{present:"atsumeru",present_polite:"atsumemasu",past:"atsumeta",past_polite:"atsumemashita",negative:"atsumenai",negative_polite:"atsumemasen",neg_past:"atsumenakatta",neg_past_polite:"atsumemasen deshita",te_form:"atsumete",neg_te:"atsumenakute",ing_form:"atsumete iru",tai_form:"atsumetai",potential:"atsumerareru",potential_neg:"atsumerarenai",volitional:"atsumeyou",passive:"atsumerareru",causative:"atsumesaseru",imperative:"atsumero",conditional:"atsumereba",conditional_neg:"atsumenakereba"},
    example_sentence:"切手を集めています。",example_sentence_en:"I collect stamps."
  },
  {
    dictionary:"選ぶ",hiragana:"えらぶ",romaji:"erabu",meaning_en:"to choose / select",group:"godan",level:"N3",
    forms:{present:"選ぶ",present_polite:"選びます",past:"選んだ",past_polite:"選びました",negative:"選ばない",negative_polite:"選びません",neg_past:"選ばなかった",neg_past_polite:"選びませんでした",te_form:"選んで",neg_te:"選ばなくて",ing_form:"選んでいる",tai_form:"選びたい",potential:"選べる",potential_neg:"選べない",volitional:"選ぼう",passive:"選ばれる",causative:"選ばせる",imperative:"選べ",conditional:"選べば",conditional_neg:"選ばなければ"},
    forms_romaji:{present:"erabu",present_polite:"erabimasu",past:"eranda",past_polite:"erabimashita",negative:"erabanai",negative_polite:"erabimasen",neg_past:"erabanakatta",neg_past_polite:"erabimasen deshita",te_form:"erande",neg_te:"erabanakute",ing_form:"erande iru",tai_form:"erabitai",potential:"eraberu",potential_neg:"erabenai",volitional:"erabou",passive:"erabareru",causative:"erabaseru",imperative:"erabe",conditional:"erabeba",conditional_neg:"erabanakereba"},
    example_sentence:"好きな色を選んでください。",example_sentence_en:"Please choose your favorite color."
  },
  {
    dictionary:"並ぶ",hiragana:"ならぶ",romaji:"narabu",meaning_en:"to line up / stand in line",group:"godan",level:"N3",
    forms:{present:"並ぶ",present_polite:"並びます",past:"並んだ",past_polite:"並びました",negative:"並ばない",negative_polite:"並びません",neg_past:"並ばなかった",neg_past_polite:"並びませんでした",te_form:"並んで",neg_te:"並ばなくて",ing_form:"並んでいる",tai_form:"並びたい",potential:"並べる",potential_neg:"並べない",volitional:"並ぼう",passive:"並ばれる",causative:"並ばせる",imperative:"並べ",conditional:"並べば",conditional_neg:"並ばなければ"},
    forms_romaji:{present:"narabu",present_polite:"narabimasu",past:"naranda",past_polite:"narabimashita",negative:"narabanai",negative_polite:"narabimasen",neg_past:"narabanakatta",neg_past_polite:"narabimasen deshita",te_form:"narande",neg_te:"narabanakute",ing_form:"narande iru",tai_form:"narabitai",potential:"naraberu",potential_neg:"narabenai",volitional:"narabou",passive:"narabareru",causative:"narabaseru",imperative:"narabe",conditional:"narabeba",conditional_neg:"narabanakereba"},
    example_sentence:"列に並んでください。",example_sentence_en:"Please line up."
  },
  {
    dictionary:"並べる",hiragana:"ならべる",romaji:"naraberu",meaning_en:"to line up / arrange",group:"ichidan",level:"N3",
    forms:{present:"並べる",present_polite:"並べます",past:"並べた",past_polite:"並べました",negative:"並べない",negative_polite:"並べません",neg_past:"並べなかった",neg_past_polite:"並べませんでした",te_form:"並べて",neg_te:"並べなくて",ing_form:"並べている",tai_form:"並べたい",potential:"並べられる",potential_neg:"並べられない",volitional:"並べよう",passive:"並べられる",causative:"並べさせる",imperative:"並べろ",conditional:"並べれば",conditional_neg:"並べなければ"},
    forms_romaji:{present:"naraberu",present_polite:"narabemasu",past:"narabeta",past_polite:"narabemashita",negative:"narabenai",negative_polite:"narabemasen",neg_past:"narabenakatta",neg_past_polite:"narabemasen deshita",te_form:"narabete",neg_te:"narabenakute",ing_form:"narabete iru",tai_form:"narabetai",potential:"naraberareru",potential_neg:"naraberarenai",volitional:"narabeyou",passive:"naraberareru",causative:"narabesaseru",imperative:"narabero",conditional:"narabereba",conditional_neg:"narabenakereba"},
    example_sentence:"本を棚に並べます。",example_sentence_en:"I arrange books on the shelf."
  },
  {
    dictionary:"払う",hiragana:"はらう",romaji:"harau",meaning_en:"to pay",group:"godan",level:"N4",
    forms:{present:"払う",present_polite:"払います",past:"払った",past_polite:"払いました",negative:"払わない",negative_polite:"払いません",neg_past:"払わなかった",neg_past_polite:"払いませんでした",te_form:"払って",neg_te:"払わなくて",ing_form:"払っている",tai_form:"払いたい",potential:"払える",potential_neg:"払えない",volitional:"払おう",passive:"払われる",causative:"払わせる",imperative:"払え",conditional:"払えば",conditional_neg:"払わなければ"},
    forms_romaji:{present:"harau",present_polite:"haraimasu",past:"haratta",past_polite:"haraimashita",negative:"harawanai",negative_polite:"haraimasen",neg_past:"harawanakatta",neg_past_polite:"haraimasen deshita",te_form:"haratte",neg_te:"harawanakute",ing_form:"haratte iru",tai_form:"haraitai",potential:"haraeru",potential_neg:"haraenai",volitional:"haraou",passive:"harawareru",causative:"harawaseru",imperative:"harae",conditional:"haraeba",conditional_neg:"harawanakereba"},
    example_sentence:"お金を払います。",example_sentence_en:"I pay money."
  },
  {
    dictionary:"頼む",hiragana:"たのむ",romaji:"tanomu",meaning_en:"to ask / request",group:"godan",level:"N4",
    forms:{present:"頼む",present_polite:"頼みます",past:"頼んだ",past_polite:"頼みました",negative:"頼まない",negative_polite:"頼みません",neg_past:"頼まなかった",neg_past_polite:"頼みませんでした",te_form:"頼んで",neg_te:"頼まなくて",ing_form:"頼んでいる",tai_form:"頼みたい",potential:"頼める",potential_neg:"頼めない",volitional:"頼もう",passive:"頼まれる",causative:"頼ませる",imperative:"頼め",conditional:"頼めば",conditional_neg:"頼まなければ"},
    forms_romaji:{present:"tanomu",present_polite:"tanomimasu",past:"tanonda",past_polite:"tanomimashita",negative:"tanomanai",negative_polite:"tanomimasen",neg_past:"tanomanakatta",neg_past_polite:"tanomimasen deshita",te_form:"tanonde",neg_te:"tanomanakute",ing_form:"tanonde iru",tai_form:"tanomitai",potential:"tanomeru",potential_neg:"tanomenai",volitional:"tanomoу",passive:"tanomareru",causative:"tanomaseru",imperative:"tanome",conditional:"tanomeba",conditional_neg:"tanomanakereba"},
    example_sentence:"助けを頼みます。",example_sentence_en:"I ask for help."
  },
  {
    dictionary:"断る",hiragana:"ことわる",romaji:"kotowaru",meaning_en:"to refuse / decline",group:"godan",level:"N3",
    forms:{present:"断る",present_polite:"断ります",past:"断った",past_polite:"断りました",negative:"断らない",negative_polite:"断りません",neg_past:"断らなかった",neg_past_polite:"断りませんでした",te_form:"断って",neg_te:"断らなくて",ing_form:"断っている",tai_form:"断りたい",potential:"断れる",potential_neg:"断れない",volitional:"断ろう",passive:"断られる",causative:"断らせる",imperative:"断れ",conditional:"断れば",conditional_neg:"断らなければ"},
    forms_romaji:{present:"kotowaru",present_polite:"kotowarimasu",past:"kotowatta",past_polite:"kotowarimashita",negative:"kotowaranai",negative_polite:"kotowarimasen",neg_past:"kotowaranakatta",neg_past_polite:"kotowarimasen deshita",te_form:"kotowatte",neg_te:"kotowaranakute",ing_form:"kotowatte iru",tai_form:"kotowaritai",potential:"kotowareru",potential_neg:"kotowarenai",volitional:"kotowarou",passive:"kotowareru",causative:"kotowaraseru",imperative:"kotowaret",conditional:"kotowareba",conditional_neg:"kotowaranakereba"},
    example_sentence:"誘いを断りました。",example_sentence_en:"I declined the invitation."
  },
  {
    dictionary:"準備する",hiragana:"じゅんびする",romaji:"junbisuru",meaning_en:"to prepare",group:"irregular",level:"N4",
    forms:{present:"準備する",present_polite:"準備します",past:"準備した",past_polite:"準備しました",negative:"準備しない",negative_polite:"準備しません",neg_past:"準備しなかった",neg_past_polite:"準備しませんでした",te_form:"準備して",neg_te:"準備しなくて",ing_form:"準備している",tai_form:"準備したい",potential:"準備できる",potential_neg:"準備できない",volitional:"準備しよう",passive:"準備される",causative:"準備させる",imperative:"準備しろ",conditional:"準備すれば",conditional_neg:"準備しなければ"},
    forms_romaji:{present:"junbi suru",present_polite:"junbi shimasu",past:"junbi shita",past_polite:"junbi shimashita",negative:"junbi shinai",negative_polite:"junbi shimasen",neg_past:"junbi shinakatta",neg_past_polite:"junbi shimasen deshita",te_form:"junbi shite",neg_te:"junbi shinakute",ing_form:"junbi shite iru",tai_form:"junbi shitai",potential:"junbi dekiru",potential_neg:"junbi dekinai",volitional:"junbi shiyou",passive:"junbi sareru",causative:"junbi saseru",imperative:"junbi shiro",conditional:"junbi sureba",conditional_neg:"junbi shinakereba"},
    example_sentence:"試験の準備をします。",example_sentence_en:"I prepare for the exam."
  },
  {
    dictionary:"練習する",hiragana:"れんしゅうする",romaji:"renshuusuru",meaning_en:"to practice",group:"irregular",level:"N4",
    forms:{present:"練習する",present_polite:"練習します",past:"練習した",past_polite:"練習しました",negative:"練習しない",negative_polite:"練習しません",neg_past:"練習しなかった",neg_past_polite:"練習しませんでした",te_form:"練習して",neg_te:"練習しなくて",ing_form:"練習している",tai_form:"練習したい",potential:"練習できる",potential_neg:"練習できない",volitional:"練習しよう",passive:"練習される",causative:"練習させる",imperative:"練習しろ",conditional:"練習すれば",conditional_neg:"練習しなければ"},
    forms_romaji:{present:"renshuu suru",present_polite:"renshuu shimasu",past:"renshuu shita",past_polite:"renshuu shimashita",negative:"renshuu shinai",negative_polite:"renshuu shimasen",neg_past:"renshuu shinakatta",neg_past_polite:"renshuu shimasen deshita",te_form:"renshuu shite",neg_te:"renshuu shinakute",ing_form:"renshuu shite iru",tai_form:"renshuu shitai",potential:"renshuu dekiru",potential_neg:"renshuu dekinai",volitional:"renshuu shiyou",passive:"renshuu sareru",causative:"renshuu saseru",imperative:"renshuu shiro",conditional:"renshuu sureba",conditional_neg:"renshuu shinakereba"},
    example_sentence:"毎日練習します。",example_sentence_en:"I practice every day."
  },
  {
    dictionary:"旅行する",hiragana:"りょこうする",romaji:"ryoukousuru",meaning_en:"to travel",group:"irregular",level:"N4",
    forms:{present:"旅行する",present_polite:"旅行します",past:"旅行した",past_polite:"旅行しました",negative:"旅行しない",negative_polite:"旅行しません",neg_past:"旅行しなかった",neg_past_polite:"旅行しませんでした",te_form:"旅行して",neg_te:"旅行しなくて",ing_form:"旅行している",tai_form:"旅行したい",potential:"旅行できる",potential_neg:"旅行できない",volitional:"旅行しよう",passive:"旅行される",causative:"旅行させる",imperative:"旅行しろ",conditional:"旅行すれば",conditional_neg:"旅行しなければ"},
    forms_romaji:{present:"ryokou suru",present_polite:"ryokou shimasu",past:"ryokou shita",past_polite:"ryokou shimashita",negative:"ryokou shinai",negative_polite:"ryokou shimasen",neg_past:"ryokou shinakatta",neg_past_polite:"ryokou shimasen deshita",te_form:"ryokou shite",neg_te:"ryokou shinakute",ing_form:"ryokou shite iru",tai_form:"ryokou shitai",potential:"ryokou dekiru",potential_neg:"ryokou dekinai",volitional:"ryokou shiyou",passive:"ryokou sareru",causative:"ryokou saseru",imperative:"ryokou shiro",conditional:"ryokou sureba",conditional_neg:"ryokou shinakereba"},
    example_sentence:"来年日本に旅行します。",example_sentence_en:"I will travel to Japan next year."
  },
  {
    dictionary:"料理する",hiragana:"りょうりする",romaji:"ryourisuru",meaning_en:"to cook",group:"irregular",level:"N4",
    forms:{present:"料理する",present_polite:"料理します",past:"料理した",past_polite:"料理しました",negative:"料理しない",negative_polite:"料理しません",neg_past:"料理しなかった",neg_past_polite:"料理しませんでした",te_form:"料理して",neg_te:"料理しなくて",ing_form:"料理している",tai_form:"料理したい",potential:"料理できる",potential_neg:"料理できない",volitional:"料理しよう",passive:"料理される",causative:"料理させる",imperative:"料理しろ",conditional:"料理すれば",conditional_neg:"料理しなければ"},
    forms_romaji:{present:"ryouri suru",present_polite:"ryouri shimasu",past:"ryouri shita",past_polite:"ryouri shimashita",negative:"ryouri shinai",negative_polite:"ryouri shimasen",neg_past:"ryouri shinakatta",neg_past_polite:"ryouri shimasen deshita",te_form:"ryouri shite",neg_te:"ryouri shinakute",ing_form:"ryouri shite iru",tai_form:"ryouri shitai",potential:"ryouri dekiru",potential_neg:"ryouri dekinai",volitional:"ryouri shiyou",passive:"ryouri sareru",causative:"ryouri saseru",imperative:"ryouri shiro",conditional:"ryouri sureba",conditional_neg:"ryouri shinakereba"},
    example_sentence:"夕食を料理します。",example_sentence_en:"I cook dinner."
  },
  {
    dictionary:"運転する",hiragana:"うんてんする",romaji:"untensuru",meaning_en:"to drive",group:"irregular",level:"N4",
    forms:{present:"運転する",present_polite:"運転します",past:"運転した",past_polite:"運転しました",negative:"運転しない",negative_polite:"運転しません",neg_past:"運転しなかった",neg_past_polite:"運転しませんでした",te_form:"運転して",neg_te:"運転しなくて",ing_form:"運転している",tai_form:"運転したい",potential:"運転できる",potential_neg:"運転できない",volitional:"運転しよう",passive:"運転される",causative:"運転させる",imperative:"運転しろ",conditional:"運転すれば",conditional_neg:"運転しなければ"},
    forms_romaji:{present:"unten suru",present_polite:"unten shimasu",past:"unten shita",past_polite:"unten shimashita",negative:"unten shinai",negative_polite:"unten shimasen",neg_past:"unten shinakatta",neg_past_polite:"unten shimasen deshita",te_form:"unten shite",neg_te:"unten shinakute",ing_form:"unten shite iru",tai_form:"unten shitai",potential:"unten dekiru",potential_neg:"unten dekinai",volitional:"unten shiyou",passive:"unten sareru",causative:"unten saseru",imperative:"unten shiro",conditional:"unten sureba",conditional_neg:"unten shinakereba"},
    example_sentence:"車を運転します。",example_sentence_en:"I drive a car."
  },
  {
    dictionary:"説明する",hiragana:"せつめいする",romaji:"setsumeisuru",meaning_en:"to explain",group:"irregular",level:"N3",
    forms:{present:"説明する",present_polite:"説明します",past:"説明した",past_polite:"説明しました",negative:"説明しない",negative_polite:"説明しません",neg_past:"説明しなかった",neg_past_polite:"説明しませんでした",te_form:"説明して",neg_te:"説明しなくて",ing_form:"説明している",tai_form:"説明したい",potential:"説明できる",potential_neg:"説明できない",volitional:"説明しよう",passive:"説明される",causative:"説明させる",imperative:"説明しろ",conditional:"説明すれば",conditional_neg:"説明しなければ"},
    forms_romaji:{present:"setsumei suru",present_polite:"setsumei shimasu",past:"setsumei shita",past_polite:"setsumei shimashita",negative:"setsumei shinai",negative_polite:"setsumei shimasen",neg_past:"setsumei shinakatta",neg_past_polite:"setsumei shimasen deshita",te_form:"setsumei shite",neg_te:"setsumei shinakute",ing_form:"setsumei shite iru",tai_form:"setsumei shitai",potential:"setsumei dekiru",potential_neg:"setsumei dekinai",volitional:"setsumei shiyou",passive:"setsumei sareru",causative:"setsumei saseru",imperative:"setsumei shiro",conditional:"setsumei sureba",conditional_neg:"setsumei shinakereba"},
    example_sentence:"もう一度説明してください。",example_sentence_en:"Please explain once more."
  },
  {
    dictionary:"確認する",hiragana:"かくにんする",romaji:"kakuninsuru",meaning_en:"to confirm / check",group:"irregular",level:"N3",
    forms:{present:"確認する",present_polite:"確認します",past:"確認した",past_polite:"確認しました",negative:"確認しない",negative_polite:"確認しません",neg_past:"確認しなかった",neg_past_polite:"確認しませんでした",te_form:"確認して",neg_te:"確認しなくて",ing_form:"確認している",tai_form:"確認したい",potential:"確認できる",potential_neg:"確認できない",volitional:"確認しよう",passive:"確認される",causative:"確認させる",imperative:"確認しろ",conditional:"確認すれば",conditional_neg:"確認しなければ"},
    forms_romaji:{present:"kakunin suru",present_polite:"kakunin shimasu",past:"kakunin shita",past_polite:"kakunin shimashita",negative:"kakunin shinai",negative_polite:"kakunin shimasen",neg_past:"kakunin shinakatta",neg_past_polite:"kakunin shimasen deshita",te_form:"kakunin shite",neg_te:"kakunin shinakute",ing_form:"kakunin shite iru",tai_form:"kakunin shitai",potential:"kakunin dekiru",potential_neg:"kakunin dekinai",volitional:"kakunin shiyou",passive:"kakunin sareru",causative:"kakunin saseru",imperative:"kakunin shiro",conditional:"kakunin sureba",conditional_neg:"kakunin shinakereba"},
    example_sentence:"予約を確認します。",example_sentence_en:"I confirm the reservation."
  },
  {
    dictionary:"相談する",hiragana:"そうだんする",romaji:"soudansuru",meaning_en:"to consult / discuss",group:"irregular",level:"N3",
    forms:{present:"相談する",present_polite:"相談します",past:"相談した",past_polite:"相談しました",negative:"相談しない",negative_polite:"相談しません",neg_past:"相談しなかった",neg_past_polite:"相談しませんでした",te_form:"相談して",neg_te:"相談しなくて",ing_form:"相談している",tai_form:"相談したい",potential:"相談できる",potential_neg:"相談できない",volitional:"相談しよう",passive:"相談される",causative:"相談させる",imperative:"相談しろ",conditional:"相談すれば",conditional_neg:"相談しなければ"},
    forms_romaji:{present:"soudan suru",present_polite:"soudan shimasu",past:"soudan shita",past_polite:"soudan shimashita",negative:"soudan shinai",negative_polite:"soudan shimasen",neg_past:"soudan shinakatta",neg_past_polite:"soudan shimasen deshita",te_form:"soudan shite",neg_te:"soudan shinakute",ing_form:"soudan shite iru",tai_form:"soudan shitai",potential:"soudan dekiru",potential_neg:"soudan dekinai",volitional:"soudan shiyou",passive:"soudan sareru",causative:"soudan saseru",imperative:"soudan shiro",conditional:"soudan sureba",conditional_neg:"soudan shinakereba"},
    example_sentence:"先生に相談します。",example_sentence_en:"I consult my teacher."
  },
  {
    dictionary:"連絡する",hiragana:"れんらくする",romaji:"renrakusuru",meaning_en:"to contact / get in touch",group:"irregular",level:"N3",
    forms:{present:"連絡する",present_polite:"連絡します",past:"連絡した",past_polite:"連絡しました",negative:"連絡しない",negative_polite:"連絡しません",neg_past:"連絡しなかった",neg_past_polite:"連絡しませんでした",te_form:"連絡して",neg_te:"連絡しなくて",ing_form:"連絡している",tai_form:"連絡したい",potential:"連絡できる",potential_neg:"連絡できない",volitional:"連絡しよう",passive:"連絡される",causative:"連絡させる",imperative:"連絡しろ",conditional:"連絡すれば",conditional_neg:"連絡しなければ"},
    forms_romaji:{present:"renraku suru",present_polite:"renraku shimasu",past:"renraku shita",past_polite:"renraku shimashita",negative:"renraku shinai",negative_polite:"renraku shimasen",neg_past:"renraku shinakatta",neg_past_polite:"renraku shimasen deshita",te_form:"renraku shite",neg_te:"renraku shinakute",ing_form:"renraku shite iru",tai_form:"renraku shitai",potential:"renraku dekiru",potential_neg:"renraku dekinai",volitional:"renraku shiyou",passive:"renraku sareru",causative:"renraku saseru",imperative:"renraku shiro",conditional:"renraku sureba",conditional_neg:"renraku shinakereba"},
    example_sentence:"後で連絡します。",example_sentence_en:"I will contact you later."
  },
];

// Append conjugated forms for the extra alphabetical verb list
// (deduped against the canonical verbs above by dictionary form).
(function () {
  const existing = new Set(verbData.map(v => v.dictionary));
  const generated = newVerbs
    .filter(v => !existing.has(v.dictionary))
    .map(v => conjugate(v))
    .sort((a, b) => (a.romaji || '').localeCompare(b.romaji || ''));
  generated.forEach(g => existing.add(g.dictionary));
  verbData.push(...generated);
})();
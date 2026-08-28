import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Volume2 } from "lucide-react";
import { verbData } from "@/kumago/verbData";
import { speakJapanese } from "@/kumago/speechUtils";

export const Route = createFileRoute("/hub/kumago")({
  head: () => ({
    meta: [
      { title: "kumaGO くまご — Bridge Nihongo Flow | LIGHTHOUSE 橋" },
      {
        name: "description",
        content:
          "kumaGO くまご: interactive Japanese verb conjugation study and quiz — Bridge Nihongo Flow by LIGHTHOUSE 橋.",
      },
      { property: "og:title", content: "kumaGO くまご — Bridge Nihongo Flow" },
      {
        property: "og:description",
        content: "Study and drill Japanese verb conjugations across all JLPT levels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KumaGoPage,
});

const LEVELS = ["ALL", "N5", "N4", "N3", "N2", "N1"] as const;

const FORM_LABELS: [string, string][] = [
  ["present", "Present · 現在"],
  ["present_polite", "Polite · ます"],
  ["past", "Past · 過去"],
  ["past_polite", "Past Polite · ました"],
  ["negative", "Negative · ない"],
  ["negative_polite", "Neg. Polite · ません"],
  ["te_form", "Te-form · て形"],
  ["ing_form", "Progressive · ている"],
  ["tai_form", "Want to · たい"],
  ["potential", "Potential · 可能"],
  ["volitional", "Volitional · 意向"],
  ["passive", "Passive · 受身"],
  ["causative", "Causative · 使役"],
  ["imperative", "Imperative · 命令"],
  ["conditional", "Conditional · 仮定"],
];

type Verb = {
  dictionary: string;
  hiragana: string;
  romaji: string;
  meaning_en: string;
  group: string;
  level: string;
  forms: Record<string, string>;
  forms_romaji?: Record<string, string>;
  example_sentence?: string;
  example_sentence_en?: string;
};

const VERBS = verbData as Verb[];

function KumaGoPage() {
  const [level, setLevel] = useState<string>("N5");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Verb>(VERBS[0]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return VERBS.filter(
      (v) =>
        (level === "ALL" || v.level === level) &&
        (!needle ||
          v.romaji?.toLowerCase().includes(needle) ||
          v.meaning_en?.toLowerCase().includes(needle) ||
          v.dictionary?.includes(needle) ||
          v.hiragana?.includes(needle)),
    ).slice(0, 250);
  }, [level, q]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-sky">
            TECH · 日本語アプリ
          </div>
          <h1 className="mt-1 font-display text-4xl neon-text">kumaGO くまご</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bridge Nihongo Flow — Japanese verb conjugation study &amp; drill · 動詞活用トレーナー
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Verb browser */}
          <aside className="panel p-4">
            <div className="mb-3 flex flex-wrap gap-1">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-md border px-2 py-1 text-[10px] font-display uppercase tracking-widest transition ${
                    level === l
                      ? "border-sky bg-sky/20 text-sky shadow-[0_0_14px_var(--sky-blue)]"
                      : "border-primary/40 bg-primary/10 text-primary hover:border-sky hover:text-sky"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search verbs · 検索"
              className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <ul className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
              {list.map((v) => (
                <li key={v.dictionary + v.romaji}>
                  <button
                    onClick={() => setSelected(v)}
                    className={`flex w-full items-baseline justify-between gap-2 rounded px-2 py-1.5 text-left transition ${
                      selected?.dictionary === v.dictionary
                        ? "bg-sky/20 text-sky"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    <span className="text-sm">
                      {v.dictionary}{" "}
                      <span className="text-xs text-muted-foreground">{v.romaji}</span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase text-muted-foreground">
                      {v.level}
                    </span>
                  </button>
                </li>
              ))}
              {list.length === 0 && (
                <li className="px-2 py-4 text-xs text-muted-foreground">No verbs found.</li>
              )}
            </ul>
          </aside>

          {/* Detail + quiz */}
          <div className="space-y-6">
            <div className="panel p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-display text-3xl text-primary">{selected.dictionary}</h2>
                <span className="text-sm text-muted-foreground">{selected.hiragana}</span>
                <span className="text-sm text-sky">{selected.romaji}</span>
                <button
                  onClick={() => speakJapanese(selected.dictionary)}
                  className="ml-auto inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-display uppercase tracking-widest text-primary transition hover:bg-sky/20 hover:text-sky"
                >
                  <Volume2 className="h-3 w-3" /> Listen · 聞く
                </button>
              </div>
              <p className="mt-1 text-sm text-foreground">{selected.meaning_en}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {selected.group} · {selected.level}
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {FORM_LABELS.map(([key, label]) => (
                  <div key={key} className="rounded-md border border-border bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {label}
                    </div>
                    <div className="text-base text-foreground">{selected.forms?.[key] ?? "—"}</div>
                    <div className="text-[11px] text-sky">
                      {selected.forms_romaji?.[key] ?? ""}
                    </div>
                  </div>
                ))}
              </div>

              {selected.example_sentence && (
                <div className="mt-5 rounded-md border border-sky/40 bg-sky/5 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-sky">Example · 例文</div>
                  <p className="mt-1 text-base" lang="ja">
                    {selected.example_sentence}
                  </p>
                  <p className="text-xs text-muted-foreground">{selected.example_sentence_en}</p>
                </div>
              )}
            </div>

            <ConjugationQuiz pool={list.length > 4 ? list : VERBS.slice(0, 50)} />
          </div>
        </div>
      </section>
    </div>
  );
}

function pickQuestion(pool: Verb[]) {
  const verb = pool[Math.floor(Math.random() * pool.length)];
  const [key, label] = FORM_LABELS[Math.floor(Math.random() * FORM_LABELS.length)];
  const answer = verb.forms?.[key] ?? verb.dictionary;
  const options = new Set<string>([answer]);
  let guard = 0;
  while (options.size < 4 && guard++ < 60) {
    const other = pool[Math.floor(Math.random() * pool.length)];
    const oKey = FORM_LABELS[Math.floor(Math.random() * FORM_LABELS.length)][0];
    const val = other.forms?.[oKey];
    if (val) options.add(val);
  }
  return {
    verb,
    label,
    answer,
    options: [...options].sort(() => Math.random() - 0.5),
  };
}

function ConjugationQuiz({ pool }: { pool: Verb[] }) {
  const [q, setQ] = useState(() => pickQuestion(pool));
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="panel p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Conjugation Quiz · 活用クイズ
        </h3>
        <div className="font-display text-sm">
          SCORE: <span className="neon-text">{score.toString().padStart(3, "0")}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {q.verb.dictionary} ({q.verb.meaning_en}) → <span className="text-sky">{q.label}</span>
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const state =
            picked == null
              ? "border-border hover:border-sky hover:text-sky"
              : isAnswer
                ? "border-sky bg-sky/20 text-sky"
                : opt === picked
                  ? "border-destructive bg-destructive/20 text-destructive"
                  : "border-border opacity-60";
          return (
            <button
              key={opt}
              disabled={picked != null}
              onClick={() => {
                setPicked(opt);
                if (isAnswer) setScore((s) => s + 10);
              }}
              className={`rounded-md border px-3 py-2 text-left text-base transition ${state}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          setPicked(null);
          setQ(pickQuestion(pool));
        }}
        className="mt-4 rounded-md border border-primary/40 bg-primary/10 px-4 py-1.5 text-[10px] font-display uppercase tracking-widest text-primary transition hover:bg-sky/20 hover:text-sky"
      >
        Next · 次へ
      </button>
    </div>
  );
}

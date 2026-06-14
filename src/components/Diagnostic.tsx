"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";
import { IngredientCard } from "./IngredientCard";
import { getSeasonInfo, type SeasonInfo } from "@/lib/season";
import {
  runDiagnostic,
  type DiagnosticResult,
  type SkinType,
} from "@/lib/diagnostic";
import type { ConcernKey, ActiveUse } from "@/lib/ingredients";

const TOTAL_STEPS = 4;

export function Diagnostic() {
  const { lang, t } = useLang();
  const d = t.diagnostic;

  const [season, setSeason] = useState<SeasonInfo | null>(null);
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [sensitive, setSensitive] = useState<boolean | null>(null);
  const [concerns, setConcerns] = useState<ConcernKey[]>([]);
  const [activeUse, setActiveUse] = useState<ActiveUse | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Compute season client-side to avoid hydration mismatch.
  useEffect(() => {
    setSeason(getSeasonInfo());
  }, []);

  const toggleConcern = (key: ConcernKey) => {
    setConcerns((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length >= 3
          ? prev
          : [...prev, key],
    );
  };

  const canAdvance = useMemo(() => {
    if (step === 0) return skinType !== null;
    if (step === 1) return sensitive !== null;
    if (step === 2) return concerns.length >= 1;
    if (step === 3) return activeUse !== null;
    return false;
  }, [step, skinType, sensitive, concerns, activeUse]);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    // last step → compute
    if (skinType && sensitive !== null && activeUse) {
      setResult(
        runDiagnostic({ skinType, sensitive, concerns, activeUse }),
      );
    }
  };

  const reset = () => {
    setResult(null);
    setStep(0);
    setSkinType(null);
    setSensitive(null);
    setConcerns([]);
    setActiveUse(null);
  };

  return (
    <section id="diagnostic" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{d.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            {d.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone">{d.intro}</p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-line bg-cream shadow-[0_24px_70px_-40px_rgba(12,13,12,0.5)]">
            {/* device header: demo badge + climate context */}
            <div className="flex flex-col gap-3 border-b border-line bg-white/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <span className="inline-flex w-max items-center gap-2 rounded-full bg-ink px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-spring">
                <span className="size-1.5 animate-pulse rounded-full bg-spring" />
                {d.demoBadge}
              </span>
              {season && (
                <div className="flex items-center gap-2.5 text-sm">
                  <span aria-hidden className="text-base">
                    {season.emoji}
                  </span>
                  <span className="text-stone">
                    <span className="font-medium text-ink">
                      {d.climateCity} · {season[lang].label}
                    </span>{" "}
                    <span className="text-stone-2">· {d.climateNote}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-8">
              {!result ? (
                <Questionnaire
                  step={step}
                  d={d}
                  skinTypes={t.skinTypes}
                  concernsList={t.concerns}
                  activesList={t.actives}
                  season={season}
                  lang={lang}
                  skinType={skinType}
                  setSkinType={setSkinType}
                  sensitive={sensitive}
                  setSensitive={setSensitive}
                  concerns={concerns}
                  toggleConcern={toggleConcern}
                  activeUse={activeUse}
                  setActiveUse={setActiveUse}
                  canAdvance={canAdvance}
                  onBack={() => setStep((s) => Math.max(0, s - 1))}
                  onNext={handleNext}
                />
              ) : (
                <Results d={d} lang={lang} result={result} onReset={reset} />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Questionnaire ---------------- */

type DDict = ReturnType<typeof useLang>["t"]["diagnostic"];

function Questionnaire(props: {
  step: number;
  d: DDict;
  skinTypes: ReturnType<typeof useLang>["t"]["skinTypes"];
  concernsList: ReturnType<typeof useLang>["t"]["concerns"];
  activesList: ReturnType<typeof useLang>["t"]["actives"];
  season: SeasonInfo | null;
  lang: "fr" | "en";
  skinType: SkinType | null;
  setSkinType: (s: SkinType) => void;
  sensitive: boolean | null;
  setSensitive: (b: boolean) => void;
  concerns: ConcernKey[];
  toggleConcern: (k: ConcernKey) => void;
  activeUse: ActiveUse | null;
  setActiveUse: (a: ActiveUse) => void;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const {
    step,
    d,
    skinTypes,
    concernsList,
    activesList,
    season,
    lang,
    skinType,
    setSkinType,
    sensitive,
    setSensitive,
    concerns,
    toggleConcern,
    activeUse,
    setActiveUse,
    canAdvance,
    onBack,
    onNext,
  } = props;

  const titles = [d.q1Title, d.q2Title, d.q3Title, d.q4Title];
  const helps = [d.q1Help, d.q2Help, d.q3Help, d.q4Help];

  return (
    <div>
      {/* progress */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-spring-deep" : "bg-line"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-stone-2">
          {d.step} {step + 1} {d.of} {TOTAL_STEPS}
        </span>
      </div>

      <div className="mt-7 min-h-[18rem]">
        <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
          {titles[step]}
        </h3>
        <p className="mt-1.5 text-sm text-stone">{helps[step]}</p>

        {/* Q1 — skin type */}
        {step === 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {skinTypes.map((s) => (
              <OptionCard
                key={s.key}
                selected={skinType === s.key}
                onClick={() => setSkinType(s.key as SkinType)}
                title={s.label}
                desc={s.desc}
              />
            ))}
          </div>
        )}

        {/* Q2 — sensitivity */}
        {step === 1 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={sensitive === true}
              onClick={() => setSensitive(true)}
              title={d.sensitiveYes}
            />
            <OptionCard
              selected={sensitive === false}
              onClick={() => setSensitive(false)}
              title={d.sensitiveNo}
            />
          </div>
        )}

        {/* Q3 — concerns (multi, max 3) */}
        {step === 2 && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {concernsList.map((c) => {
              const on = concerns.includes(c.key as ConcernKey);
              const full = concerns.length >= 3 && !on;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleConcern(c.key as ConcernKey)}
                  disabled={full}
                  aria-pressed={on}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    on
                      ? "border-spring-deep bg-spring/15 font-medium text-moss"
                      : full
                        ? "cursor-not-allowed border-line text-stone-2/50"
                        : "border-line bg-white text-ink/75 hover:border-spring-deep/50"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Q4 — active in use */}
        {step === 3 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activesList.map((a) => (
              <OptionCard
                key={a.key}
                selected={activeUse === a.key}
                onClick={() => setActiveUse(a.key as ActiveUse)}
                title={a.label}
              />
            ))}
          </div>
        )}

        {/* climate note on step 0 */}
        {step === 0 && season && (
          <p className="mt-6 rounded-lg border border-line bg-white/60 px-4 py-3 text-[0.85rem] leading-relaxed text-stone">
            <span className="font-medium text-ink">{d.climateTitle}:</span>{" "}
            {season[lang].humidity}. {season[lang].note}
          </p>
        )}
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className={`text-sm font-medium transition-colors ${
            step === 0
              ? "cursor-not-allowed text-stone-2/40"
              : "text-stone hover:text-ink"
          }`}
        >
          ← {d.back}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
            canAdvance
              ? "spring-glow bg-spring text-spring-ink hover:-translate-y-0.5"
              : "cursor-not-allowed bg-line text-stone-2"
          }`}
        >
          {step === TOTAL_STEPS - 1 ? d.seeResults : d.next}
        </button>
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
        selected
          ? "border-spring-deep bg-spring/10"
          : "border-line bg-white hover:border-spring-deep/40 hover:bg-cream"
      }`}
    >
      <span>
        <span className="block font-medium text-ink">{title}</span>
        {desc && <span className="mt-0.5 block text-xs text-stone">{desc}</span>}
      </span>
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
          selected ? "border-spring-deep bg-spring-deep" : "border-line"
        }`}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.2l2.2 2.3L9.5 3.5"
              stroke="#04130b"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

/* ---------------- Results ---------------- */

function Results({
  d,
  lang,
  result,
  onReset,
}: {
  d: DDict;
  lang: "fr" | "en";
  result: DiagnosticResult;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{d.resultEyebrow}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-ink">
            {d.resultTitle}
          </h3>
          <p className="mt-1.5 max-w-xl text-sm text-stone">{d.resultIntro}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-max items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-stone transition-colors hover:border-ink/30 hover:text-ink"
        >
          ↻ {d.restart}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {result.recommendations.map((rec, i) => (
          <IngredientCard key={rec.ingredient.id} rec={rec} rank={i + 1} />
        ))}
      </div>

      {/* routine logic */}
      <div className="mt-5 rounded-xl bg-ink p-6 text-cream">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-spring">
          {d.routineTitle}
        </p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/80">
          {result.routine[lang]}
        </p>
      </div>

      {/* cautions */}
      {result.cautions.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-stone-2">
            {d.avoidTitle}
          </p>
          <ul className="mt-2 space-y-2">
            {result.cautions.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/75"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-spring-deep" />
                {c[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA → waitlist */}
      <div className="mt-7 flex flex-col items-start gap-4 rounded-xl border border-spring-deep/30 bg-spring/8 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {d.ctaAfterTitle}
          </p>
          <p className="mt-1 text-sm text-stone">{d.ctaAfterBody}</p>
        </div>
        <a
          href="#rejoindre"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          {lang === "fr" ? "Rejoindre la liste" : "Join the list"}
          <span aria-hidden>→</span>
        </a>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-stone-2">{d.disclaimer}</p>
    </div>
  );
}

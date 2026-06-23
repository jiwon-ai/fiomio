"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Lang, Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";
import { IngredientCard } from "./IngredientCard";
import { CitySearch } from "./CitySearch";
import { DiagIcon } from "./diagnostic/icons";
import { seasonFallbackClimate, type ClimateContext } from "@/lib/climate";
import { detectLocation, displayPlace, type Loc, type GeoResult } from "@/lib/geo";
import { buildAffiliateLink } from "@/lib/affiliates";
import { productsForIngredients, yesstyleSearchUrl, type Product } from "@/lib/products";
import { track } from "@/lib/track";
import {
  runDiagnostic,
  type DiagnosticResult,
  type SkinType,
  type Gender,
  type Pregnancy,
} from "@/lib/diagnostic";
import type { ConcernKey, ActiveUse } from "@/lib/ingredients";

// Lazy 3D centerpiece for the results — a constellation of the recommended
// actives around your skin (distinct from the hero drop).
const ResultViz = dynamic(() => import("./ResultViz").then((m) => m.ResultViz), {
  ssr: false,
  loading: () => null,
});

const TOTAL_STEPS = 6;
const AUTO_ADVANCE_MS = 280;

export function Diagnostic({ lang, t }: { lang: Lang; t: Messages }) {
  const d = t.diagnostic;

  const [climate, setClimate] = useState<ClimateContext | null>(null);
  const [loc, setLoc] = useState<Loc | null>(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [sensitive, setSensitive] = useState<boolean | null>(null);
  const [concerns, setConcerns] = useState<ConcernKey[]>([]);
  const [activeUse, setActiveUse] = useState<ActiveUse | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [llmNote, setLlmNote] = useState<{ fr: string; en: string } | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const llmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);
  const [diagId, setDiagId] = useState("");
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A skincare routine is used for months, not the delivery week — so the
  // context is the SEASON at the user's location (hemisphere-aware), not a
  // 7-day forecast.
  const applyClimate = useCallback((l: Loc | null) => {
    setClimate(
      seasonFallbackClimate(
        new Date(),
        l ? displayPlace(l) || l.city : undefined,
        l?.lat,
      ),
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClimate(seasonFallbackClimate());
    let alive = true;
    detectLocation().then((l) => {
      if (!alive) return;
      if (l) setLoc(l);
      applyClimate(l);
    });
    return () => {
      alive = false;
    };
  }, [applyClimate]);

  // Fire "started" once, when the visitor makes their first selection.
  useEffect(() => {
    if (skinType && !startedRef.current) {
      startedRef.current = true;
      track("diagnostic_started");
    }
  }, [skinType]);

  // Clear any pending auto-advance when the step changes or on unmount.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [step]);

  const selectCity = (r: GeoResult) => {
    const l: Loc = { city: r.name, lat: r.lat, lon: r.lon, country: r.country };
    setLoc(l);
    setCityOpen(false);
    applyClimate(l);
  };

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
    if (step === 4) return gender !== null;
    if (step === 5) return pregnancy !== null;
    return false;
  }, [step, skinType, sensitive, concerns, activeUse, gender, pregnancy]);

  const showResults = useCallback((preg: Pregnancy) => {
    if (!skinType || sensitive === null || !activeUse || !gender) return;
    setPregnancy(preg);
    const newDiagId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `d_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setDiagId(newDiagId);
    const input = { skinType, sensitive, concerns, activeUse, gender, pregnancy: preg };
    const cl = climate ?? seasonFallbackClimate();
    const r = runDiagnostic(input, cl);
    setResult(r);
    track("diagnostic_completed", {
      skinType,
      sensitive,
      concerns: concerns.join(",") || "none",
      activeUse,
      gender,
      city: cl.city ?? "",
      season: cl.source === "season" ? cl.en.label : cl.chip.en,
      recommended: r.recommendations.map((rec) => rec.ingredient.id).join(","),
    });
    // Data flywheel — store the anonymous diagnostic (no email / no IP) so the
    // engine improves from real usage. Fire-and-forget; never blocks results.
    fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diagId: newDiagId,
        skinType,
        sensitive,
        concerns,
        activeUse,
        gender,
        pregnancy: preg,
        city: cl.city ?? undefined,
        season: cl.source === "season" ? cl.en.label : cl.chip.en,
        recommended: r.recommendations.map((rec) => rec.ingredient.id),
        lang,
      }),
    }).catch(() => {});
    setLlmNote(null);
    llmTimer.current = setTimeout(() => setLlmLoading(true), 350);
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        climate: cl,
        top3: r.recommendations.map((rec) => rec.ingredient.name),
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.note) setLlmNote(data.note); })
      .catch(() => {})
      .finally(() => {
        if (llmTimer.current) clearTimeout(llmTimer.current);
        setLlmLoading(false);
      });
  }, [skinType, sensitive, concerns, activeUse, gender, climate, lang]);

  // Advance one step forward, honouring the male→skip-pregnancy and
  // last-step→results behaviour. Mirrors the manual "Continue" button.
  const advance = useCallback(
    (currentGender: Gender | null, currentPregnancy: Pregnancy | null) => {
      if (step < TOTAL_STEPS - 1) {
        if (step === 4 && currentGender === "male") {
          showResults("none" as Pregnancy);
          return;
        }
        setStep((s) => s + 1);
        return;
      }
      if (currentPregnancy) showResults(currentPregnancy);
    },
    [step, showResults],
  );

  const handleNext = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advance(gender, pregnancy);
  };

  // Schedule an auto-advance for single-select steps after a selection.
  const scheduleAdvance = useCallback(
    (nextGender?: Gender, nextPregnancy?: Pregnancy) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        advance(
          nextGender ?? gender,
          nextPregnancy ?? pregnancy,
        );
      }, AUTO_ADVANCE_MS);
    },
    [advance, gender, pregnancy],
  );

  const reset = () => {
    startedRef.current = false;
    setResult(null);
    setLlmNote(null);
    setLlmLoading(false);
    if (llmTimer.current) clearTimeout(llmTimer.current);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStep(0);
    setSkinType(null);
    setSensitive(null);
    setConcerns([]);
    setActiveUse(null);
    setGender(null);
    setPregnancy(null);
  };

  const fmtDate = (iso?: string) =>
    iso
      ? new Date(`${iso}T00:00:00`).toLocaleDateString(
          lang === "fr" ? "fr-FR" : "en-US",
          { day: "numeric", month: "short" },
        )
      : "";

  return (
    <section id="diagnostic" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-spring-deep">{d.eyebrow}</p>
          <h2 className="font-display mt-4 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}>
            {d.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone">{d.intro}</p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-line bg-cream shadow-[0_24px_70px_-40px_rgba(15,43,49,0.5)]">
            {/* device header: demo badge + delivery-window forecast */}
            <div className="border-b border-line bg-white/60 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-ink px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-spring">
                  <span className="size-1.5 animate-pulse rounded-full bg-spring" />
                  {d.demoBadge}
                </span>
                {climate && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span aria-hidden className="text-base">
                      {climate.emoji}
                    </span>
                    <span className="text-stone">
                      <span className="font-medium text-ink">
                        {climate.city || displayPlace(loc) || d.climateCity} ·{" "}
                        {climate[lang].label}
                      </span>{" "}
                      <span className="text-stone-2">· {climate[lang].detail}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCityOpen((o) => !o)}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-stone transition-colors hover:border-spring-deep hover:text-ink"
                    >
                      {d.changeCity}
                    </button>
                  </div>
                )}
              </div>
              {climate && (
                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.68rem] uppercase tracking-wider text-stone-2">
                  {climate.source === "forecast" ? (
                    <>
                      <span aria-hidden>📦</span>
                      <span>
                        {d.deliveryAround} {fmtDate(climate.deliveryFrom)} –{" "}
                        {fmtDate(climate.deliveryTo)}
                      </span>
                      <span className="text-spring-deep">· {d.forecastSrc}</span>
                    </>
                  ) : (
                    <span>{d.seasonEst}</span>
                  )}
                </p>
              )}
              {cityOpen && (
                <CitySearch
                  lang={lang}
                  placeholder={d.cityPlaceholder}
                  onSelect={selectCity}
                />
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
                  gendersList={t.genders}
                  pregnancyList={t.pregnancyOptions}
                  climate={climate}
                  lang={lang}
                  skinType={skinType}
                  setSkinType={setSkinType}
                  sensitive={sensitive}
                  setSensitive={setSensitive}
                  concerns={concerns}
                  toggleConcern={toggleConcern}
                  activeUse={activeUse}
                  setActiveUse={setActiveUse}
                  gender={gender}
                  setGender={setGender}
                  pregnancy={pregnancy}
                  setPregnancy={setPregnancy}
                  canAdvance={canAdvance}
                  scheduleAdvance={scheduleAdvance}
                  onBack={() => {
                    if (advanceTimer.current) clearTimeout(advanceTimer.current);
                    setStep((s) => Math.max(0, s - 1));
                  }}
                  onNext={handleNext}
                />
              ) : (
                <Results d={d} lang={lang} result={result} activeUse={activeUse} diagId={diagId} onReset={reset} llmNote={llmNote} llmLoading={llmLoading} />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Questionnaire ---------------- */

type DDict = Messages["diagnostic"];

function Questionnaire(props: {
  step: number;
  d: DDict;
  skinTypes: Messages["skinTypes"];
  concernsList: Messages["concerns"];
  activesList: Messages["actives"];
  gendersList: Messages["genders"];
  pregnancyList: Messages["pregnancyOptions"];
  climate: ClimateContext | null;
  lang: "fr" | "en";
  skinType: SkinType | null;
  setSkinType: (s: SkinType) => void;
  sensitive: boolean | null;
  setSensitive: (b: boolean) => void;
  concerns: ConcernKey[];
  toggleConcern: (k: ConcernKey) => void;
  activeUse: ActiveUse | null;
  setActiveUse: (a: ActiveUse) => void;
  gender: Gender | null;
  setGender: (g: Gender) => void;
  pregnancy: Pregnancy | null;
  setPregnancy: (p: Pregnancy) => void;
  canAdvance: boolean;
  scheduleAdvance: (nextGender?: Gender, nextPregnancy?: Pregnancy) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const {
    step,
    d,
    skinTypes,
    concernsList,
    activesList,
    gendersList,
    pregnancyList,
    climate,
    lang,
    skinType,
    setSkinType,
    sensitive,
    setSensitive,
    concerns,
    toggleConcern,
    activeUse,
    setActiveUse,
    gender,
    setGender,
    pregnancy,
    setPregnancy,
    canAdvance,
    scheduleAdvance,
    onBack,
    onNext,
  } = props;

  const titles = [d.q1Title, d.q2Title, d.q3Title, d.q4Title, d.q6Title, d.q7Title];
  const helps = [d.q1Help, d.q2Help, d.q3Help, d.q4Help, d.q6Help, d.q7Help];

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

        {step === 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {skinTypes.map((s) => (
              <IconCard
                key={s.key}
                icon={s.key}
                selected={skinType === s.key}
                onClick={() => {
                  setSkinType(s.key as SkinType);
                  scheduleAdvance();
                }}
                title={s.label}
                desc={s.desc}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <IconCard
              icon="true"
              selected={sensitive === true}
              onClick={() => {
                setSensitive(true);
                scheduleAdvance();
              }}
              title={d.sensitiveYes}
            />
            <IconCard
              icon="false"
              selected={sensitive === false}
              onClick={() => {
                setSensitive(false);
                scheduleAdvance();
              }}
              title={d.sensitiveNo}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {concernsList.map((c) => {
                const on = concerns.includes(c.key as ConcernKey);
                const full = concerns.length >= 3 && !on;
                return (
                  <IconCard
                    key={c.key}
                    icon={c.key}
                    selected={on}
                    disabled={full}
                    onClick={() => toggleConcern(c.key as ConcernKey)}
                    title={c.label}
                  />
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-wider text-stone-2">
              {concerns.length}/3
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activesList.map((a) => (
              <IconCard
                key={a.key}
                icon={a.key}
                selected={activeUse === a.key}
                onClick={() => {
                  setActiveUse(a.key as ActiveUse);
                  scheduleAdvance();
                }}
                title={a.label}
                desc={"desc" in a ? (a as { desc: string }).desc : undefined}
              />
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {gendersList.map((g) => (
              <IconCard
                key={g.key}
                icon={g.key}
                selected={gender === g.key}
                onClick={() => {
                  setGender(g.key as Gender);
                  scheduleAdvance(g.key as Gender);
                }}
                title={g.label}
              />
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pregnancyList.map((p) => (
              <IconCard
                key={p.key}
                icon={p.key}
                selected={pregnancy === p.key}
                onClick={() => {
                  setPregnancy(p.key as Pregnancy);
                  scheduleAdvance(undefined, p.key as Pregnancy);
                }}
                title={p.label}
                desc={p.desc}
              />
            ))}
          </div>
        )}

        {/* climate note on step 0 — the lead-time differentiator */}
        {step === 0 && climate && (
          <div className="mt-6 rounded-lg border border-spring-deep/25 bg-spring/8 px-4 py-3">
            <p className="text-[0.85rem] leading-relaxed text-ink/80">
              <span className="font-medium text-ink">{d.climateTitle} :</span>{" "}
              {climate[lang].detail}. {climate[lang].note}
            </p>
            <p className="mt-1.5 text-[0.78rem] italic leading-relaxed text-stone">
              {d.leadTimeNote}
            </p>
          </div>
        )}
      </div>

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
          {step === TOTAL_STEPS - 1 || (step === 4 && gender === "male") ? d.seeResults : d.next}
        </button>
      </div>
    </div>
  );
}

function IconCard({
  icon,
  selected,
  disabled,
  onClick,
  title,
  desc,
}: {
  icon: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spring-deep/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-5 ${
        selected
          ? "border-spring-deep bg-spring/10"
          : disabled
            ? "cursor-not-allowed border-line bg-white/50 opacity-50"
            : "border-line bg-white hover:-translate-y-0.5 hover:border-spring-deep/40 hover:bg-cream"
      }`}
    >
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
          selected
            ? "bg-spring text-spring-ink"
            : "bg-spring/10 text-spring-deep group-hover:bg-spring/20"
        }`}
      >
        <DiagIcon name={icon} className="block [&_svg]:size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{title}</span>
        {desc && <span className="mt-0.5 block text-xs leading-snug text-stone">{desc}</span>}
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
              stroke="#f4f5ee"
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
  activeUse,
  diagId,
  onReset,
  llmNote,
  llmLoading,
}: {
  d: DDict;
  lang: "fr" | "en";
  result: DiagnosticResult;
  activeUse: ActiveUse | null;
  diagId: string;
  onReset: () => void;
  llmNote: { fr: string; en: string } | null;
  llmLoading: boolean;
}) {
  const p = d.products;
  const recIds = result.recommendations.map((r) => r.ingredient.id);
  const products = productsForIngredients(recIds, 6);
  const recNames = result.recommendations.map((r) => r.ingredient.name[lang]).join(" · ");
  const gapIntro = activeUse === "none" ? p.gapIntroNone : p.gapIntro;

  return (
    <div>
      {/* 3D centerpiece — the formula, rendered from your climate */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative aspect-square w-56 sm:w-72">
          <ResultViz
            className="absolute inset-0 h-full w-full"
            count={result.recommendations.length}
          />
        </div>
        <p className="mt-3 font-editorial text-base italic text-ink/70">
          {lang === "fr"
            ? "Vos actifs prioritaires, pour la saison qui vient."
            : "Your priority actives, for the season ahead."}
        </p>
      </div>

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

      {/* (a) routine-gap framing */}
      <div className="mt-6 rounded-xl border border-spring-deep/25 bg-spring/8 px-5 py-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-spring-deep">
          {p.gapTitle}
        </p>
        <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/85">
          {gapIntro} <span className="font-medium text-ink">{recNames}.</span>
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {result.recommendations.map((rec, i) => (
          <IngredientCard key={rec.ingredient.id} lang={lang} rec={rec} rank={i + 1} />
        ))}
      </div>

      {/* AI personalised note */}
      {(llmLoading || llmNote) && (
        <div className="mt-5 rounded-xl border border-line bg-white p-5">
          <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-stone-2">
            {lang === "fr" ? "Analyse personnalisée" : "Personalised analysis"}
            <span className="rounded bg-spring-deep/15 px-1.5 py-0.5 text-[0.58rem] font-semibold text-spring-deep">
              AI
            </span>
          </p>
          {llmLoading ? (
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-ink/8" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-ink/8" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-ink/8" />
            </div>
          ) : llmNote ? (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/80">
              {llmNote[lang]}
            </p>
          ) : null}
        </div>
      )}

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

      {/* (b) product matches */}
      {products.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-xl font-semibold text-ink">
            {p.sectionTitle}
          </h4>
          <p className="mt-1 text-sm text-stone">{p.sectionIntro}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => (
              <ProductCard key={prod.id} lang={lang} p={prod} matchLabel={p.matchLabel} seeProduct={p.seeProduct} />
            ))}
          </div>

          {/* (c) affiliate transparency */}
          <p className="mt-4 font-mono text-[0.66rem] leading-relaxed text-stone-2">
            {p.affiliateNote}
          </p>
          <p className="mt-1 font-mono text-[0.66rem] italic leading-relaxed text-stone-2">
            {p.draftNote}
          </p>
        </div>
      )}

      {/* (d) coming + waitlist CTA */}
      <div className="mt-7 flex flex-col items-start gap-4 rounded-xl border border-spring-deep/30 bg-spring/8 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {p.comingTitle}
          </p>
          <p className="mt-1 text-sm text-stone">{p.comingBody}</p>
        </div>
        <a
          href="#rejoindre"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          {p.joinCta}
          <span aria-hidden>→</span>
        </a>
      </div>

      <FeedbackWidget
        d={d}
        lang={lang}
        diagId={diagId}
        recommended={result.recommendations.map((rec) => rec.ingredient.id)}
      />

      <p className="mt-5 text-xs leading-relaxed text-stone-2">{d.disclaimer}</p>
    </div>
  );
}

/* ---------------- Feedback (outcome loop) ---------------- */

function FeedbackWidget({
  d,
  lang,
  diagId,
  recommended,
}: {
  d: DDict;
  lang: "fr" | "en";
  diagId: string;
  recommended: string[];
}) {
  const [sent, setSent] = useState(false);
  const submit = (helpful: boolean) => {
    setSent(true);
    track("feedback_given", { helpful });
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diagId, helpful, recommended, lang }),
    }).catch(() => {});
  };
  return (
    <div className="mt-8 rounded-xl border border-line bg-cream px-5 py-4">
      {sent ? (
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <span aria-hidden>✓</span> {d.fbThanks}
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-ink">{d.fbTitle}</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => submit(true)}
              className="rounded-full bg-spring px-4 py-2 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5"
            >
              {d.fbYes}
            </button>
            <button
              type="button"
              onClick={() => submit(false)}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-stone transition-colors hover:border-ink/30 hover:text-ink"
            >
              {d.fbNo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  lang,
  p,
  matchLabel,
  seeProduct,
}: {
  lang: "fr" | "en";
  p: Product;
  matchLabel: string;
  seeProduct: string;
}) {
  return (
    <div className="lab-frame flex flex-col rounded-xl bg-cream p-5">
      <span className="font-mono text-[0.62rem] uppercase tracking-widest text-stone-2">
        {p.brand}
      </span>
      <h5 className="font-display mt-1 text-base font-semibold leading-snug text-ink">
        {p.name}
      </h5>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {p.ingredientIds.slice(0, 2).map((id) => (
          <span
            key={id}
            className="rounded-full bg-spring/12 px-2.5 py-0.5 text-[0.68rem] font-medium text-moss"
          >
            {matchLabel}: {id}
          </span>
        ))}
      </div>
      <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-ink/75">
        {p.blurb[lang]}
      </p>
      <a
        href={buildAffiliateLink(p.url ?? yesstyleSearchUrl(p.searchQ))}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() =>
          track("product_clicked", { brand: p.brand, name: p.name })
        }
        className="mt-4 inline-flex w-max items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-spring-deep hover:text-spring-deep"
      >
        {seeProduct}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

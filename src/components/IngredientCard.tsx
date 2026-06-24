"use client";

import type { Lang, Messages } from "@/lib/locale";
import { getDictionary } from "@/lib/locale";
import type { Recommendation } from "@/lib/diagnostic";
import { ingredientClimateReason, type ClimateContext } from "@/lib/climate";
import type { TraitKey } from "@/lib/ingredients";

const TIMING: Record<string, { fr: string; en: string }> = {
  AM: { fr: "Matin", en: "AM" },
  PM: { fr: "Soir", en: "PM" },
  "AM/PM": { fr: "Matin & soir", en: "AM & PM" },
};

/** primary trait → a concrete, recognizable line icon (not an abstract blob). */
function primaryTrait(traits: TraitKey[]): TraitKey | "generic" {
  const t = new Set(traits);
  return (
    (t.has("antioxidant") && "antioxidant") ||
    (t.has("brightening") && "brightening") ||
    (t.has("hydrating") && "hydrating") ||
    (t.has("barrier") && "barrier") ||
    (t.has("occlusive") && "occlusive") ||
    (t.has("oilControl") && "oilControl") ||
    (t.has("exfoliating") && "exfoliating") ||
    (t.has("soothing") && "soothing") ||
    (t.has("firming") && "firming") ||
    "generic"
  ) as TraitKey | "generic";
}

function TraitIcon({ traits, className = "" }: { traits: TraitKey[]; className?: string }) {
  const p = primaryTrait(traits);
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (p) {
    case "hydrating":
    case "occlusive":
      return <svg {...common}><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" /></svg>;
    case "barrier":
      return <svg {...common}><path d="M12 3l7 3v5.5c0 4.2-2.9 7.3-7 8.5-4.1-1.2-7-4.3-7-8.5V6l7-3z" /></svg>;
    case "antioxidant":
      return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>;
    case "brightening":
      return <svg {...common}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" /></svg>;
    case "oilControl":
      return <svg {...common}><path d="M12 4s5 5.4 5 9.2a5 5 0 0 1-10 0C7 9.4 12 4 12 4z" /><path d="M5 19L19 5" /></svg>;
    case "exfoliating":
      return <svg {...common}><circle cx="8" cy="8" r="2" /><circle cx="16" cy="9" r="1.6" /><circle cx="10" cy="16" r="1.6" /><circle cx="16" cy="16" r="2" /></svg>;
    case "soothing":
      return <svg {...common}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" /><path d="M5 19c4-2 7-5 9-9" /></svg>;
    case "firming":
      return <svg {...common}><path d="M12 20V7M7 11l5-5 5 5" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

export function IngredientCard({
  lang,
  rec,
  rank,
  climate,
}: {
  lang: Lang;
  rec: Recommendation;
  rank: number;
  climate: ClimateContext;
}) {
  const t: Messages = getDictionary(lang);
  const d = t.diagnostic;
  const ing = rec.ingredient;
  const chips = rec.matched[lang];
  const reason = ingredientClimateReason(ing, climate, lang);

  return (
    <div className="lab-frame flex flex-col rounded-xl bg-cream p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest text-spring-deep">
          {d.priority} 0{rank}
        </span>
        <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-stone">
          {TIMING[ing.timing][lang]}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-spring/15 text-spring-deep">
          <TraitIcon traits={ing.traits} />
        </span>
        <div className="min-w-0">
          <h4 className="font-sans text-xl font-semibold leading-tight text-ink">
            {ing.name[lang]}
          </h4>
          <p className="text-sm text-stone-2">{ing.tag[lang]}</p>
        </div>
      </div>

      {/* the climate reason — the "because your city & climate" line */}
      <div className="mt-4 rounded-lg bg-spring/12 px-3.5 py-3">
        <p className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-spring-deep">
          <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
          {d.whyNowHere}
        </p>
        <p className="mt-1.5 text-[0.9rem] font-medium leading-relaxed text-ink/90">
          {reason}
        </p>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full bg-spring/12 px-2.5 py-0.5 text-[0.72rem] font-medium text-moss"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-stone-2">
          {d.why}
        </p>
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/80">
          {ing.why[lang]}
        </p>
      </div>

      <div className="mt-3">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-stone-2">
          {d.howToUse}
        </p>
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/70">
          {ing.howToUse[lang]}
        </p>
      </div>
    </div>
  );
}

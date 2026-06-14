"use client";

import { useLang } from "@/lib/i18n";
import type { Recommendation } from "@/lib/diagnostic";

const TIMING: Record<string, { fr: string; en: string }> = {
  AM: { fr: "Matin", en: "AM" },
  PM: { fr: "Soir", en: "PM" },
  "AM/PM": { fr: "Matin & soir", en: "AM & PM" },
};

export function IngredientCard({
  rec,
  rank,
}: {
  rec: Recommendation;
  rank: number;
}) {
  const { lang, t } = useLang();
  const d = t.diagnostic;
  const ing = rec.ingredient;
  const chips = rec.matched[lang];

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

      <h4 className="font-display mt-3 text-xl font-semibold text-ink">
        {ing.name[lang]}
      </h4>
      <p className="text-sm text-stone-2">{ing.tag[lang]}</p>

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

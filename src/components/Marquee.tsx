"use client";

import { useLang } from "@/lib/i18n";

/** Infinite ticker of K-beauty actives — the "ingredient-first" signal. */
export function Marquee() {
  const { t } = useLang();
  const items = t.marquee;
  // duplicate for a seamless -50% loop
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line-dark bg-ink py-4 select-none">
      <div className="flex w-max animate-marquee">
        {loop.map((label, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="mx-6 size-1 rounded-full bg-spring-deep" aria-hidden />
            <span className="font-display text-lg font-medium text-cream/85">
              {label}
            </span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

"use client";

import { useLang } from "@/lib/i18n";
import { SkinConstellation } from "./SkinConstellation";

export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  const stats = [
    { v: h.statMarketValue, l: h.statMarketLabel },
    { v: h.statTrustValue, l: h.statTrustLabel },
    { v: h.statActivesValue, l: h.statActivesLabel },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink pt-28 pb-16 sm:pt-32"
    >
      {/* ambient gradient blobs */}
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute -right-32 -top-24 size-[36rem] rounded-full bg-spring/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid-dark opacity-60"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-spring/25 bg-spring/5 px-3 py-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-spring" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-spring">
              {h.eyebrow}
            </span>
          </span>

          <h1 className="font-display mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-[3.6rem]">
            {h.titleLead}{" "}
            <em className="not-italic text-spring">{h.titleEmph}</em>
            {h.titleMid}{" "}
            <em className="italic text-sage">{h.titleEmph2}</em>.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-cream/65 sm:text-lg">
            {h.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#diagnostic"
              className="spring-glow inline-flex items-center justify-center gap-2 rounded-full bg-spring px-6 py-3.5 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5"
            >
              {h.ctaPrimary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#rejoindre"
              className="inline-flex items-center justify-center rounded-full border border-cream/20 px-6 py-3.5 text-sm font-medium text-cream/85 transition-colors hover:border-cream/45 hover:text-cream"
            >
              {h.ctaSecondary}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-cream/45">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-spring-deep" /> {h.chip1}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-spring-deep" /> {h.chip2}
            </span>
          </div>
        </div>

        {/* constellation visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="lab-frame rounded-2xl border-cream/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4">
            <SkinConstellation className="h-auto w-full" />
          </div>
        </div>
      </div>

      {/* stat strip */}
      <div className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line-dark bg-line-dark sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-ink p-6">
              <dt className="font-display text-3xl font-semibold text-spring">
                {s.v}
              </dt>
              <dd className="mt-1.5 text-sm leading-snug text-cream/55">
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

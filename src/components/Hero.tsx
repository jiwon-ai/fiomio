"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { getLocation } from "@/lib/geo";
import { SkinConstellation } from "./SkinConstellation";

export function Hero() {
  const { t, lang } = useLang();
  const h = t.hero;

  const [city, setCity] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getLocation().then((loc) => {
      if (alive && loc?.city) setCity(loc.city);
    });
    return () => {
      alive = false;
    };
  }, []);
  const eyebrowCity = city || (lang === "en" ? "your city" : "votre ville");

  const stats = [
    { v: h.statMarketValue, l: h.statMarketLabel },
    { v: h.statTrustValue, l: h.statTrustLabel },
    { v: h.statActivesValue, l: h.statActivesLabel },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream"
      style={{ minHeight: "100svh" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid opacity-50"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-16 pt-32 sm:px-12">
        {/* Eyebrow */}
        <div className="mb-10 flex items-center gap-3">
          <span className="block h-px w-6 shrink-0 bg-spring-deep/40" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-stone">
            {h.eyebrow} {eyebrowCity}
          </span>
        </div>

        {/* Two-column grid */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] xl:gap-16">
          {/* Left: headline + CTA */}
          <div>
            <h1
              className="font-display font-medium leading-[1.0] tracking-tight text-ink"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6.2rem)" }}
            >
              {h.titleLead}{" "}
              <em className="not-italic text-spring-deep">{h.titleEmph}</em>
              {h.titleMid}{" "}
              <span className="text-stone-2">{h.titleEmph2}</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-stone">
              {h.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#diagnostic"
                className="spring-glow inline-flex items-center justify-center gap-2 rounded-full bg-spring px-6 py-3.5 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5"
              >
                {h.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#rejoindre"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3.5 text-sm font-medium text-stone transition-colors hover:border-ink/35 hover:text-ink"
              >
                {h.ctaSecondary}
              </a>
            </div>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone/60">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-spring-deep" /> {h.chip1}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-spring-deep" /> {h.chip2}
              </span>
            </div>
          </div>

          {/* Right: SkinConstellation */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[0.57rem] uppercase tracking-[0.25em] text-stone/40">
                Skin Analysis
              </span>
              <span className="font-mono text-[0.57rem] text-stone/30">Live Data</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-lg shadow-ink/8">
              <SkinConstellation className="block h-auto w-full" />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 border-t border-line pt-7">
          <dl className="flex flex-wrap gap-x-10 gap-y-5">
            {stats.map((s, i) => (
              <div key={i}>
                <dt className="font-display text-2xl font-semibold text-ink">{s.v}</dt>
                <dd className="mt-1 text-[0.68rem] uppercase tracking-widest text-stone/50">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

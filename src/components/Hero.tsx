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
      className="relative overflow-hidden bg-void"
      style={{ minHeight: "100svh" }}
    >
      {/* Film grain */}
      <div
        aria-hidden
        className="grain-overlay pointer-events-none absolute inset-0 z-0 opacity-30"
      />
      {/* Spring glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-24 z-0 size-[50rem] rounded-full bg-spring/[0.07] blur-[100px]"
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 dot-grid-dark opacity-40"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-16 pt-32 sm:px-12">
        {/* Eyebrow — minimal label */}
        <div className="mb-12 flex items-center gap-3">
          <span className="block h-px w-7 shrink-0 bg-spring/50" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/35">
            {h.eyebrow} {eyebrowCity}
          </span>
        </div>

        {/* Two-column grid */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] xl:gap-20">
          {/* Left: headline + CTA */}
          <div>
            <h1
              className="font-editorial font-light leading-[0.88] tracking-tight text-cream"
              style={{ fontSize: "clamp(3.2rem, 7.8vw, 7.5rem)" }}
            >
              {h.titleLead}{" "}
              <em className="not-italic text-spring">{h.titleEmph}</em>
              {h.titleMid}{" "}
              <span className="text-cream/40">{h.titleEmph2}</span>
            </h1>

            <p className="mt-10 max-w-md text-[1rem] font-light leading-relaxed text-cream/45">
              {h.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <a
                href="#diagnostic"
                className="group inline-flex items-center gap-3 text-sm font-medium text-cream transition-opacity hover:opacity-75"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-spring text-void transition-transform group-hover:scale-105">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {h.ctaPrimary}
              </a>
              <span className="hidden h-5 w-px bg-cream/15 sm:block" />
              <a
                href="#rejoindre"
                className="text-sm font-light text-cream/35 transition-colors hover:text-cream/65"
              >
                {h.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Right: SkinConstellation */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[0.57rem] uppercase tracking-[0.25em] text-cream/18">
                Skin Analysis
              </span>
              <span className="font-mono text-[0.57rem] text-cream/15">Live Data</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-cream/[0.06]">
              <SkinConstellation className="block h-auto w-full" />
            </div>
          </div>
        </div>

        {/* Stats — editorial strip */}
        <div className="mt-20 border-t border-line-void pt-7">
          <dl className="flex flex-wrap gap-x-12 gap-y-5">
            {stats.map((s, i) => (
              <div key={i}>
                <dt className="font-editorial text-[2.2rem] font-light leading-none text-spring">
                  {s.v}
                </dt>
                <dd className="mt-1.5 text-[0.68rem] uppercase tracking-widest text-cream/28">
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

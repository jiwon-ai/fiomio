"use client";

import { useEffect, useState } from "react";
import type { Lang, Messages } from "@/lib/locale";
import { getLocation, displayPlace } from "@/lib/geo";
import dynamic from "next/dynamic";
import { SkinConstellation } from "./SkinConstellation";

import type { OrbClimate } from "./HeroOrb";

const HeroOrb = dynamic(() => import("./HeroOrb").then((m) => m.HeroOrb), {
  ssr: false,
  loading: () => null,
});

export function Hero({ lang, t }: { lang: Lang; t: Messages }) {
  const h = t.hero;

  const [city, setCity] = useState<string | null>(null);
  const [climate, setClimate] = useState<OrbClimate | null>(null);
  const [orbReady, setOrbReady] = useState(false);
  useEffect(() => {
    let alive = true;
    getLocation().then((loc) => {
      if (!alive || !loc) return;
      const place = displayPlace(loc);
      if (place) setCity(place);
      // live local climate → drives the reactive orb + readout
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
          `&current=temperature_2m,relative_humidity_2m,uv_index&timezone=auto`,
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!alive || !d?.current) return;
          const c = d.current;
          setClimate({
            uv: typeof c.uv_index === "number" ? c.uv_index : null,
            hr:
              typeof c.relative_humidity_2m === "number"
                ? c.relative_humidity_2m
                : null,
            temp: typeof c.temperature_2m === "number" ? c.temperature_2m : null,
          });
        })
        .catch(() => {});
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
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-[0.57rem] uppercase tracking-[0.25em] text-stone/40">
                {city ?? "Skin Analysis"}
              </span>
              <span className="font-mono text-[0.57rem] tracking-wider text-stone/45">
                {climate
                  ? [
                      climate.uv != null ? `UV ${Math.round(climate.uv)}` : null,
                      climate.hr != null ? `HR ${Math.round(climate.hr)}%` : null,
                      climate.temp != null
                        ? `${Math.round(climate.temp)}°C`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : "Live Data"}
              </span>
            </div>
            <div className="relative w-full aspect-[6/7]">
              {/* SVG renders instantly (and stays if WebGL is unavailable);
                  the glossy 3D orb fades in over it once three.js lazy-loads. */}
              <SkinConstellation
                lang={lang}
                className={`absolute inset-0 block h-full w-full transition-opacity duration-700 ${
                  orbReady ? "opacity-0" : "opacity-100"
                }`}
              />
              <HeroOrb
                className="absolute inset-0 h-full w-full"
                climate={climate}
                onReady={() => setOrbReady(true)}
              />

              {/* Museum cartel — this hero IS a piece: a serum whose texture
                  is rendered live from your city's climate. */}
              <figcaption className="pointer-events-none absolute bottom-1 right-1 max-w-[68%] text-right sm:bottom-2 sm:right-2">
                <span className="flex items-center justify-end gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-stone/45">
                  Jiwon
                  <span className="size-1 rounded-full bg-spring" aria-hidden />
                  2026
                </span>
                <span className="mt-1 block font-editorial text-[0.95rem] italic leading-tight text-ink/75 sm:text-base">
                  {lang === "fr"
                    ? "\u00ab\u00a0Votre ciel, votre formule\u00a0\u00bb"
                    : "\u201cYour sky, your formula\u201d"}
                </span>
                <span className="mt-1 block text-[0.58rem] leading-snug text-stone/55 sm:text-[0.62rem]">
                  {lang === "fr"
                    ? "Rendu 3D temps r\u00e9el \u00b7 la texture du soin r\u00e9agit \u00e0 l\u2019UV, l\u2019humidit\u00e9 et la temp\u00e9rature de votre ville."
                    : "Real-time 3D render \u00b7 the formula\u2019s texture responds to your city\u2019s UV, humidity and temperature."}
                </span>
              </figcaption>
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

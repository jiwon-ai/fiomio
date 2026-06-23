"use client";

import { useEffect, useState } from "react";
import type { Lang, Messages } from "@/lib/locale";
import { getLocation, displayPlace } from "@/lib/geo";
import dynamic from "next/dynamic";

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
  const [canLoadOrb, setCanLoadOrb] = useState(false);

  // Defer the heavy 3D (three.js) until the browser is idle so it never
  // competes with first interactivity (keeps Total Blocking Time low).
  useEffect(() => {
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    // Skip the heavy WebGL orb on phones/low-power screens — they keep the
    // lightweight CSS placeholder. The orb is a desktop enhancement.
    if (!window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) {
      return;
    }
    const win = window as IdleWin;
    let to: ReturnType<typeof setTimeout> | undefined;
    if (win.requestIdleCallback) {
      win.requestIdleCallback(() => setCanLoadOrb(true), { timeout: 2500 });
    } else {
      to = setTimeout(() => setCanLoadOrb(true), 1500);
    }
    return () => {
      if (to) clearTimeout(to);
    };
  }, []);
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

          {/* Right: live climate-reactive orb + cartel */}
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
              {/* Instant CSS placeholder in the orb's own colour -> the 3D orb
                  crossfades in seamlessly (no detailed image swapping first). */}
              <div
                aria-hidden
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  orbReady ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="aspect-square w-[72%] rounded-full bg-[radial-gradient(circle_at_36%_30%,#f2ffce,#cbef4d_60%,#93c93f)] blur-[1px]" />
              </div>
              {canLoadOrb && (
                <HeroOrb
                  className="absolute inset-0 h-full w-full"
                  climate={climate}
                  onReady={() => setOrbReady(true)}
                />
              )}
            </div>

            {/* Museum cartel -- sits clearly below the work, like a wall label */}
            <figcaption className="mt-7 text-right sm:mt-9">
              <span className="flex items-center justify-end gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-stone/45">
                Jiwon
                <span className="size-1 rounded-full bg-spring" aria-hidden />
                2026
              </span>
              <span className="mt-1 block font-editorial text-base italic leading-tight text-ink/75">
                {lang === "fr" ? "Climat × Formule" : "Climate × Formula"}
              </span>
              <span className="mt-1 block text-[0.6rem] leading-snug text-stone/55">
                {lang === "fr"
                  ? "Rendu 3D temps réel · la texture du soin réagit au climat de votre ville."
                  : "Real-time 3D render · the formula’s texture responds to your city’s climate."}
              </span>
            </figcaption>
          </div>
        </div>

        {/* Customer reassurance (not investor/market data) */}
        <div className="mt-16 border-t border-line pt-7">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone">
            {(lang === "fr"
              ? [
                  "Diagnostic gratuit en 2 minutes",
                  "Sans compte, sans spam",
                  "Sans influence \u2014 jamais sponsoris\u00e9",
                ]
              : [
                  "Free 2-minute diagnostic",
                  "No account, no spam",
                  "Independent \u2014 never sponsored",
                ]
            ).map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full bg-spring-deep"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

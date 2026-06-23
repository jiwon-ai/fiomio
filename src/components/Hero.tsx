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
    getLocation().then((loc0) => {
      if (!alive) return;
      // Fall back to Paris so the live readout always shows something,
      // even when IP geolocation is blocked (public Wi-Fi, ad-blockers).
      const loc = loc0 ?? { city: "Paris", lat: 48.8566, lon: 2.3522 };
      const place = displayPlace(loc) || loc.city;
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

            {/* Museum cartel (real wall-label format): auteur · titre, date ·
                technique · acquisition · n° d'inventaire — left-aligned. */}
            <figcaption className="mt-7 max-w-sm text-left sm:mt-9">
              <span className="block font-display text-lg font-bold tracking-tight text-ink">
                Jiwon
              </span>
              <span className="block font-editorial text-xl italic leading-snug text-ink/80">
                {lang === "fr" ? "« Climat × Formule »" : "\u201cClimate \u00d7 Formula\u201d"}, 2026
              </span>
              <span className="mt-2.5 block text-sm leading-snug text-stone/70">
                {lang === "fr" ? "Rendu 3D temps réel \u00b7 WebGL" : "Real-time 3D render \u00b7 WebGL"}
              </span>
              <span className="block text-sm leading-snug text-stone/70">
                {lang === "fr"
                  ? "Sérum génératif piloté par les données climatiques locales"
                  : "Generative serum driven by local climate data"}
              </span>
              <span className="mt-1.5 block font-mono text-[0.78rem] tracking-wide text-stone/50">
                Inv. FIO·2026·01
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

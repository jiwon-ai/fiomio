"use client";

/* Fiomio hero visual: the visitor's profile (traced from a real photo) read
   as a star map. The whole face carries a faint constellation; the Fiomio "f"
   (lifted from the logo) is the bright highlighted figure on the cheek.
   The three readouts are LIVE: we detect the visitor's city by IP and pull the
   current UV / humidity / temperature from Open-Meteo, so every visitor sees
   their own local numbers. Falls back to Paris if detection fails. */

import { useEffect, useState } from "react";
import { getLocation } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

const PARIS = { city: "Paris", lat: 48.8566, lon: 2.3522 };

type Live = { city: string; uv: number | null; hr: number | null; temp: number | null };

export function SkinConstellation({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const [live, setLive] = useState<Live>({ city: "", uv: null, hr: null, temp: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      let loc = await getLocation();
      if (!loc || typeof loc.lat !== "number") loc = PARIS;
      const city = loc.city || PARIS.city;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
            `&current=temperature_2m,relative_humidity_2m,uv_index&timezone=auto`,
        );
        const d = await res.json();
        const c = d?.current ?? {};
        if (!alive) return;
        setLive({
          city,
          uv: typeof c.uv_index === "number" ? c.uv_index : null,
          hr: typeof c.relative_humidity_2m === "number" ? c.relative_humidity_2m : null,
          temp: typeof c.temperature_2m === "number" ? c.temperature_2m : null,
        });
      } catch {
        if (alive) setLive((s) => ({ ...s, city }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const uvT = live.uv == null ? "··" : `${Math.round(live.uv)}`;
  const hrT = live.hr == null ? "··" : `${Math.round(live.hr)}%`;
  const tempT = live.temp == null ? "··" : `${Math.round(live.temp)}°C`;
  const cityT = live.city || "···";
  const intro = lang === "en" ? "You are" : "Vous êtes";
  const prep = lang === "en" ? "in" : "à";

  const FACE =
    "M268,0 L492,0 L492,572 L445,547 L434,539 L425,529 L416,523 L387,509 L368,495 L349,488 L337,488 L320,493 L303,503 L278,523 L264,530 L247,535 L230,535 L224,533 L216,528 L204,514 L198,499 L197,482 L192,478 L178,474 L175,465 L175,458 L179,451 L167,443 L161,436 L161,429 L164,423 L164,415 L160,405 L158,403 L149,405 L135,404 L131,402 L122,391 L121,380 L123,371 L135,346 L151,300 L150,281 L140,261 L134,240 L130,207 L130,183 L138,154 L159,117 L160,113 L157,109 L161,105 L160,98 L163,95 L161,93 L165,84 L165,80 L174,68 L175,64 L190,45 L197,40 L207,28 L218,21 L223,19 L224,20 L227,17 L230,18 L232,15 L245,11 Z";

  return (
    <svg viewBox="0 0 480 560" className={className} role="img" aria-label={`Profil lu comme une carte du ciel, données locales en direct${live.city ? ` pour ${live.city}` : ""}`}>
      <defs>
        <radialGradient id="fio-glow" cx="48%" cy="44%" r="60%">
          <stop offset="0%" stopColor="#cbef4d" stopOpacity="0.20" />
          <stop offset="55%" stopColor="#cbef4d" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#cbef4d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fio-fglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#cbef4d" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#cbef4d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fio-skin" x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0%" stopColor="#e3fa7d" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#6fcb9e" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#2f8f78" stopOpacity="0.10" />
        </linearGradient>
        <pattern id="fio-dotbg" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#cbef4d" fillOpacity="0.05" />
        </pattern>
        <filter id="fio-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.9  0 0 0 0 1  0 0 0 0 0.78  0 0 0 0.45 0" />
        </filter>
        <clipPath id="fio-panel">
          <rect x="0" y="0" width="480" height="560" rx="24" />
        </clipPath>
        <clipPath id="fio-face">
          <path d={FACE} />
        </clipPath>
      </defs>

      <g clipPath="url(#fio-panel)">
        <rect x="0" y="0" width="480" height="560" fill="#0e2a30" />
        <rect x="0" y="0" width="480" height="560" fill="url(#fio-dotbg)" />
        <circle cx="239" cy="255" r="300" fill="url(#fio-glow)" />

        <g transform="translate(19,-25)">
          <path d={FACE} fill="url(#fio-skin)" />

          {/* film grain + faint face-wide constellation, clipped to the face */}
          <g clipPath="url(#fio-face)">
            <rect x="120" y="-30" width="400" height="620" filter="url(#fio-grain)" opacity="0.5" />
            <g stroke="#cbef4d" strokeOpacity="0.15" strokeWidth="0.5">
              <line x1="185" y1="95" x2="255" y2="80" /><line x1="255" y1="80" x2="330" y2="130" /><line x1="185" y1="95" x2="165" y2="185" /><line x1="255" y1="80" x2="240" y2="165" /><line x1="240" y1="165" x2="305" y2="205" /><line x1="165" y1="185" x2="240" y2="165" /><line x1="165" y1="185" x2="150" y2="265" /><line x1="305" y1="205" x2="300" y2="290" /><line x1="240" y1="165" x2="300" y2="290" /><line x1="150" y1="265" x2="180" y2="345" /><line x1="300" y1="290" x2="330" y2="360" /><line x1="180" y1="345" x2="195" y2="425" /><line x1="330" y1="360" x2="285" y2="440" /><line x1="195" y1="425" x2="160" y2="405" /><line x1="195" y1="425" x2="235" y2="500" /><line x1="285" y1="440" x2="235" y2="500" /><line x1="235" y1="500" x2="305" y2="505" /><line x1="285" y1="440" x2="305" y2="505" /><line x1="305" y1="205" x2="390" y2="250" /><line x1="330" y1="360" x2="420" y2="400" /><line x1="285" y1="440" x2="420" y2="400" /><line x1="330" y1="130" x2="305" y2="205" />
            </g>
            <g fill="#cdeaad">
              <circle cx="185" cy="95" r="1" opacity="0.4" /><circle cx="255" cy="80" r="1" opacity="0.4"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="3.3s" repeatCount="indefinite" /></circle><circle cx="330" cy="130" r="1" opacity="0.4" /><circle cx="165" cy="185" r="1" opacity="0.4" /><circle cx="240" cy="165" r="1" opacity="0.4"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.9s" begin="0.6s" repeatCount="indefinite" /></circle><circle cx="305" cy="205" r="1" opacity="0.4" /><circle cx="150" cy="265" r="1" opacity="0.4" /><circle cx="300" cy="290" r="1" opacity="0.4" /><circle cx="180" cy="345" r="1" opacity="0.4" /><circle cx="330" cy="360" r="1" opacity="0.4"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="3.1s" begin="1s" repeatCount="indefinite" /></circle><circle cx="195" cy="425" r="1" opacity="0.4" /><circle cx="285" cy="440" r="1" opacity="0.4" /><circle cx="160" cy="405" r="1" opacity="0.4" /><circle cx="235" cy="500" r="1" opacity="0.4" /><circle cx="305" cy="505" r="1" opacity="0.4" /><circle cx="390" cy="250" r="1" opacity="0.4" /><circle cx="420" cy="400" r="1" opacity="0.4" />
            </g>
            <g fill="#bfe6a8">
              <circle cx="210" cy="120" r="0.5" opacity="0.2" /><circle cx="360" cy="180" r="0.5" opacity="0.2" /><circle cx="140" cy="320" r="0.5" opacity="0.2" /><circle cx="430" cy="300" r="0.5" opacity="0.2" /><circle cx="270" cy="380" r="0.5" opacity="0.2" /><circle cx="360" cy="490" r="0.5" opacity="0.2" /><circle cx="200" cy="220" r="0.5" opacity="0.2" /><circle cx="320" cy="450" r="0.5" opacity="0.2" />
            </g>
          </g>

          <path d={FACE} fill="none" stroke="#eaf980" strokeOpacity="0.5" strokeWidth="1.3" strokeLinejoin="round" />

          {/* highlighted f constellation (lifted from the logo) */}
          <circle cx="255" cy="332" r="58" fill="url(#fio-fglow)" />
          <g stroke="#cbef4d" strokeOpacity="0.18" strokeWidth="0.5">
            <line x1="284.6" y1="306.1" x2="300" y2="290" />
            <line x1="225.4" y1="385.7" x2="195" y2="425" />
          </g>
          <g transform="translate(255,332) scale(1.85) translate(-39,-43)">
            <g stroke="#dff582" strokeOpacity="0.55" strokeWidth="0.6">
              <line x1="55" y1="29" x2="49.5" y2="16" /><line x1="49.5" y1="16" x2="38" y2="23" /><line x1="38" y1="23" x2="39.4" y2="34" /><line x1="39.4" y1="34" x2="43" y2="47" /><line x1="43" y1="47" x2="41.6" y2="64" /><line x1="41.6" y1="64" x2="35" y2="74" /><line x1="35" y1="74" x2="23" y2="72" /><line x1="27" y1="47" x2="43" y2="47" /><line x1="43" y1="47" x2="52" y2="44" />
            </g>
            <g fill="#f3ffce">
              <circle cx="49.5" cy="16" r="3" fill="#cbef4d" fillOpacity="0.18" />
              <circle cx="55" cy="29" r="1.4"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite" /></circle>
              <circle cx="49.5" cy="16" r="1.8"><animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" begin="0.4s" repeatCount="indefinite" /></circle>
              <circle cx="38" cy="23" r="1.4" />
              <circle cx="39.4" cy="34" r="1.4"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" begin="0.8s" repeatCount="indefinite" /></circle>
              <circle cx="41.6" cy="64" r="1.4"><animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1.1s" repeatCount="indefinite" /></circle>
              <circle cx="35" cy="74" r="1.4" />
              <circle cx="23" cy="72" r="1.5"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.7s" begin="0.6s" repeatCount="indefinite" /></circle>
              <circle cx="27" cy="47" r="1.4" /><circle cx="52" cy="44" r="1.4" />
            </g>
            <circle cx="43" cy="47" r="5.5" fill="#cbef4d" fillOpacity="0.28">
              <animate attributeName="r" values="4.5;7.5;4.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.12;0.35" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="43" cy="47" r="2.4" fill="#eafff0" />
          </g>

          {/* live local readouts (UV / humidity / temperature) */}
          <g stroke="#cbef4d" strokeOpacity="0.34" strokeWidth="0.8">
            <line x1="60" y1="230" x2="165" y2="240" /><line x1="66" y1="360" x2="156" y2="360" /><line x1="60" y1="506" x2="200" y2="500" />
          </g>
          <g fill="#cbef4d">
            <circle cx="165" cy="240" r="2.4" /><circle cx="156" cy="360" r="2.4" /><circle cx="200" cy="500" r="2.4" />
            <circle cx="6" cy="226" r="1.8"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" /></circle>
            <circle cx="6" cy="356" r="1.8"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" begin="0.5s" repeatCount="indefinite" /></circle>
            <circle cx="6" cy="502" r="1.8"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" begin="0.9s" repeatCount="indefinite" /></circle>
          </g>
          <g fontFamily="var(--font-mono), ui-monospace, monospace" letterSpacing="0.05em" fill="#cbef4d">
            <text x="14" y="230" fontSize="14">UV {uvT}</text>
            <text x="14" y="364" fontSize="14">HR {hrT}</text>
            <text x="14" y="506" fontSize="14">{tempT}</text>
          </g>

          {/* "you are here" header: the visitor's detected city, set apart from the data */}
          <g>
            <circle cx="17" cy="50" r="2.2" fill="#cbef4d">
              <animate attributeName="opacity" values="1;0.35;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="17" cy="50" r="2.2" fill="none" stroke="#cbef4d" strokeOpacity="0.6">
              <animate attributeName="r" values="2.2;9" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <text x="28" y="55" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="12.5" letterSpacing="0.01em" fill="#9fc0aa">
              {intro}
            </text>
            <text x="15" y="82" fontFamily="var(--font-sans), system-ui, sans-serif" fontSize="23" fontWeight="600" fill="#cbef4d">
              {prep} {cityT}
            </text>
          </g>

          {/* cyan scan laser, sweeping up and down */}
          <g>
            <rect x="116" y="-7" width="210" height="14" fill="#3fe9ff" fillOpacity="0.1" />
            <rect x="116" y="-1" width="210" height="2.2" fill="#ecffff" fillOpacity="0.92" />
            <rect x="116" y="-1" width="210" height="2.2" fill="#3fe9ff" fillOpacity="0.5" />
            <animateTransform attributeName="transform" type="translate" values="0,130; 0,510; 0,130" dur="5.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
          </g>
        </g>
      </g>

      <rect x="0.5" y="0.5" width="479" height="559" rx="24" fill="none" stroke="#cbef4d" strokeOpacity="0.15" />
    </svg>
  );
}

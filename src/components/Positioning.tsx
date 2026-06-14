"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Positioning() {
  const { t } = useLang();
  const pos = t.positioning;

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">{pos.eyebrow}</p>
            <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.6rem]">
              {pos.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-stone">{pos.intro}</p>

            <ul className="mt-7 space-y-3">
              {pos.fiomioPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-spring-deep" />
                  <span className="text-[0.95rem] text-ink/80">{pt}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* positioning map */}
          <Reveal delay={120}>
            <div className="lab-frame rounded-2xl bg-cream p-6 sm:p-8">
              <div className="relative aspect-square w-full">
                {/* axes */}
                <div className="absolute inset-0 dot-grid rounded-xl opacity-50" />
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-line" />

                {/* axis labels */}
                <span className="absolute -bottom-1 left-1/2 hidden -translate-x-1/2 translate-y-full pt-2 font-mono text-[0.65rem] uppercase tracking-widest text-stone-2 sm:block">
                  {pos.axisX}
                </span>
                <span className="absolute -left-2 top-1/2 hidden -translate-x-full -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-widest text-stone-2 sm:block">
                  {pos.axisY}
                </span>

                {/* competitors (generalist / global quadrants) */}
                {[
                  { name: pos.others[0], top: "22%", left: "26%" },
                  { name: pos.others[1], top: "38%", left: "16%" },
                  { name: pos.others[2], top: "30%", left: "62%" },
                  { name: pos.others[3], top: "60%", left: "54%" },
                ].map((c) => (
                  <span
                    key={c.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1 text-xs text-stone"
                    style={{ top: c.top, left: c.left }}
                  >
                    {c.name}
                  </span>
                ))}

                {/* Fiomio — specialist + local quadrant (bottom-right) */}
                <span
                  className="spring-glow absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-spring px-3.5 py-1.5 text-sm font-semibold text-spring-ink"
                  style={{ top: "76%", left: "78%" }}
                >
                  <span className="size-1.5 rounded-full bg-spring-ink" />
                  Fiomio
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

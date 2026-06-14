"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Market() {
  const { t } = useLang();
  const m = t.market;

  return (
    <section id="marche" className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 size-[34rem] rounded-full bg-spring/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-spring">{m.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-cream sm:text-[2.6rem]">
            {m.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream/60">{m.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {m.stats.map((stat, i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className="lab-frame rounded-2xl border-cream/10 bg-white/[0.03] p-7 sm:p-8"
            >
              <p className="font-display text-3xl font-semibold text-spring sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/75">
                {stat.label}
              </p>
              <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-widest text-cream/35">
                {stat.source}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

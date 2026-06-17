"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Solution() {
  const { t } = useLang();
  const s = t.solution;

  return (
    <section id="solution" className="relative overflow-hidden bg-void-2 py-32 sm:py-40">
      {/* Ghost art number */}
      <span aria-hidden className="art-number select-none">02</span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        {/* Section label */}
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring">
            02
          </span>
          <span className="block h-px w-12 bg-spring/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/25">
            {s.eyebrow}
          </span>
        </Reveal>

        <Reveal className="max-w-3xl">
          <h2
            className="font-editorial font-light leading-[0.92] tracking-tight text-cream"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
          >
            {s.title}
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-cream/45">{s.intro}</p>
        </Reveal>

        {/* Process flow */}
        <div className="mt-16 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {s.steps.map((step, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="lab-frame-dark h-full p-7 hover:border-spring/20 transition-colors">
                <span className="font-mono text-[0.6rem] tracking-widest text-spring/60">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-base font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/42">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Output highlight */}
        <Reveal delay={320}>
          <div className="mt-4 spring-glow lab-frame-dark p-8">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-spring">
              {s.resultLabel}
            </span>
            <h3 className="font-editorial mt-4 text-2xl font-light text-cream">
              {s.resultTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/55">{s.resultBody}</p>
          </div>
        </Reveal>

        {/* Differentiator note */}
        <Reveal className="mt-8">
          <div className="flex flex-col gap-3 border-t border-line-void pt-7 sm:flex-row sm:items-center">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-spring/60 sm:shrink-0">
              {s.differentiatorLabel}
            </span>
            <p className="text-sm leading-relaxed text-cream/42">{s.differentiator}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

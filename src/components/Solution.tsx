"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Solution() {
  const { t } = useLang();
  const s = t.solution;

  return (
    <section id="solution" className="relative overflow-hidden bg-paper-2 py-28 sm:py-36">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-0 font-editorial leading-[0.82] tracking-[-0.04em] text-ink/[0.03]"
        style={{ fontSize: "clamp(7rem, 20vw, 16rem)" }}
      >
        02
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring-deep">
            02
          </span>
          <span className="block h-px w-12 bg-spring-deep/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-stone/50">
            {s.eyebrow}
          </span>
        </Reveal>

        <Reveal className="max-w-3xl">
          <h2
            className="font-editorial font-light leading-[0.92] tracking-tight text-ink"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
          >
            {s.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-stone">{s.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {s.steps.map((step, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="lab-frame h-full bg-cream p-7 transition-colors hover:bg-white">
                <span className="font-mono text-[0.6rem] tracking-widest text-spring-deep">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <div className="spring-glow mt-4 bg-ink p-8 text-cream">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-spring">
              {s.resultLabel}
            </span>
            <h3 className="font-display mt-4 text-xl font-semibold text-cream">
              {s.resultTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">{s.resultBody}</p>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-spring-deep sm:shrink-0">
              {s.differentiatorLabel}
            </span>
            <p className="text-sm leading-relaxed text-stone">{s.differentiator}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

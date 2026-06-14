"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Solution() {
  const { t } = useLang();
  const s = t.solution;

  return (
    <section id="solution" className="bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            {s.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone">{s.intro}</p>
        </Reveal>

        {/* three inputs → output */}
        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-4">
          {s.steps.map((step, i) => (
            <Reveal key={i} delay={i * 90} className="relative">
              <div className="lab-frame h-full rounded-xl bg-cream p-6">
                <span className="font-mono text-xs tracking-widest text-spring-deep">
                  {step.n}
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {step.body}
                </p>
              </div>
              {/* connector arrow */}
              <span
                aria-hidden
                className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-spring-deep text-cream lg:flex"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Reveal>
          ))}

          {/* output card */}
          <Reveal delay={280}>
            <div className="spring-glow flex h-full flex-col justify-between rounded-xl bg-ink p-6 text-cream">
              <span className="font-mono text-xs uppercase tracking-widest text-spring">
                {s.resultLabel}
              </span>
              <div className="mt-3">
                <h3 className="font-display text-lg font-semibold text-cream">
                  {s.resultTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">
                  {s.resultBody}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* differentiator */}
        <Reveal className="mt-10">
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-cream/60 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-spring-deep sm:shrink-0">
              {s.differentiatorLabel}
            </span>
            <p className="text-[0.95rem] leading-relaxed text-ink/80">
              {s.differentiator}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

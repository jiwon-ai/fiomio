"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function WhyDifferent() {
  const { t } = useLang();
  const w = t.whyDifferent;

  return (
    <section className="relative overflow-hidden bg-void py-32 sm:py-40">
      {/* Ghost art number */}
      <span aria-hidden className="art-number select-none">03</span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        {/* Section label */}
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring">
            03
          </span>
          <span className="block h-px w-12 bg-spring/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/25">
            {w.eyebrow}
          </span>
        </Reveal>

        <Reveal className="max-w-3xl">
          <h2
            className="font-editorial font-light leading-[0.92] tracking-tight text-cream"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
          >
            {w.title}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {w.items.map((it, i) => (
            <Reveal as="div" key={i} delay={i * 90}>
              <div className="border-t border-line-void pt-7">
                <span className="font-editorial text-5xl font-light text-spring/30">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-5 text-base font-semibold leading-snug text-cream">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/42">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

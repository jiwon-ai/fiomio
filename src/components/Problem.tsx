"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Problem() {
  const { t } = useLang();
  const p = t.problem;

  return (
    <section id="probleme" className="relative overflow-hidden bg-void py-32 sm:py-40">
      {/* Ghost art number */}
      <span aria-hidden className="art-number select-none">01</span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        {/* Section label */}
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring">
            01
          </span>
          <span className="block h-px w-12 bg-spring/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/25">
            {p.eyebrow}
          </span>
        </Reveal>

        <Reveal>
          <h2
            className="font-editorial font-light leading-[0.92] tracking-tight text-cream"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
          >
            {p.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-cream/45">
            {p.intro}
          </p>
        </Reveal>

        {/* Items as editorial vertical list */}
        <ul className="mt-16">
          {p.items.map((item, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 80}
              className="group grid grid-cols-[2.5rem_1fr] gap-6 border-t border-line-void py-8 transition-colors hover:border-spring/20 sm:grid-cols-[3.5rem_1fr]"
            >
              <span className="font-mono text-xs text-spring/50 pt-[0.2rem]">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/42">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
          <li className="border-t border-line-void" aria-hidden />
        </ul>
      </div>
    </section>
  );
}

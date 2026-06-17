"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Engagement() {
  const { t } = useLang();
  const e = t.engagement;

  return (
    <section className="relative overflow-hidden bg-void-2 py-32 text-cream sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[36rem] rounded-full bg-spring/[0.06] blur-[90px]"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{e.eyebrow}</p>
          <h2
            className="font-editorial mt-6 font-light leading-[0.92] tracking-tight text-cream"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            {e.title}
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-cream/45">
            {e.intro}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {e.items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 70} className="flex gap-4">
              <span className="mt-0.5 h-px w-5 shrink-0 translate-y-3 bg-spring/50" />
              <div>
                <h3 className="text-sm font-semibold text-cream">{item.title}</h3>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-cream/40">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Founder note */}
        <Reveal className="mt-16">
          <figure className="lab-frame-dark max-w-2xl p-8 sm:p-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-spring/70">
              {e.founderEyebrow}
            </p>
            <blockquote className="font-editorial mt-5 font-light leading-relaxed text-cream/85 sm:text-xl"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)" }}>
              &ldquo;{e.founderNote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-xs text-cream/35">
              — {e.founderSign}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Engagement() {
  const { t } = useLang();
  const e = t.engagement;

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[34rem] rounded-full bg-spring/8 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-spring">{e.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-cream sm:text-[2.6rem]">
            {e.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream/60">{e.intro}</p>
        </Reveal>

        <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {e.items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 70} className="flex gap-3.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-spring/15 text-spring">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5l3.2 3.2L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-cream">{item.title}</h3>
                <p className="mt-1 text-[0.9rem] leading-relaxed text-cream/55">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* founder note */}
        <Reveal className="mt-14">
          <figure className="lab-frame max-w-2xl rounded-2xl border-cream/10 bg-white/[0.03] p-7 sm:p-9">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-spring">
              {e.founderEyebrow}
            </p>
            <blockquote className="font-display mt-4 text-lg leading-relaxed text-cream/90 sm:text-xl">
              “{e.founderNote}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-cream/55">
              — {e.founderSign}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

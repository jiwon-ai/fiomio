"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function WhyDifferent() {
  const { t } = useLang();
  const w = t.whyDifferent;

  return (
    <section className="bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{w.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            {w.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {w.items.map((it, i) => (
            <Reveal as="div" key={i} delay={i * 90}>
              <div className="lab-frame h-full rounded-xl bg-cream p-7">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-spring font-mono text-sm font-semibold text-spring-ink">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-4 text-lg font-semibold leading-snug text-ink">
                  {it.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-stone">
                  {it.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

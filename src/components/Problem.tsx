"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

export function Problem() {
  const { t } = useLang();
  const p = t.problem;

  return (
    <section id="probleme" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            {p.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone">{p.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {p.items.map((item, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 80}
              className="group bg-cream p-7 transition-colors hover:bg-white sm:p-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-spring-deep">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-stone">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

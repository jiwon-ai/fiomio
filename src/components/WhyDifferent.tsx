import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function WhyDifferent({ t }: { t: Messages }) {
  const w = t.whyDifferent;

  return (
    <section className="bg-paper-2 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <Reveal>
          <span className="text-sm font-semibold text-spring-deep">{w.eyebrow}</span>
          <h2
            className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.95rem, 4.2vw, 3.875rem)" }}
          >
            {w.title}
          </h2>
        </Reveal>

        <div className="mt-12 border-b border-line">
          {w.items.map((it, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-6 border-t border-line py-6 sm:gap-8">
                <span className="font-display text-[1.75rem] font-semibold leading-none text-spring-deep">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {it.title}
                  </h3>
                  <p className="mt-1.5 text-base leading-relaxed text-stone">
                    {it.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

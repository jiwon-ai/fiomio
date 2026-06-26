import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function Solution({ t }: { t: Messages }) {
  const s = t.solution;

  return (
    <section id="solution" className="bg-paper-2 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <Reveal>
          <span className="text-sm font-semibold text-spring-deep">{s.eyebrow}</span>
          <h2
            className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.95rem, 4.2vw, 3.875rem)" }}
          >
            {s.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone">{s.intro}</p>
        </Reveal>

        <div className="mt-12 border-b border-line">
          {s.steps.map((step, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-6 border-t border-line py-6 sm:gap-8">
                <span className="font-display text-[1.75rem] font-semibold leading-none text-spring-deep">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-stone">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone sm:shrink-0">
              {s.resultLabel}
            </span>
            <p className="text-base leading-relaxed text-ink">
              <span className="font-semibold">{s.resultTitle}</span> {s.resultBody}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-5">
          <p className="text-sm leading-relaxed text-stone">{s.differentiator}</p>
        </Reveal>
      </div>
    </section>
  );
}

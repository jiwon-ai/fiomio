import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function WhyDifferent({ t }: { t: Messages }) {
  const w = t.whyDifferent;

  return (
    <section className="relative overflow-hidden bg-paper-2 py-28 sm:py-36">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-0 font-editorial leading-[0.82] tracking-[-0.04em] text-ink/[0.03]"
        style={{ fontSize: "clamp(7rem, 20vw, 16rem)" }}
      >
        03
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring-deep">
            03
          </span>
          <span className="block h-px w-12 bg-spring-deep/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-stone/50">
            {w.eyebrow}
          </span>
        </Reveal>

        <Reveal className="max-w-3xl">
          <h2
            className="font-display font-medium leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            {w.title}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {w.items.map((it, i) => (
            <Reveal as="div" key={i} delay={i * 90}>
              <div className="border-t border-line pt-7">
                <span className="font-display text-4xl font-light text-spring-deep/20">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-5 text-base font-semibold leading-snug text-ink">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

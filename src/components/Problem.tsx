import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function Problem({ t }: { t: Messages }) {
  const p = t.problem;

  return (
    <section id="probleme" className="relative overflow-hidden bg-paper py-28 sm:py-36">
      {/* Ghost art number — subtle on light bg */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-0 font-editorial leading-[0.82] tracking-[-0.04em] text-ink/[0.03]"
        style={{ fontSize: "clamp(7rem, 20vw, 16rem)" }}
      >
        01
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-spring-deep">
            01
          </span>
          <span className="block h-px w-12 bg-spring-deep/30" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-stone/50">
            {p.eyebrow}
          </span>
        </Reveal>

        <Reveal>
          <h2
            className="font-display font-medium leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            {p.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone">
            {p.intro}
          </p>
        </Reveal>

        <ul className="mt-16">
          {p.items.map((item, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 80}
              className="group grid grid-cols-[2.5rem_1fr] gap-6 border-t border-line py-8 transition-colors hover:border-spring-deep/30 sm:grid-cols-[3.5rem_1fr]"
            >
              <span className="font-mono text-xs text-spring-deep/60 pt-[0.2rem]">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-stone">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
          <li className="border-t border-line" aria-hidden />
        </ul>
      </div>
    </section>
  );
}

import type { Messages } from "@/lib/locale";
import { Reveal } from "./ui/Reveal";

export function Engagement({ t }: { t: Messages }) {
  const e = t.engagement;

  return (
    <section className="bg-paper py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{e.eyebrow}</p>
          <h2
            className="font-display mt-5 font-medium leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.95rem, 4.2vw, 3.875rem)" }}
          >
            {e.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone">{e.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {e.items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 70} className="flex gap-4">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-spring/20 text-spring-deep">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5l3.2 3.2L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-stone">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Founder note */}
        <Reveal className="mt-14">
          <figure className="lab-frame max-w-2xl bg-cream p-8 sm:p-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-spring-deep">
              {e.founderEyebrow}
            </p>
            <blockquote className="font-display mt-4 text-base font-normal leading-relaxed text-ink sm:text-lg">
              &ldquo;{e.founderNote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-stone">
              {e.founderSign}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

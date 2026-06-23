import { getDictionary, type Lang } from "@/lib/locale";

/** B2B page — surfaces Fiomio's second, high-margin revenue line: anonymized
 *  contextual demand data + reports for brands. Server component. */
export function BrandsContent({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const b = t.brands;

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-cream pb-24 pt-36 sm:pb-32 sm:pt-44">
        <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-12">
          <p className="eyebrow text-spring-deep">{b.eyebrow}</p>
          <h1
            className="font-display mt-5 max-w-3xl font-medium leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            {b.title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
            {b.intro}
          </p>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line sm:grid-cols-3">
            {b.items.map((it, i) => (
              <div key={i} className="bg-paper p-7 sm:p-8">
                <span className="font-display text-4xl font-light text-spring-deep/25">
                  0{i + 1}
                </span>
                <h2 className="font-display mt-5 text-lg font-semibold text-ink">
                  {it.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {it.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-widest text-stone/50">
            {b.privacy}
          </p>

          <div className="spring-glow mt-14 flex flex-col gap-5 rounded-2xl bg-ink p-9 text-cream sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="max-w-md">
              <h2 className="font-display text-2xl font-semibold text-cream">
                {b.ctaTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream/65">
                {b.ctaBody}
              </p>
            </div>
            <a
              href="mailto:hello@fiomio.io?subject=Fiomio%20%C3%97%20Marques"
              className="inline-flex w-max shrink-0 items-center gap-2 rounded-full bg-spring px-6 py-3.5 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5"
            >
              {b.ctaButton}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

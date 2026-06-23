import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import type { ConcernKey } from "@/lib/ingredients";
import { ingredientSlug } from "@/lib/ingredient-pages";
import {
  CONCERN_TITLE,
  CONCERN_INTRO,
  CONCERN_SLUG,
  ingredientsForConcern,
} from "@/lib/concerns";

export function ConcernPageContent({
  lang,
  ck,
}: {
  lang: Lang;
  ck: ConcernKey;
}) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const home = localePath(lang, "/");
  const concernsHome = localePath(lang, "/concerns");
  const ings = ingredientsForConcern(ck);
  const others = (Object.keys(CONCERN_TITLE) as ConcernKey[]).filter((k) => k !== ck);

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fiomio", item: "https://fiomio.io" + (lang === "fr" ? "" : "/en") },
      { "@type": "ListItem", position: 2, name: L("Préoccupations", "Concerns"), item: "https://fiomio.io" + concernsHome },
      { "@type": "ListItem", position: 3, name: CONCERN_TITLE[ck][lang] },
    ],
  };

  return (
    <article className="bg-cream py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <nav className="font-mono text-[0.68rem] uppercase tracking-widest text-stone-2">
          <Link href={home} className="hover:text-ink">Fiomio</Link>
          {" / "}
          <Link href={concernsHome} className="hover:text-ink">{L("Préoccupations", "Concerns")}</Link>
        </nav>

        <p className="eyebrow mt-6 text-spring-deep">{L("Préoccupation", "Concern")}</p>
        <h1 className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          {CONCERN_TITLE[ck][lang]}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">{CONCERN_INTRO[ck][lang]}</p>

        {ings.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              {L("Les actifs qui aident", "The actives that help")}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {ings.map((ing) => (
                <Link
                  key={ing.id}
                  href={localePath(lang, `/ingredients/${ingredientSlug(ing)}`)}
                  className="lab-frame flex items-center justify-between gap-3 rounded-xl bg-paper p-4 transition-colors hover:border-spring-deep/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-base font-semibold text-ink">{ing.name[lang]}</span>
                    <span className="block truncate text-sm text-stone-2">{ing.tag[lang]}</span>
                  </span>
                  <span className="flex shrink-0 gap-1">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={`h-1.5 w-4 rounded-full ${n <= (ing.targets[ck] ?? 0) ? "bg-spring-deep" : "bg-line"}`} />
                    ))}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}


        <section className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-spring-deep/25 bg-spring/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {L("Que faut-il VRAIMENT pour votre peau ?", "What does YOUR skin actually need?")}
            </p>
            <p className="mt-1 text-sm text-stone">
              {L("Le diagnostic croise votre peau, votre ville et la saison.", "The diagnostic crosses your skin, your city and the season.")}
            </p>
          </div>
          <Link href={`${home}#diagnostic`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-spring-deep px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5">
            {L("Faire mon diagnostic", "Take the diagnostic")}<span aria-hidden>→</span>
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
            {L("Autres préoccupations", "Other concerns")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((k) => (
              <Link key={k} href={localePath(lang, `/concerns/${CONCERN_SLUG[k]}`)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-spring-deep hover:text-spring-deep">
                {CONCERN_TITLE[k][lang]}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

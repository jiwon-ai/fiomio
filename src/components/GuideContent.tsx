import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import { INGREDIENTS } from "@/lib/ingredients";
import { ingredientSlug } from "@/lib/ingredient-pages";
import { CONCERN_TITLE, CONCERN_SLUG } from "@/lib/concerns";
import type { ConcernKey } from "@/lib/ingredients";

const HERO_IDS = [
  "niacinamide", "hyaluronic", "centella", "retinol", "vitaminc", "ceramides",
  "snail", "salicylic", "panthenol", "propolis", "pdrn", "azelaic",
];

export function GuideContent({ lang }: { lang: Lang }) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const home = localePath(lang, "/");
  const heroes = HERO_IDS.map((id) => INGREDIENTS.find((i) => i.id === id)).filter(
    (x): x is NonNullable<typeof x> => Boolean(x),
  );
  const concerns = Object.keys(CONCERN_TITLE) as ConcernKey[];

  const faqs = [
    {
      q: L("La K-beauty, c'est quoi ?", "What is K-beauty?"),
      a: L(
        "La K-beauty (beauté coréenne) est une approche du soin centrée sur la prévention, l'hydratation par couches et des actifs doux mais efficaces (centella, mucine d'escargot, niacinamide…), plutôt que sur des solutions agressives.",
        "K-beauty (Korean beauty) is a skincare approach centred on prevention, layered hydration and gentle-but-effective actives (centella, snail mucin, niacinamide…) rather than aggressive fixes.",
      ),
    },
    {
      q: L("Une routine coréenne marche-t-elle en Europe ?", "Does a Korean routine work in Europe?"),
      a: L(
        "Pas telle quelle. Les routines sont pensées pour le climat humide de Séoul. L'eau, le chauffage et l'air sec européens changent les besoins : il faut adapter les actifs au climat de votre ville.",
        "Not as-is. Routines are designed for Seoul's humid climate. European water, heating and dry air change your needs: actives should be adapted to your city's climate.",
      ),
    },
    {
      q: L("Par quel actif commencer ?", "Which active should I start with?"),
      a: L(
        "Niacinamide et acide hyaluronique sont les plus polyvalents et les mieux tolérés. Introduisez un actif à la fois et protégez-vous du soleil le jour.",
        "Niacinamide and hyaluronic acid are the most versatile and best tolerated. Introduce one active at a time and protect from the sun during the day.",
      ),
    },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fiomio", item: "https://fiomio.io" + (lang === "fr" ? "" : "/en") },
      { "@type": "ListItem", position: 2, name: L("Guide K-beauty", "K-beauty guide") },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <article className="bg-cream py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto max-w-2xl px-6 sm:px-10">
        <nav className="font-mono text-[0.68rem] uppercase tracking-widest text-stone-2">
          <Link href={home} className="hover:text-ink">Fiomio</Link>
        </nav>
        <p className="eyebrow mt-6 text-spring-deep">{L("Guide complet", "Complete guide")}</p>
        <h1 className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          {L("Le guide K-beauty : routine, actifs et climat", "The K-beauty guide: routine, actives and climate")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">
          {L(
            "Tout ce qu'il faut comprendre pour adopter le soin coréen sans copier-coller une routine de Séoul : ce qu'est la K-beauty, les actifs clés décodés, et comment adapter le tout au climat de votre ville.",
            "Everything you need to adopt Korean skincare without copy-pasting a Seoul routine: what K-beauty is, the key actives decoded, and how to adapt it all to your city's climate.",
          )}
        </p>

        <section className="article-prose mt-10">
          <h2>{L("Qu'est-ce que la K-beauty ?", "What is K-beauty?")}</h2>
          <p>
            {L(
              "La beauté coréenne privilégie la prévention, une barrière cutanée saine et l'hydratation par couches fines, avec des actifs doux mais documentés. L'objectif n'est pas d'agresser la peau mais de la renforcer dans la durée.",
              "Korean beauty prioritises prevention, a healthy skin barrier and layered, lightweight hydration, with gentle but well-documented actives. The goal isn't to attack the skin but to strengthen it over time.",
            )}
          </p>
          <h2>{L("Pourquoi une routine de Séoul ne suffit pas en Europe", "Why a Seoul routine isn't enough in Europe")}</h2>
          <p>
            {L(
              "Les formules coréennes sont pensées pour un climat humide. À Paris ou ailleurs en Europe, l'air sec, le chauffage et l'eau calcaire changent les besoins de la peau selon la ville et la saison. C'est précisément la variable que Fiomio intègre.",
              "Korean formulas are designed for a humid climate. In Paris or elsewhere in Europe, dry air, indoor heating and hard water change the skin's needs by city and season. That's exactly the variable Fiomio factors in.",
            )}
          </p>
          <h2>{L("La routine, étape par étape", "The routine, step by step")}</h2>
          <p>
            {L(
              "Nettoyant doux, toner hydratant, essence, sérum d'actifs ciblés, crème, puis protection solaire le matin. Inutile d'empiler dix produits : trois à cinq étapes cohérentes suffisent.",
              "Gentle cleanser, hydrating toner, essence, targeted active serum, moisturizer, then sunscreen in the morning. No need to stack ten products: three to five coherent steps are enough.",
            )}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">
            {L("Les actifs essentiels, décodés", "The essential actives, decoded")}
          </h2>
          <p className="mt-2 text-sm text-stone">
            {L("Cliquez un actif pour son effet, son climat idéal et ses précautions.", "Click an active for its effect, ideal climate and cautions.")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {heroes.map((ing) => (
              <Link
                key={ing.id}
                href={localePath(lang, `/ingredients/${ingredientSlug(ing)}`)}
                className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-spring-deep hover:text-spring-deep"
              >
                {ing.name[lang]}
              </Link>
            ))}
            <Link href={localePath(lang, "/ingredients")} className="rounded-full bg-spring-deep px-3.5 py-1.5 text-sm font-medium text-cream">
              {L("Voir les 72 actifs →", "See all 72 actives →")}
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">
            {L("Par préoccupation", "By concern")}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {concerns.map((k) => (
              <Link
                key={k}
                href={localePath(lang, `/concerns/${CONCERN_SLUG[k]}`)}
                className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-spring-deep hover:text-spring-deep"
              >
                {CONCERN_TITLE[k][lang]}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-spring-deep/25 bg-spring/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {L("Quelle routine pour VOTRE peau et votre ville ?", "Which routine for YOUR skin and city?")}
            </p>
            <p className="mt-1 text-sm text-stone">
              {L("Le diagnostic gratuit croise peau, climat et saison.", "The free diagnostic crosses skin, climate and season.")}
            </p>
          </div>
          <Link href={`${home}#diagnostic`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-spring-deep px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5">
            {L("Faire mon diagnostic", "Take the diagnostic")} <span aria-hidden>→</span>
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">
            {L("Questions fréquentes", "Frequently asked questions")}
          </h2>
          <dl className="mt-5 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {faqs.map((f, i) => (
              <div key={i} className="px-5 py-4">
                <dt className="text-[0.98rem] font-medium text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}

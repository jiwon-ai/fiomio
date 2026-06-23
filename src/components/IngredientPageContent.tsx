import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import type { Ingredient } from "@/lib/ingredients";
import { INGREDIENTS } from "@/lib/ingredients";
import {
  ingredientSlug,
  CONCERN_LABEL,
  TRAIT_LABEL,
  SKIN_LABEL,
  climateFit,
} from "@/lib/ingredient-pages";
import { productsForIngredients, yesstyleSearchUrl } from "@/lib/products";
import { buildAffiliateLink } from "@/lib/affiliates";

const PREGNANCY_UNSAFE = ["retinol", "salicylic", "arbutin"];

const CONFLICT_TXT: Record<string, { fr: string; en: string }> = {
  retinoid: { fr: "rétinoïdes", en: "retinoids" },
  exfoliant: { fr: "acides exfoliants (AHA/BHA)", en: "exfoliating acids (AHA/BHA)" },
  vitc: { fr: "vitamine C", en: "vitamin C" },
};

export function IngredientPageContent({
  lang,
  ing,
}: {
  lang: Lang;
  ing: Ingredient;
}) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const home = localePath(lang, "/");
  const ingHome = localePath(lang, "/ingredients");

  const targets = Object.entries(ing.targets)
    .map(([k, v]) => ({ k: k as keyof typeof CONCERN_LABEL, v: v ?? 0 }))
    .sort((a, b) => b.v - a.v);
  const products = productsForIngredients([ing.id], 6);
  const climate = climateFit(ing, lang);

  const topConcern = targets[0]?.k;
  const related = INGREDIENTS.filter(
    (o) => o.id !== ing.id && topConcern && (o.targets[topConcern] ?? 0) >= 2,
  ).slice(0, 5);

  const conflicts = (ing.conflictsWith ?? [])
    .map((c) => CONFLICT_TXT[c])
    .filter(Boolean);
  const pregUnsafe = PREGNANCY_UNSAFE.includes(ing.id);

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fiomio", item: "https://fiomio.io" + (lang === "fr" ? "" : "/en") },
      { "@type": "ListItem", position: 2, name: L("Ingrédients", "Ingredients"), item: "https://fiomio.io" + ingHome },
      { "@type": "ListItem", position: 3, name: ing.name[lang] },
    ],
  };

  return (
    <article className="bg-cream py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <nav className="font-mono text-[0.68rem] uppercase tracking-widest text-stone-2">
          <Link href={home} className="hover:text-ink">
            Fiomio
          </Link>
          {" / "}
          <Link href={ingHome} className="hover:text-ink">
            {L("Ingrédients", "Ingredients")}
          </Link>
        </nav>

        <p className="eyebrow mt-6 text-spring-deep">
          {ing.traits.map((t) => TRAIT_LABEL[t][lang]).slice(0, 3).join(" · ")}
        </p>
        <h1
          className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {ing.name[lang]}
        </h1>
        <p className="mt-2 text-lg text-stone-2">{ing.tag[lang]}</p>

        <p className="mt-6 text-lg leading-relaxed text-ink/85">{ing.why[lang]}</p>

        {/* targets */}
        {targets.length > 0 && (
          <section className="mt-10">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
              {L("Ce que cet actif cible", "What this active targets")}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {targets.map(({ k, v }) => (
                <li key={k} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 text-sm font-medium text-ink">
                    {CONCERN_LABEL[k][lang]}
                  </span>
                  <span className="flex flex-1 gap-1">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`h-2 flex-1 rounded-full ${
                          n <= v ? "bg-spring-deep" : "bg-line"
                        }`}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <section>
            <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
              {L("Convient à", "Best for")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ing.loves.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-spring/12 px-3 py-1 text-sm font-medium text-moss"
                >
                  {L("Peau", "")} {SKIN_LABEL[s][lang]}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
              {L("Climat idéal", "Best climate")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {climate.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-white px-3 py-1 text-sm text-stone"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
            {L("Comment l'utiliser", "How to use it")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink/80">
            {ing.howToUse[lang]}
          </p>
        </section>

        {(conflicts.length > 0 || pregUnsafe || ing.strong) && (
          <section className="mt-8 rounded-xl border border-spring-deep/25 bg-spring/8 p-5">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-spring-deep">
              {L("Précautions", "Cautions")}
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-ink/85">
              {conflicts.length > 0 && (
                <li>
                  {L("Ne pas cumuler le même soir avec : ", "Don't stack on the same night with: ")}
                  {conflicts.map((c) => c[lang]).join(", ")}.
                </li>
              )}
              {ing.strong && (
                <li>
                  {L(
                    "Actif puissant : introduisez-le progressivement, un soir sur deux, et faites un test de tolérance.",
                    "Potent active: introduce gradually, every other night, and patch-test first.",
                  )}
                </li>
              )}
              {pregUnsafe && (
                <li>
                  {L(
                    "À éviter pendant la grossesse ou un projet de grossesse, par précaution.",
                    "Best avoided during pregnancy or when trying to conceive, as a precaution.",
                  )}
                </li>
              )}
            </ul>
          </section>
        )}

        {/* products */}
        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              {L("Produits avec cet actif", "Products with this active")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {products.map((p) => (
                <a
                  key={p.id}
                  href={buildAffiliateLink(p.url ?? yesstyleSearchUrl(p.searchQ))}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="lab-frame flex flex-col rounded-xl bg-paper p-5 transition-colors hover:border-spring-deep/40"
                >
                  <span className="font-mono text-[0.62rem] uppercase tracking-widest text-stone-2">
                    {p.brand}
                  </span>
                  <span className="font-display mt-1 text-base font-semibold leading-snug text-ink">
                    {p.name}
                  </span>
                  <span className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-ink/75">
                    {p.blurb[lang]}
                  </span>
                  <span className="mt-3 text-sm font-medium text-spring-deep">
                    {L("Voir le produit", "See the product")} →
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-3 font-mono text-[0.66rem] text-stone-2">
              {L(
                "Liens affiliés signalés : une commission possible, sans surcoût.",
                "Affiliate links disclosed: a possible commission, at no extra cost.",
              )}
            </p>
          </section>
        )}

        {/* CTA */}
        <section className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-spring-deep/25 bg-spring/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {L(
                `Cet actif est-il fait pour VOTRE peau ?`,
                `Is this active right for YOUR skin?`,
              )}
            </p>
            <p className="mt-1 text-sm text-stone">
              {L(
                "Le diagnostic croise votre peau, votre ville et la saison.",
                "The diagnostic crosses your skin, your city and the season.",
              )}
            </p>
          </div>
          <Link
            href={`${home}#diagnostic`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-spring-deep px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
          >
            {L("Faire mon diagnostic", "Take the diagnostic")}
            <span aria-hidden>→</span>
          </Link>
        </section>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
              {L("Actifs liés", "Related actives")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((o) => (
                <Link
                  key={o.id}
                  href={localePath(lang, `/ingredients/${ingredientSlug(o)}`)}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-spring-deep hover:text-spring-deep"
                >
                  {o.name[lang]}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

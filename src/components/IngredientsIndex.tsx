import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import { allIngredientsSorted, ingredientSlug, TRAIT_LABEL } from "@/lib/ingredient-pages";
import type { ConcernKey } from "@/lib/ingredients";
import { CONCERN_TITLE, CONCERN_SLUG } from "@/lib/concerns";

export function IngredientsIndex({ lang }: { lang: Lang }) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const items = allIngredientsSorted();
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <p className="eyebrow text-spring-deep">
          {L("Encyclopédie des actifs", "Active-ingredient encyclopaedia")}
        </p>
        <h1
          className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {L(
            "Les actifs K-beauty, décodés pour votre peau et votre climat.",
            "K-beauty actives, decoded for your skin and your climate.",
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
          {L(
            "Ce que fait chaque actif, à qui il convient, dans quel climat, et avec quoi ne pas le mélanger. Pas une liste : une lecture utile.",
            "What each active does, who it suits, in which climate, and what not to mix it with. Not a list: a useful read.",
          )}
        </p>

        <div className="mt-8">
          <p className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
            {L("Parcourir par préoccupation", "Browse by concern")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(CONCERN_TITLE) as ConcernKey[]).map((k) => (
              <Link key={k} href={localePath(lang, `/concerns/${CONCERN_SLUG[k]}`)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-spring-deep hover:text-spring-deep">
                {CONCERN_TITLE[k][lang]}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {items.map((ing) => (
            <Link
              key={ing.id}
              href={localePath(lang, `/ingredients/${ingredientSlug(ing)}`)}
              className="lab-frame flex flex-col rounded-xl bg-paper p-5 transition-colors hover:border-spring-deep/40"
            >
              <span className="font-display text-lg font-semibold leading-snug text-ink">
                {ing.name[lang]}
              </span>
              <span className="mt-0.5 text-sm text-stone-2">{ing.tag[lang]}</span>
              <span className="mt-3 text-[0.72rem] font-medium uppercase tracking-wide text-spring-deep">
                {ing.traits.map((t) => TRAIT_LABEL[t][lang]).slice(0, 3).join(" · ")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

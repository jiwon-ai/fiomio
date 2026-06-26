/* ============================================================
   FIOMIO — programmatic SEO helpers for /ingredients/[slug]
   Turns the curated actives DB into one indexable page per
   ingredient: stable slugs, bilingual labels, and a climate-fit
   derivation that ties each active to the conditions it serves.
   ============================================================ */

import {
  INGREDIENTS,
  type Ingredient,
  type ConcernKey,
  type TraitKey,
} from "./ingredients";

function baseSlug(ing: Ingredient): string {
  return ing.name.en
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const idToSlug = new Map<string, string>();
const slugToIng = new Map<string, Ingredient>();
for (const ing of INGREDIENTS) {
  let s = baseSlug(ing) || ing.id;
  while (slugToIng.has(s)) s = `${s}-${ing.id}`;
  idToSlug.set(ing.id, s);
  slugToIng.set(s, ing);
}

export function ingredientSlug(ing: Ingredient): string {
  return idToSlug.get(ing.id) ?? ing.id;
}
export function allIngredientSlugs(): string[] {
  return Array.from(slugToIng.keys());
}
export function ingredientBySlug(slug: string): Ingredient | undefined {
  return slugToIng.get(slug);
}
export function allIngredientsSorted(): Ingredient[] {
  return [...INGREDIENTS].sort((a, b) => a.name.en.localeCompare(b.name.en));
}

export const CONCERN_LABEL: Record<ConcernKey, { fr: string; en: string }> = {
  redness: { fr: "Rougeurs", en: "Redness" },
  dehydration: { fr: "Déshydratation", en: "Dehydration" },
  dullness: { fr: "Éclat", en: "Radiance" },
  aging: { fr: "Anti-âge", en: "Anti-aging" },
  acne: { fr: "Imperfections", en: "Breakouts" },
  pores: { fr: "Pores", en: "Pores" },
  barrier: { fr: "Barrière", en: "Barrier" },
  pigmentation: { fr: "Taches", en: "Dark spots" },
  sunspots: { fr: "Taches solaires", en: "Sun spots" },
  hormonalredness: { fr: "Rougeurs hormonales", en: "Hormonal redness" },
  flaking: { fr: "Desquamation", en: "Flaking" },
  darkcircles: { fr: "Cernes", en: "Dark circles" },
  postacne: { fr: "Marques post-acné", en: "Post-acne marks" },
  oiliness: { fr: "Excès de sébum", en: "Excess oil" },
};

export const TRAIT_LABEL: Record<TraitKey, { fr: string; en: string }> = {
  hydrating: { fr: "Hydratant", en: "Hydrating" },
  barrier: { fr: "Réparateur barrière", en: "Barrier repair" },
  antioxidant: { fr: "Antioxydant", en: "Antioxidant" },
  soothing: { fr: "Apaisant", en: "Soothing" },
  oilControl: { fr: "Séborégulateur", en: "Oil control" },
  exfoliating: { fr: "Exfoliant", en: "Exfoliating" },
  brightening: { fr: "Éclaircissant", en: "Brightening" },
  firming: { fr: "Raffermissant", en: "Firming" },
  occlusive: { fr: "Occlusif", en: "Occlusive" },
};

export const SKIN_LABEL: Record<string, { fr: string; en: string }> = {
  dry: { fr: "Sèche", en: "Dry" },
  combination: { fr: "Mixte", en: "Combination" },
  oily: { fr: "Grasse", en: "Oily" },
  normal: { fr: "Normale", en: "Normal" },
};

/** Map an active's traits → the climate conditions it serves best. */
export function climateFit(ing: Ingredient, lang: "fr" | "en"): string[] {
  const t = new Set(ing.traits);
  const out: string[] = [];
  const add = (fr: string, en: string) => {
    const v = lang === "fr" ? fr : en;
    if (!out.includes(v)) out.push(v);
  };
  if (t.has("hydrating") || t.has("barrier") || t.has("occlusive"))
    add("Air sec, hiver, chauffage", "Dry air, winter, indoor heating");
  if (t.has("antioxidant") || t.has("brightening") || t.has("firming"))
    add("UV élevés, pollution", "High UV, pollution");
  if (t.has("oilControl") || t.has("exfoliating"))
    add("Chaleur humide, été", "Humid heat, summer");
  if (t.has("soothing"))
    add("Froid, vent, environnement urbain", "Cold, wind, urban environments");
  if (!out.length) add("Toutes saisons", "All seasons");
  return out;
}

export const PREGNANCY_UNSAFE = ["retinol", "salicylic", "arbutin"];

export const CONFLICT_TXT: Record<string, { fr: string; en: string }> = {
  retinoid: { fr: "rétinoïdes", en: "retinoids" },
  exfoliant: { fr: "acides exfoliants (AHA/BHA)", en: "exfoliating acids (AHA/BHA)" },
  vitc: { fr: "vitamine C", en: "vitamin C" },
};

/** Per-ingredient FAQ, generated from the active's own data (specific, not
 *  generic) so each page is eligible for FAQ rich results. */
export function ingredientFaqs(
  ing: Ingredient,
  lang: "fr" | "en",
): { q: string; a: string }[] {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const name = ing.name[lang];
  const concerns = Object.entries(ing.targets)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .map(([k]) => CONCERN_LABEL[k as ConcernKey][lang]);
  const skins = ing.loves.map((sk) => SKIN_LABEL[sk][lang].toLowerCase()).join(", ");
  const conflicts = (ing.conflictsWith ?? [])
    .map((c) => CONFLICT_TXT[c]?.[lang])
    .filter(Boolean) as string[];

  const faqs: { q: string; a: string }[] = [];
  faqs.push({ q: L(`À quoi sert ${name} ?`, `What does ${name} do?`), a: ing.why[lang] });
  if (concerns.length)
    faqs.push({
      q: L(`${name} aide pour quoi ?`, `What does ${name} help with?`),
      a: L(
        `Principalement : ${concerns.slice(0, 3).join(", ")}. Convient surtout aux peaux ${skins}.`,
        `Mainly: ${concerns.slice(0, 3).join(", ")}. Best for ${skins} skin.`,
      ),
    });
  faqs.push({
    q: L(`Quand et comment utiliser ${name} ?`, `When and how to use ${name}?`),
    a: ing.howToUse[lang],
  });
  faqs.push({
    q: L(`Peut-on associer ${name} à d'autres actifs ?`, `Can I combine ${name} with other actives?`),
    a: conflicts.length
      ? L(
          `Évitez de le cumuler le même soir avec : ${conflicts.join(", ")}. Introduisez un actif à la fois.`,
          `Avoid stacking it on the same night with: ${conflicts.join(", ")}. Introduce one active at a time.`,
        )
      : L(
          "Il se marie bien avec la plupart des actifs. Introduisez tout de même un nouvel actif à la fois.",
          "It pairs well with most actives. Still, introduce one new active at a time.",
        ),
  });
  if (PREGNANCY_UNSAFE.includes(ing.id))
    faqs.push({
      q: L(`${name} est-il sûr pendant la grossesse ?`, `Is ${name} safe during pregnancy?`),
      a: L(
        "Par précaution, il vaut mieux l'éviter pendant la grossesse ou un projet de grossesse. Demandez conseil à votre médecin.",
        "As a precaution, it's best avoided during pregnancy or when trying to conceive. Ask your doctor.",
      ),
    });
  return faqs;
}

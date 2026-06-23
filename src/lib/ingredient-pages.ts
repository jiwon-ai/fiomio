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

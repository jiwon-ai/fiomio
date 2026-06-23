/* ============================================================
   FIOMIO — recommendation engine (demo)
   Crosses skin profile × the Paris forecast for the delivery
   window × actives in use to rank ingredients and produce an
   *explainable* output: matched reasons, cautions, routine logic.
   A transparent rule/scoring model — a preview of the contextual
   layer the full product will deepen.
   ============================================================ */

import {
  INGREDIENTS,
  type Ingredient,
  type ConcernKey,
  type ActiveUse,
} from "./ingredients";
import type { ClimateContext } from "./climate";

export type SkinType = "dry" | "combination" | "oily" | "normal";
export type AgeRange = "u25" | "a25_34" | "a35_44" | "a45p";
export type Gender = "female" | "male" | "other";
export type Pregnancy = "none" | "pregnant" | "trying";

/** Actives commonly advised against during pregnancy / conception. */
const PREGNANCY_UNSAFE = ["retinol", "salicylic", "arbutin"];

export type DiagnosticInput = {
  skinType: SkinType;
  sensitive: boolean;
  concerns: ConcernKey[];
  activeUse: ActiveUse;
  gender: Gender;
  pregnancy: Pregnancy;
  /** ingredient ids the user has chosen to avoid (from their product log) */
  avoidIds?: string[];
};

/** INCI aliases for actives whose label differs from their INCI name, used to
 *  map a user's "avoid" tokens (from the product scanner) onto our actives. */
const INCI_ALIASES: Record<string, string[]> = {
  ceramides: ["ceramide"],
  hyaluronic: ["hyaluronic acid", "sodium hyaluronate"],
  centella: ["centella asiatica", "cica"],
  madecassoside: ["madecassoside"],
  panthenol: ["panthenol"],
  squalane: ["squalane"],
  snail: ["snail secretion filtrate", "snail mucin"],
  vitaminc: ["ascorbic acid", "ascorbyl glucoside", "ethyl ascorbic acid", "ascorbyl phosphate", "vitamin c"],
  azelaic: ["azelaic acid", "azeloyl"],
  salicylic: ["salicylic acid", "bha"],
  retinol: ["retinol", "retinal", "retinaldehyde"],
  peptides: ["peptide", "palmitoyl"],
  allantoin: ["allantoin"],
  betaglucan: ["beta-glucan", "beta glucan"],
  mugwort: ["artemisia", "mugwort"],
  heartleaf: ["houttuynia cordata", "heartleaf"],
  greentea: ["camellia sinensis", "green tea", "egcg"],
  galactomyces: ["galactomyces"],
  propolis: ["propolis"],
  bakuchiol: ["bakuchiol"],
  tranexamic: ["tranexamic acid"],
  arbutin: ["arbutin"],
  mandelic: ["mandelic acid"],
  glycolic: ["glycolic acid"],
  lactic: ["lactic acid"],
  pha: ["gluconolactone", "pha"],
  niacinamide: ["niacinamide"],
  adenosine: ["adenosine"],
  tocopherol: ["tocopherol", "tocopheryl acetate", "vitamin e"],
  ferulic: ["ferulic acid"],
  licorice: ["glycyrrhiza", "licorice", "glabridin", "dipotassium glycyrrhizate"],
  zincpca: ["zinc pca"],
  polyglutamic: ["polyglutamic acid", "sodium polyglutamate"],
  ginseng: ["panax ginseng", "ginseng"],
  rice: ["oryza sativa", "rice extract", "rice ferment"],
  ectoin: ["ectoin", "ectoine"],
  urea: ["urea"],
  resveratrol: ["resveratrol"],
  q10: ["ubiquinone", "coenzyme q10"],
  lactobionic: ["lactobionic acid"],
  kojic: ["kojic acid", "kojic dipalmitate"],
  caffeine: ["caffeine"],
  sheabutter: ["butyrospermum parkii", "shea butter"],
};

/** Map normalized avoid tokens (INCI) → our ingredient ids. */
export function avoidedIngredientIds(avoidTokens: string[]): string[] {
  const toks = avoidTokens
    .map((t) => t.toLowerCase().trim())
    .filter((t) => t.length > 2);
  if (!toks.length) return [];
  const ids: string[] = [];
  for (const ing of INGREDIENTS) {
    const hay = [ing.name.en.toLowerCase(), ...(INCI_ALIASES[ing.id] || [])];
    const hit = toks.some((tok) =>
      hay.some((h) => h === tok || tok.includes(h) || h.includes(tok)),
    );
    if (hit) ids.push(ing.id);
  }
  return ids;
}

export type Bi = { fr: string; en: string };

export type Recommendation = {
  ingredient: Ingredient;
  score: number;
  matched: { fr: string[]; en: string[] };
};

export type DiagnosticResult = {
  climate: ClimateContext;
  recommendations: Recommendation[];
  cautions: Bi[];
  routine: Bi;
};

const CONCERN_LABELS: Record<ConcernKey, Bi> = {
  redness: { fr: "Rougeurs", en: "Redness" },
  dehydration: { fr: "Déshydratation", en: "Dehydration" },
  dullness: { fr: "Éclat", en: "Glow" },
  aging: { fr: "Anti-âge", en: "Anti-aging" },
  acne: { fr: "Imperfections", en: "Breakouts" },
  pores: { fr: "Pores", en: "Pores" },
  barrier: { fr: "Barrière", en: "Barrier" },
  pigmentation: { fr: "Taches", en: "Dark spots" },
};

function scoreIngredient(
  ing: Ingredient,
  input: DiagnosticInput,
  climate: ClimateContext,
): { score: number; matched: { fr: string[]; en: string[] } } {
  let score = 0;
  const matchedFr: string[] = [];
  const matchedEn: string[] = [];

  // 1. Concern fit — earlier-selected concerns weigh more.
  const weights = [1, 0.78, 0.62];
  input.concerns.forEach((c, i) => {
    const t = ing.targets[c] ?? 0;
    if (t > 0) {
      score += t * (weights[i] ?? 0.5);
      if (t >= 2) {
        matchedFr.push(CONCERN_LABELS[c].fr);
        matchedEn.push(CONCERN_LABELS[c].en);
      }
    }
    // climate amplifies concerns that matter for the delivery window
    const cb = climate.boostConcerns[c] ?? 0;
    if (cb > 0 && t > 0) score += cb * 0.4;
  });

  // 2. Climate trait bias (forecast for the delivery week)
  let climateTraitHit = false;
  for (const trait of ing.traits) {
    const b = climate.boostTraits[trait] ?? 0;
    if (b > 0) {
      score += b * 0.6;
      climateTraitHit = true;
    }
    if (climate.demoteTraits.includes(trait)) score -= 1.2;
  }
  if (climateTraitHit) {
    matchedFr.push(climate.chip.fr);
    matchedEn.push(climate.chip.en);
  }

  // 3. Skin-type affinity
  if (ing.loves.includes(input.skinType)) score += 0.8;

  // 4. Sensitivity — bias toward gentle, penalize potent
  if (input.sensitive) {
    score += (ing.gentleness - 1.5) * 0.7;
    if (ing.strong) score -= 1.6;
  }

  // 5. Actives already in use — conflicts & synergies
  if (input.activeUse !== "none") {
    if (ing.conflictsWith?.includes(input.activeUse)) score -= 3.2;
    if (
      (input.activeUse === "retinoid" || input.activeUse === "exfoliant") &&
      (ing.traits.includes("barrier") || ing.traits.includes("soothing"))
    ) {
      score += 1.3;
      if (input.activeUse === "retinoid" && !matchedFr.includes("Compense le rétinol")) {
        matchedFr.push("Compense le rétinol");
        matchedEn.push("Buffers retinol");
      }
    }
  }

  return {
    score,
    matched: {
      fr: Array.from(new Set(matchedFr)).slice(0, 3),
      en: Array.from(new Set(matchedEn)).slice(0, 3),
    },
  };
}

function buildCautions(
  input: DiagnosticInput,
  recs: Recommendation[],
  climate: ClimateContext,
): Bi[] {
  const out: Bi[] = [];

  if (input.pregnancy !== "none") {
    out.push({
      fr: "Grossesse ou projet de grossesse : par précaution, on écarte les rétinoïdes, l'acide salicylique et l'arbutine. Validez toujours votre routine avec votre médecin ou sage-femme.",
      en: "Pregnant or trying to conceive: as a precaution, we leave out retinoids, salicylic acid and arbutin. Always confirm your routine with your doctor or midwife.",
    });
  }

  if (input.activeUse === "retinoid") {
    out.push({
      fr: "Vous utilisez déjà du rétinol : ne l'empilez pas avec un acide fort le même soir, et encadrez-le toujours d'hydratation.",
      en: "You already use retinol: don't stack it with a strong acid on the same night, and always buffer it with hydration.",
    });
  }
  if (input.activeUse === "exfoliant") {
    out.push({
      fr: "Vous exfoliez déjà : évitez de cumuler AHA/BHA et rétinol, et espacez les actifs pour préserver la barrière.",
      en: "You already exfoliate: avoid combining AHA/BHA with retinol, and space out actives to protect the barrier.",
    });
  }
  if (input.activeUse === "vitc") {
    out.push({
      fr: "Vitamine C le matin : ne la superposez pas à un exfoliant acide au même moment.",
      en: "Vitamin C in the morning: don't layer it with an acid exfoliant at the same time.",
    });
  }
  if (input.sensitive) {
    out.push({
      fr: "Peau réactive : introduisez chaque nouvel actif un soir sur deux et faites un test de tolérance au pli du coude.",
      en: "Reactive skin: introduce each new active every other night and patch-test on your inner arm first.",
    });
  }

  const uv = climate.metrics?.uv ?? 0;
  const needsSpf =
    uv >= 4 ||
    input.activeUse !== "none" ||
    recs.some((r) => r.ingredient.traits.includes("firming") || r.ingredient.id === "vitaminc");
  if (needsSpf) {
    out.push({
      fr: "Protection solaire SPF 50 chaque matin, indispensable avec un actif renouvelant ou éclaircissant, et dès qu'il y a du soleil.",
      en: "SPF 50 every morning, essential with any renewing or brightening active, and whenever the sun is out.",
    });
  }

  return out.slice(0, 3);
}

function buildRoutine(recs: Recommendation[], climate: ClimateContext): Bi {
  const am = recs
    .filter((r) => r.ingredient.timing !== "PM")
    .map((r) => r.ingredient.name);
  const pm = recs
    .filter((r) => r.ingredient.timing !== "AM")
    .map((r) => r.ingredient.name);

  const list = (arr: { fr: string; en: string }[], lang: "fr" | "en") =>
    arr.map((n) => n[lang]).join(" · ") ||
    (lang === "fr" ? "hydratation simple" : "simple hydration");

  const cityFr = climate.city || "votre ville";
  const cityEn = climate.city || "your city";
  return {
    fr: `Contexte : ${climate.fr.label.toLowerCase()} à ${cityFr} au moment de la réception. Le matin, antioxydant et hydratation puis SPF : ${list(am, "fr")}. Le soir, réparation et actifs ciblés : ${list(pm, "fr")}. On introduit un actif à la fois et on laisse la barrière dicter le rythme.`,
    en: `Context: ${climate.en.label.toLowerCase()} in ${cityEn} by the time it arrives. In the morning, antioxidant and hydration then SPF: ${list(am, "en")}. At night, repair and targeted actives: ${list(pm, "en")}. Introduce one active at a time and let the barrier set the pace.`,
  };
}

export function runDiagnostic(
  input: DiagnosticInput,
  climate: ClimateContext,
): DiagnosticResult {
  // Pregnancy / conception + the user's personal avoid list: drop before ranking.
  const avoid = new Set(input.avoidIds ?? []);
  const pool = INGREDIENTS.filter(
    (ing) =>
      (input.pregnancy === "none" || !PREGNANCY_UNSAFE.includes(ing.id)) &&
      !avoid.has(ing.id),
  );
  const ranked = pool.map((ing) => {
    const { score, matched } = scoreIngredient(ing, input, climate);
    return { ingredient: ing, score, matched };
  }).sort((a, b) => b.score - a.score);

  // Top 3 with a light diversity guard: at most one "exfoliating" pick.
  const recommendations: Recommendation[] = [];
  let exfoliantPicked = false;
  for (const r of ranked) {
    if (recommendations.length >= 3) break;
    const isExfo = r.ingredient.traits.includes("exfoliating");
    if (isExfo && exfoliantPicked) continue;
    if (r.score <= 0) continue;
    if (isExfo) exfoliantPicked = true;
    recommendations.push(r);
  }
  if (recommendations.length < 3) {
    for (const r of ranked) {
      if (recommendations.length >= 3) break;
      if (!recommendations.includes(r)) recommendations.push(r);
    }
  }

  const cautions = buildCautions(input, recommendations, climate);
  if (avoid.size) {
    const names = INGREDIENTS.filter((ing) => avoid.has(ing.id)).map(
      (ing) => ing.name,
    );
    if (names.length) {
      cautions.unshift({
        fr: `D'après vos produits, on écarte : ${names.map((n) => n.fr).join(", ")}. Réintroduisez-les un par un si vous le souhaitez.`,
        en: `Based on your products, we leave out: ${names.map((n) => n.en).join(", ")}. Reintroduce them one at a time if you wish.`,
      });
    }
  }

  return {
    climate,
    recommendations,
    cautions: cautions.slice(0, 4),
    routine: buildRoutine(recommendations, climate),
  };
}

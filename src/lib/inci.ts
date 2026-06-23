/* ============================================================
   FIOMIO — personal ingredient-elimination engine
   Users log products they've used as 👍 / 👎. We surface the
   ingredients statistically associated with their BAD experiences
   using LIFT (not raw frequency, so "water/glycerin" never win)
   plus a weighting for documented irritants / allergens, so the
   signal is credible even with a small number of logged products.
   Output = "ingredients to watch & avoid", never a medical claim.
   ============================================================ */

export type Verdict = "good" | "bad";

export type LoggedProduct = {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  inci: string[]; // normalized INCI tokens
  verdict: Verdict;
  at?: string;
};

/** lowercase, strip accents & parentheticals, keep a clean token */
export function normalizeInci(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\*|™|®/g, " ")
    .replace(/[^a-z0-9 \-/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** split a raw INCI list (comma / bullet / newline separated) into tokens */
export function parseInciList(text: string): string[] {
  const out = text
    .split(/[,;•\n•·]+/)
    .map((t) => normalizeInci(t))
    .filter((t) => t.length > 1 && t.length < 60)
    .filter((t) => !/^ingredients?$/.test(t) && !/^inci$/.test(t));
  return Array.from(new Set(out));
}

/** ubiquitous bases that should never be flagged as a personal trigger */
const STOPLIST = new Set([
  "water",
  "aqua",
  "eau",
  "glycerin",
  "glycerine",
  "aqua/water/eau",
]);

/** Documented irritants / common contact allergens (26 EU fragrance allergens,
 *  isothiazolinone preservatives, drying alcohols, SLS, frequent essential oils).
 *  weight 1–3 = how strongly to treat as a suspect when it appears in a 👎 log. */
export const KNOWN_IRRITANTS: Record<
  string,
  { fr: string; en: string; weight: number }
> = {
  parfum: { fr: "Parfum", en: "Fragrance", weight: 3 },
  fragrance: { fr: "Parfum", en: "Fragrance", weight: 3 },
  "fragrance/parfum": { fr: "Parfum", en: "Fragrance", weight: 3 },
  methylisothiazolinone: { fr: "Méthylisothiazolinone", en: "Methylisothiazolinone", weight: 3 },
  methylchloroisothiazolinone: { fr: "Méthylchloroisothiazolinone", en: "Methylchloroisothiazolinone", weight: 3 },
  "alcohol denat": { fr: "Alcool dénaturé", en: "Denatured alcohol", weight: 2 },
  "alcohol denat.": { fr: "Alcool dénaturé", en: "Denatured alcohol", weight: 2 },
  "sd alcohol": { fr: "Alcool (SD)", en: "SD alcohol", weight: 2 },
  "sodium lauryl sulfate": { fr: "Sodium Lauryl Sulfate", en: "Sodium Lauryl Sulfate", weight: 2 },
  "sodium laureth sulfate": { fr: "Sodium Laureth Sulfate", en: "Sodium Laureth Sulfate", weight: 1 },
  limonene: { fr: "Limonène", en: "Limonene", weight: 2 },
  linalool: { fr: "Linalol", en: "Linalool", weight: 2 },
  citronellol: { fr: "Citronellol", en: "Citronellol", weight: 2 },
  geraniol: { fr: "Géraniol", en: "Geraniol", weight: 2 },
  citral: { fr: "Citral", en: "Citral", weight: 2 },
  eugenol: { fr: "Eugénol", en: "Eugenol", weight: 2 },
  coumarin: { fr: "Coumarine", en: "Coumarin", weight: 2 },
  "benzyl alcohol": { fr: "Alcool benzylique", en: "Benzyl alcohol", weight: 1 },
  "benzyl salicylate": { fr: "Salicylate de benzyle", en: "Benzyl salicylate", weight: 2 },
  "benzyl benzoate": { fr: "Benzoate de benzyle", en: "Benzyl benzoate", weight: 2 },
  "cinnamyl alcohol": { fr: "Alcool cinnamylique", en: "Cinnamyl alcohol", weight: 2 },
  "cinnamal": { fr: "Cinnamal", en: "Cinnamal", weight: 2 },
  "hydroxycitronellal": { fr: "Hydroxycitronellal", en: "Hydroxycitronellal", weight: 2 },
  "isoeugenol": { fr: "Isoeugénol", en: "Isoeugenol", weight: 2 },
  farnesol: { fr: "Farnésol", en: "Farnesol", weight: 2 },
  "menthol": { fr: "Menthol", en: "Menthol", weight: 2 },
  "menthyl lactate": { fr: "Lactate de menthyle", en: "Menthyl lactate", weight: 1 },
  "melaleuca alternifolia leaf oil": { fr: "Huile d'arbre à thé", en: "Tea tree oil", weight: 2 },
  "eucalyptus globulus leaf oil": { fr: "Huile d'eucalyptus", en: "Eucalyptus oil", weight: 2 },
  "lavandula angustifolia oil": { fr: "Huile de lavande", en: "Lavender oil", weight: 2 },
  "citrus limon peel oil": { fr: "Huile de citron", en: "Lemon peel oil", weight: 2 },
};

export type Suspect = {
  inci: string;
  label: string;
  badCount: number;
  goodCount: number;
  totalBad: number;
  totalGood: number;
  score: number;
  knownIrritant: boolean;
};

function titleCase(s: string): string {
  return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

/** Surface the most likely personal trigger ingredients from logged products. */
export function analyzeSuspects(
  products: LoggedProduct[],
  lang: "fr" | "en",
): Suspect[] {
  const bad = products.filter((p) => p.verdict === "bad");
  const good = products.filter((p) => p.verdict === "good");
  const totalBad = bad.length;
  const totalGood = good.length;
  if (totalBad === 0) return [];

  const badCount = new Map<string, number>();
  const goodCount = new Map<string, number>();
  for (const p of bad)
    for (const ing of Array.from(new Set(p.inci)))
      if (!STOPLIST.has(ing)) badCount.set(ing, (badCount.get(ing) || 0) + 1);
  for (const p of good)
    for (const ing of Array.from(new Set(p.inci)))
      if (!STOPLIST.has(ing)) goodCount.set(ing, (goodCount.get(ing) || 0) + 1);

  const suspects: Suspect[] = [];
  for (const [ing, bc] of Array.from(badCount.entries())) {
    const gc = goodCount.get(ing) || 0;
    const irr = KNOWN_IRRITANTS[ing];
    // signal gate: appears in ≥2 bad products, OR is a documented irritant
    if (bc < 2 && !irr) continue;

    const badRate = bc / totalBad;
    const goodRate = totalGood ? gc / totalGood : 0;
    const lift = (badRate + 0.05) / (goodRate + 0.05);
    // not a trigger if it's just as common in the good set (unless documented)
    if (lift < 1.3 && !irr) continue;

    const irritantBoost = irr ? irr.weight : 0;
    const score = badRate * lift + irritantBoost * 0.6;
    suspects.push({
      inci: ing,
      label: irr ? irr[lang] : titleCase(ing),
      badCount: bc,
      goodCount: gc,
      totalBad,
      totalGood,
      score,
      knownIrritant: !!irr,
    });
  }

  suspects.sort((a, b) => b.score - a.score);
  return suspects.slice(0, 6);
}

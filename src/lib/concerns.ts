/* ============================================================
   FIOMIO — concern hub pages (/concerns/[slug]). Each skin
   concern becomes an indexable landing page that lists the
   actives that serve it and the products that contain them.
   ============================================================ */

import { INGREDIENTS, type ConcernKey, type Ingredient } from "./ingredients";

export const CONCERN_SLUG: Record<ConcernKey, string> = {
  redness: "redness",
  dehydration: "dehydration",
  dullness: "radiance",
  aging: "anti-aging",
  acne: "acne",
  pores: "pores",
  barrier: "barrier",
  pigmentation: "dark-spots",
  sunspots: "sun-spots",
  hormonalredness: "hormonal-redness",
  flaking: "flaking",
  darkcircles: "dark-circles",
  postacne: "post-acne-marks",
  oiliness: "oily-skin",
};

const SLUG_TO_KEY: Record<string, ConcernKey> = Object.fromEntries(
  Object.entries(CONCERN_SLUG).map(([k, v]) => [v, k as ConcernKey]),
) as Record<string, ConcernKey>;

export function allConcernSlugs(): string[] {
  return Object.values(CONCERN_SLUG);
}
export function concernKeyBySlug(slug: string): ConcernKey | undefined {
  return SLUG_TO_KEY[slug];
}
export function concernSlug(key: ConcernKey): string {
  return CONCERN_SLUG[key];
}

export const CONCERN_TITLE: Record<ConcernKey, { fr: string; en: string }> = {
  redness: { fr: "Rougeurs et peau réactive", en: "Redness and reactive skin" },
  dehydration: { fr: "Déshydratation", en: "Dehydration" },
  dullness: { fr: "Manque d'éclat", en: "Dullness and radiance" },
  aging: { fr: "Anti-âge et fermeté", en: "Anti-aging and firmness" },
  acne: { fr: "Imperfections et boutons", en: "Breakouts and blemishes" },
  pores: { fr: "Pores dilatés", en: "Enlarged pores" },
  barrier: { fr: "Barrière abîmée", en: "Damaged skin barrier" },
  pigmentation: { fr: "Taches et hyperpigmentation", en: "Dark spots and pigmentation" },
  sunspots: { fr: "Taches solaires et lentigos", en: "Sun spots and freckles" },
  hormonalredness: { fr: "Rougeurs hormonales et persistantes", en: "Hormonal and persistent redness" },
  flaking: { fr: "Sécheresse et desquamation", en: "Dryness and flaking" },
  darkcircles: { fr: "Cernes et poches", en: "Dark circles and puffiness" },
  postacne: { fr: "Marques post-acné", en: "Post-acne marks" },
  oiliness: { fr: "Excès de sébum et brillance", en: "Excess oil and shine" },
};

export const CONCERN_INTRO: Record<ConcernKey, { fr: string; en: string }> = {
  redness: {
    fr: "Rougeurs, tiraillements, réactivité : les actifs K-beauty apaisants qui calment la peau et renforcent sa tolérance, sans l'agresser.",
    en: "Redness, tightness, reactivity: the soothing K-beauty actives that calm skin and build its tolerance, without aggression.",
  },
  dehydration: {
    fr: "Peau qui tiraille et manque d'eau : les humectants et réparateurs de barrière qui retiennent l'hydratation, adaptés à votre climat.",
    en: "Skin that feels tight and lacks water: the humectants and barrier-repair actives that hold hydration in, tuned to your climate.",
  },
  dullness: {
    fr: "Teint terne et fatigué : les antioxydants et éclaircissants K-beauty qui ravivent l'éclat et unifient la peau.",
    en: "A dull, tired complexion: the K-beauty antioxidants and brighteners that revive radiance and even the skin.",
  },
  aging: {
    fr: "Ridules, perte de fermeté : les actifs anti-âge (rétinoïdes, peptides, antioxydants) qui lissent et raffermissent.",
    en: "Fine lines, loss of firmness: the anti-aging actives (retinoids, peptides, antioxidants) that smooth and firm.",
  },
  acne: {
    fr: "Boutons et imperfections : les actifs séborégulateurs et exfoliants doux qui désincrustent sans décaper la barrière.",
    en: "Breakouts and blemishes: the oil-balancing actives and gentle exfoliants that clear skin without stripping the barrier.",
  },
  pores: {
    fr: "Pores visibles et grain irrégulier : les actifs qui resserrent l'aspect des pores et lissent la texture.",
    en: "Visible pores and uneven texture: the actives that refine the look of pores and smooth the surface.",
  },
  barrier: {
    fr: "Barrière fragilisée, sensibilité : céramides et réparateurs qui reconstruisent le film protecteur de la peau.",
    en: "A compromised barrier and sensitivity: ceramides and repair actives that rebuild the skin's protective film.",
  },
  pigmentation: {
    fr: "Taches brunes et marques : les actifs éclaircissants qui ciblent l'hyperpigmentation, avec une protection solaire stricte.",
    en: "Dark spots and marks: the brightening actives that target hyperpigmentation, paired with strict sun protection.",
  },
  sunspots: {
    fr: "Taches et taches de rousseur dues au soleil : actifs éclaircissants et antioxydants, avec une protection solaire stricte.",
    en: "Sun-induced spots and freckles: brightening and antioxidant actives, paired with strict sun protection.",
  },
  hormonalredness: {
    fr: "Rougeurs persistantes liées aux hormones ou à la ménopause : actifs apaisants et acide azélaïque pour calmer et réduire la réactivité.",
    en: "Persistent redness linked to hormones or menopause: soothing actives and azelaic acid to calm and reduce reactivity.",
  },
  flaking: {
    fr: "Peau sèche qui pèle : exfoliation douce (PHA, lactique, urée) et réparation de la barrière pour lisser sans agresser.",
    en: "Dry, flaking skin: gentle exfoliation (PHA, lactic, urea) and barrier repair to smooth without aggression.",
  },
  darkcircles: {
    fr: "Cernes et poches sous les yeux : actifs décongestionnants et anti-fatigue (caféine, peptides, adénosine) pour un regard reposé.",
    en: "Dark circles and under-eye puffiness: decongesting, anti-fatigue actives (caffeine, peptides, adenosine) for a rested look.",
  },
  postacne: {
    fr: "Marques rouges ou brunes laissées par les boutons : actifs unifiants (acide azélaïque, niacinamide, tranexamique) qui les estompent en douceur.",
    en: "Red or brown marks left by breakouts: tone-evening actives (azelaic acid, niacinamide, tranexamic) that fade them gently.",
  },
  oiliness: {
    fr: "Peau qui brille et excès de sébum, sans forcément de boutons : actifs séborégulateurs (niacinamide, zinc, thé vert) qui matifient sans décaper.",
    en: "Shiny skin and excess oil, not necessarily with breakouts: oil-balancing actives (niacinamide, zinc, green tea) that mattify without stripping.",
  },
};

export function ingredientsForConcern(key: ConcernKey): Ingredient[] {
  return INGREDIENTS.filter((i) => (i.targets[key] ?? 0) >= 1).sort(
    (a, b) => (b.targets[key] ?? 0) - (a.targets[key] ?? 0),
  );
}

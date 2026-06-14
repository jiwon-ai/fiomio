/* ============================================================
   FIOMIO — K-beauty active knowledge base
   Each active is decoded and weighted (not merely listed):
   how well it serves each concern, its traits, gentleness,
   timing, and the conflicts that drive the "handle with care"
   guidance. Bilingual FR/EN.
   ============================================================ */

export type ConcernKey =
  | "redness"
  | "dehydration"
  | "dullness"
  | "aging"
  | "acne"
  | "pores"
  | "barrier"
  | "pigmentation";

export type TraitKey =
  | "hydrating"
  | "barrier"
  | "antioxidant"
  | "soothing"
  | "oilControl"
  | "exfoliating"
  | "brightening"
  | "firming"
  | "occlusive";

export type ActiveUse = "retinoid" | "exfoliant" | "vitc" | "none";
export type Timing = "AM" | "PM" | "AM/PM";

export type Ingredient = {
  id: string;
  name: { fr: string; en: string };
  /** short class / aka shown under the name */
  tag: { fr: string; en: string };
  /** 0–3 efficacy per concern (absent = 0) */
  targets: Partial<Record<ConcernKey, number>>;
  traits: TraitKey[];
  /** 0 = potent/irritating, 3 = very gentle (safe for reactive skin) */
  gentleness: number;
  timing: Timing;
  /** suits these skin types especially (bonus) */
  loves: Array<"dry" | "combination" | "oily" | "normal">;
  why: { fr: string; en: string };
  howToUse: { fr: string; en: string };
  /** raises a caution when the user already uses one of these */
  conflictsWith?: ActiveUse[];
  /** flagged as a "strong" active for sensitivity penalties */
  strong?: boolean;
};

export const INGREDIENTS: Ingredient[] = [
  {
    id: "ceramides",
    name: { fr: "Céramides", en: "Ceramides" },
    tag: { fr: "Réparateur barrière", en: "Barrier repair" },
    targets: { barrier: 3, dehydration: 3, redness: 2, aging: 1 },
    traits: ["barrier", "hydrating", "soothing", "occlusive"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal"],
    why: {
      fr: "Reconstituent le ciment lipidique de la peau, affaibli par l'air sec parisien et les actifs forts. La base d'une barrière qui retient l'eau.",
      en: "Rebuild the skin's lipid mortar, weakened by dry Parisian air and strong actives. The foundation of a barrier that holds water.",
    },
    howToUse: {
      fr: "Matin et soir, après les sérums, avant la crème (ou dans la crème).",
      en: "Morning and night, after serums, before moisturizer (or within it).",
    },
  },
  {
    id: "hyaluronic",
    name: { fr: "Acide hyaluronique", en: "Hyaluronic acid" },
    tag: { fr: "Hydratant humectant", en: "Humectant hydrator" },
    targets: { dehydration: 3, dullness: 1, aging: 1 },
    traits: ["hydrating"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "oily", "normal"],
    why: {
      fr: "Capte l'eau dans les couches superficielles pour repulper instantanément. Idéal quand la déshydratation prime sur le manque de lipides.",
      en: "Draws water into the upper layers for instant plumping. Ideal when dehydration outweighs a lack of lipids.",
    },
    howToUse: {
      fr: "Sur peau légèrement humide, puis scellez avec une crème — sinon il peut assécher en air très sec.",
      en: "On slightly damp skin, then seal with a cream — otherwise it can dry you out in very dry air.",
    },
  },
  {
    id: "niacinamide",
    name: { fr: "Niacinamide", en: "Niacinamide" },
    tag: { fr: "Polyvalent · vitamine B3", en: "Multitasker · vitamin B3" },
    targets: {
      pores: 3,
      acne: 2,
      dullness: 2,
      redness: 2,
      barrier: 2,
      pigmentation: 2,
      dehydration: 1,
    },
    traits: ["oilControl", "brightening", "soothing", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["combination", "oily", "normal", "dry"],
    why: {
      fr: "Régule le sébum, resserre l'aspect des pores, unifie le teint et soutient la barrière — sans irriter. Compatible avec presque tout, y compris le rétinol en alternance.",
      en: "Regulates sebum, refines the look of pores, evens tone and supports the barrier — without irritation. Plays well with almost everything, including retinol on alternate nights.",
    },
    howToUse: {
      fr: "Matin et/ou soir. 5 % suffisent ; au-delà, risque d'inconfort sur peau réactive.",
      en: "Morning and/or night. 5% is plenty; higher can feel uncomfortable on reactive skin.",
    },
  },
  {
    id: "centella",
    name: { fr: "Centella asiatica (Cica)", en: "Centella asiatica (Cica)" },
    tag: { fr: "Apaisant K-beauty", en: "K-beauty soother" },
    targets: { redness: 3, barrier: 2, dehydration: 1, aging: 1 },
    traits: ["soothing", "barrier", "antioxidant"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Calme les rougeurs réactionnelles spécifiques aux peaux sensibles et accélère la réparation. Le pilier apaisant de la K-beauty.",
      en: "Calms the reactive redness typical of sensitive skin and speeds repair. K-beauty's soothing cornerstone.",
    },
    howToUse: {
      fr: "Matin et soir, en sérum ou essence, particulièrement après un actif fort.",
      en: "Morning and night, as a serum or essence, especially after a strong active.",
    },
  },
  {
    id: "madecassoside",
    name: { fr: "Madécassoside", en: "Madecassoside" },
    tag: { fr: "Cica concentré", en: "Concentrated cica" },
    targets: { redness: 3, barrier: 2, aging: 1 },
    traits: ["soothing", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal"],
    why: {
      fr: "Molécule la plus active de la centella : cible la rougeur installée et soutient la cicatrisation de la barrière.",
      en: "The most active molecule in centella: targets entrenched redness and supports barrier recovery.",
    },
    howToUse: {
      fr: "Soir de préférence, en cure pendant les périodes de réactivité.",
      en: "Preferably at night, as a course during reactive periods.",
    },
  },
  {
    id: "panthenol",
    name: { fr: "Panthénol (B5)", en: "Panthenol (B5)" },
    tag: { fr: "Hydratant apaisant", en: "Soothing humectant" },
    targets: { dehydration: 2, barrier: 2, redness: 2 },
    traits: ["hydrating", "soothing", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Attire l'eau et apaise l'inflammation : un tampon idéal quand le rétinol ou le froid irritent.",
      en: "Attracts water and calms inflammation: an ideal buffer when retinol or cold irritate.",
    },
    howToUse: {
      fr: "Matin et soir ; superpose bien avec presque tous les actifs.",
      en: "Morning and night; layers well with almost any active.",
    },
  },
  {
    id: "squalane",
    name: { fr: "Squalane", en: "Squalane" },
    tag: { fr: "Émollient léger", en: "Light emollient" },
    targets: { dehydration: 2, barrier: 2 },
    traits: ["occlusive", "barrier", "hydrating"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "normal", "combination"],
    why: {
      fr: "Scelle l'hydratation sans effet gras ni comédon — parfait pour verrouiller un sérum hydratant dans l'air sec hivernal.",
      en: "Seals in hydration with no greasiness or clogging — perfect to lock a hydrating serum into dry winter air.",
    },
    howToUse: {
      fr: "En dernière étape du soir, quelques gouttes sur peau encore humide.",
      en: "As the last evening step, a few drops on still-damp skin.",
    },
  },
  {
    id: "snail",
    name: { fr: "Mucine d'escargot", en: "Snail mucin" },
    tag: { fr: "Réparateur hydratant", en: "Hydrating repair" },
    targets: { dehydration: 2, barrier: 2, dullness: 1, redness: 1, acne: 1 },
    traits: ["hydrating", "barrier", "soothing"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Hydrate, répare et apaise simultanément — un favori K-beauty pour redonner du rebond aux peaux fatiguées.",
      en: "Hydrates, repairs and soothes at once — a K-beauty favorite to bring bounce back to tired skin.",
    },
    howToUse: {
      fr: "En essence après le nettoyage, matin et soir.",
      en: "As an essence after cleansing, morning and night.",
    },
  },
  {
    id: "vitaminc",
    name: { fr: "Vitamine C", en: "Vitamin C" },
    tag: { fr: "Antioxydant · éclat", en: "Antioxidant · glow" },
    targets: { dullness: 3, pigmentation: 3, aging: 2 },
    traits: ["antioxidant", "brightening", "firming"],
    gentleness: 1,
    timing: "AM",
    loves: ["combination", "oily", "normal", "dry"],
    why: {
      fr: "Neutralise les radicaux libres de la pollution urbaine et ravive l'éclat tout en estompant les taches. Le bouclier antioxydant du matin.",
      en: "Neutralizes free radicals from urban pollution and revives glow while fading dark spots. The morning antioxidant shield.",
    },
    howToUse: {
      fr: "Le matin, sous la protection solaire. Introduisez progressivement si votre peau est réactive.",
      en: "In the morning, under sunscreen. Introduce gradually if your skin is reactive.",
    },
    conflictsWith: ["exfoliant"],
    strong: true,
  },
  {
    id: "azelaic",
    name: { fr: "Acide azélaïque", en: "Azelaic acid" },
    tag: { fr: "Anti-rougeurs · taches", en: "Anti-redness · spots" },
    targets: { redness: 3, acne: 2, pigmentation: 2, pores: 1 },
    traits: ["soothing", "brightening", "oilControl"],
    gentleness: 2,
    timing: "AM/PM",
    loves: ["combination", "oily", "normal"],
    why: {
      fr: "Rare polyvalent qui apaise les rougeurs, déloge les imperfections et estompe les taches — bien toléré même par les peaux réactives.",
      en: "A rare multitasker that calms redness, clears breakouts and fades marks — well tolerated even by reactive skin.",
    },
    howToUse: {
      fr: "Matin ou soir ; introduisez un jour sur deux au début.",
      en: "Morning or night; start every other day.",
    },
  },
  {
    id: "salicylic",
    name: { fr: "Acide salicylique (BHA)", en: "Salicylic acid (BHA)" },
    tag: { fr: "Exfoliant des pores", en: "Pore exfoliant" },
    targets: { acne: 3, pores: 3, dullness: 1 },
    traits: ["exfoliating", "oilControl"],
    gentleness: 1,
    timing: "PM",
    loves: ["oily", "combination"],
    why: {
      fr: "Liposoluble, il pénètre dans le pore pour déloger le sébum et désincruster — l'actif clé contre imperfections et points noirs.",
      en: "Oil-soluble, it gets inside the pore to clear sebum and decongest — the key active against breakouts and blackheads.",
    },
    howToUse: {
      fr: "Le soir, 2–3 fois par semaine. Jamais le même soir que le rétinol.",
      en: "At night, 2–3 times a week. Never the same night as retinol.",
    },
    conflictsWith: ["retinoid", "exfoliant"],
    strong: true,
  },
  {
    id: "retinol",
    name: { fr: "Rétinol", en: "Retinol" },
    tag: { fr: "Anti-âge de référence", en: "Gold-standard anti-aging" },
    targets: { aging: 3, pores: 2, pigmentation: 2, acne: 1 },
    traits: ["firming", "exfoliating"],
    gentleness: 0,
    timing: "PM",
    loves: ["normal", "combination", "oily"],
    why: {
      fr: "L'actif anti-âge le plus documenté : stimule le renouvellement et la fermeté. Puissant — à introduire lentement, jamais sans hydratation.",
      en: "The most documented anti-aging active: drives cell turnover and firmness. Potent — introduce slowly, never without hydration.",
    },
    howToUse: {
      fr: "Le soir, 1–2 fois par semaine au début, encadré de céramides. SPF obligatoire le lendemain.",
      en: "At night, 1–2 times a week to start, buffered with ceramides. SPF the next day is non-negotiable.",
    },
    conflictsWith: ["retinoid", "exfoliant", "vitc"],
    strong: true,
  },
  {
    id: "peptides",
    name: { fr: "Peptides", en: "Peptides" },
    tag: { fr: "Fermeté en douceur", en: "Gentle firming" },
    targets: { aging: 3, barrier: 1, dehydration: 1 },
    traits: ["firming", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "normal", "combination"],
    why: {
      fr: "Signalent à la peau de produire collagène et élastine, sans l'irritation du rétinol — l'anti-âge des peaux sensibles.",
      en: "Signal the skin to build collagen and elastin, without retinol's irritation — anti-aging for sensitive skin.",
    },
    howToUse: {
      fr: "Matin et soir ; excellent partenaire du rétinol pour amortir son agressivité.",
      en: "Morning and night; an excellent partner to retinol to cushion its harshness.",
    },
  },
  {
    id: "allantoin",
    name: { fr: "Allantoïne", en: "Allantoin" },
    tag: { fr: "Réparateur apaisant", en: "Soothing healer" },
    targets: { redness: 2, barrier: 2, dehydration: 1 },
    traits: ["soothing", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Apaise et lisse les peaux irritées, accélère la réparation — un actif discret mais fiable pour calmer une barrière malmenée.",
      en: "Soothes and smooths irritated skin and speeds repair — a quiet but reliable active to calm a stressed barrier.",
    },
    howToUse: {
      fr: "Matin et soir ; se superpose à tout sans risque.",
      en: "Morning and night; layers with anything, risk-free.",
    },
  },
];

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

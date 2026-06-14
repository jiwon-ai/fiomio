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
  {
    id: "betaglucan",
    name: { fr: "Bêta-glucane", en: "Beta-glucan" },
    tag: { fr: "Hydratant apaisant", en: "Soothing hydrator" },
    targets: { dehydration: 3, barrier: 2, redness: 2, aging: 1 },
    traits: ["hydrating", "soothing", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Retient l'eau plus longtemps que l'acide hyaluronique et calme l'inflammation — un hydratant de fond très bien toléré.",
      en: "Holds water longer than hyaluronic acid and calms inflammation — a very well-tolerated everyday hydrator.",
    },
    howToUse: {
      fr: "Matin et soir, en sérum ou essence, avant les soins plus riches.",
      en: "Morning and night, as a serum or essence, before richer care.",
    },
  },
  {
    id: "mugwort",
    name: { fr: "Armoise (Mugwort)", en: "Mugwort (Artemisia)" },
    tag: { fr: "Apaisant K-beauty", en: "K-beauty soother" },
    targets: { redness: 3, barrier: 2, dehydration: 1 },
    traits: ["soothing", "barrier", "antioxidant"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Star coréenne des peaux irritées : riche en antioxydants, elle calme en profondeur les rougeurs et les démangeaisons.",
      en: "A Korean hero for irritated skin: rich in antioxidants, it deeply calms redness and itch.",
    },
    howToUse: {
      fr: "En essence ou masque, matin et soir, pendant les poussées de réactivité.",
      en: "As an essence or mask, morning and night, during reactive flare-ups.",
    },
  },
  {
    id: "heartleaf",
    name: { fr: "Heartleaf (Houttuynia)", en: "Heartleaf (Houttuynia)" },
    tag: { fr: "Apaisant anti-imperfections", en: "Blemish-calming soother" },
    targets: { redness: 2, acne: 2, barrier: 1, pores: 1 },
    traits: ["soothing", "oilControl", "antioxidant"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["oily", "combination", "normal"],
    why: {
      fr: "Apaise sans assécher : idéal pour les peaux mixtes à imperfections qui réagissent mal aux actifs trop forts.",
      en: "Calms without drying: ideal for blemish-prone combination skin that reacts badly to harsh actives.",
    },
    howToUse: {
      fr: "Matin et soir, après le nettoyage ; cumulable avec un actif anti-imperfections doux.",
      en: "Morning and night, after cleansing; pairs with a gentle blemish active.",
    },
  },
  {
    id: "greentea",
    name: { fr: "Thé vert (EGCG)", en: "Green tea (EGCG)" },
    tag: { fr: "Antioxydant · sébo-régulateur", en: "Antioxidant · sebum control" },
    targets: { redness: 2, acne: 1, dullness: 1, pores: 1 },
    traits: ["antioxidant", "soothing", "oilControl"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["oily", "combination", "normal", "dry"],
    why: {
      fr: "Bouclier antioxydant doux contre la pollution parisienne, tout en régulant le sébum — parfait en couche du matin.",
      en: "A gentle antioxidant shield against Parisian pollution while regulating sebum — perfect as a morning layer.",
    },
    howToUse: {
      fr: "Le matin sous la protection solaire ; convient aussi le soir.",
      en: "In the morning under sunscreen; also fine at night.",
    },
  },
  {
    id: "galactomyces",
    name: { fr: "Galactomyces (ferment)", en: "Galactomyces (ferment)" },
    tag: { fr: "Essence éclat K-beauty", en: "K-beauty glow essence" },
    targets: { dullness: 2, pores: 2, dehydration: 1, pigmentation: 1 },
    traits: ["brightening", "hydrating", "antioxidant"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["combination", "normal", "oily", "dry"],
    why: {
      fr: "Ferment emblématique des essences coréennes : affine le grain de peau et ravive l'éclat sans agresser.",
      en: "The signature ferment of Korean essences: refines texture and revives glow without aggression.",
    },
    howToUse: {
      fr: "En essence juste après le nettoyage, matin et soir, sur peau humide.",
      en: "As an essence right after cleansing, morning and night, on damp skin.",
    },
  },
  {
    id: "propolis",
    name: { fr: "Propolis", en: "Propolis" },
    tag: { fr: "Apaisant nourrissant", en: "Nourishing soother" },
    targets: { acne: 2, redness: 2, dullness: 1, dehydration: 1 },
    traits: ["soothing", "antioxidant", "barrier"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Apaisant et assainissant à la fois : nourrit les peaux ternes et fatiguées tout en aidant à limiter les imperfections.",
      en: "Soothing and clarifying at once: nourishes dull, tired skin while helping keep blemishes in check.",
    },
    howToUse: {
      fr: "Le soir en sérum ou ampoule, en cure pendant les périodes de fatigue cutanée.",
      en: "At night as a serum or ampoule, as a course during periods of skin fatigue.",
    },
  },
  {
    id: "bakuchiol",
    name: { fr: "Bakuchiol", en: "Bakuchiol" },
    tag: { fr: "Alternative douce au rétinol", en: "Gentle retinol alternative" },
    targets: { aging: 3, pigmentation: 1, redness: 1, barrier: 1 },
    traits: ["firming", "antioxidant", "soothing"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["dry", "normal", "combination", "oily"],
    why: {
      fr: "Effet lissant proche du rétinol sans l'irritation ni la photosensibilité — l'anti-âge des peaux sensibles ou déjà sous actifs.",
      en: "A retinol-like smoothing effect without the irritation or photosensitivity — anti-aging for sensitive skin or those already on actives.",
    },
    howToUse: {
      fr: "Matin et/ou soir ; se cumule sans risque, même avec une barrière fragilisée.",
      en: "Morning and/or night; stacks safely, even on a compromised barrier.",
    },
  },
  {
    id: "tranexamic",
    name: { fr: "Acide tranexamique", en: "Tranexamic acid" },
    tag: { fr: "Anti-taches ciblé", en: "Targeted spot-fader" },
    targets: { pigmentation: 3, redness: 2, dullness: 1 },
    traits: ["brightening", "soothing"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["combination", "normal", "dry", "oily"],
    why: {
      fr: "Cible les taches tenaces et les marques post-inflammatoires sans irriter — efficace là où la vitamine C est mal tolérée.",
      en: "Targets stubborn spots and post-inflammatory marks without irritation — effective where vitamin C isn't tolerated.",
    },
    howToUse: {
      fr: "Matin et soir ; se superpose bien à la niacinamide pour un effet anti-taches renforcé.",
      en: "Morning and night; layers well with niacinamide for a stronger spot-fading effect.",
    },
  },
  {
    id: "arbutin",
    name: { fr: "Alpha-arbutine", en: "Alpha-arbutin" },
    tag: { fr: "Éclaircissant doux", en: "Gentle brightener" },
    targets: { pigmentation: 3, dullness: 2 },
    traits: ["brightening"],
    gentleness: 3,
    timing: "AM/PM",
    loves: ["combination", "normal", "dry", "oily"],
    why: {
      fr: "Freine en douceur la production de mélanine pour estomper taches et hyperpigmentation, sans effet rebond.",
      en: "Gently slows melanin production to fade spots and hyperpigmentation, with no rebound effect.",
    },
    howToUse: {
      fr: "Matin et soir, en cure de plusieurs semaines ; SPF indispensable le jour.",
      en: "Morning and night, over several weeks; daytime SPF is essential.",
    },
  },
  {
    id: "mandelic",
    name: { fr: "Acide mandélique (AHA)", en: "Mandelic acid (AHA)" },
    tag: { fr: "Exfoliant doux peaux sensibles", en: "Gentle AHA for sensitive skin" },
    targets: { acne: 2, pigmentation: 2, dullness: 2, pores: 1 },
    traits: ["exfoliating", "brightening", "oilControl"],
    gentleness: 2,
    timing: "PM",
    loves: ["oily", "combination", "normal"],
    why: {
      fr: "AHA à grosse molécule, donc le plus doux : exfolie, lisse et unifie sans la réactivité du glycolique.",
      en: "A large-molecule AHA, hence the gentlest: exfoliates, smooths and evens without glycolic's reactivity.",
    },
    howToUse: {
      fr: "Le soir, 2–3 fois par semaine ; jamais le même soir que le rétinol.",
      en: "At night, 2–3 times a week; never the same night as retinol.",
    },
    conflictsWith: ["retinoid", "exfoliant"],
    strong: true,
  },
  {
    id: "glycolic",
    name: { fr: "Acide glycolique (AHA)", en: "Glycolic acid (AHA)" },
    tag: { fr: "Exfoliant éclat", en: "Glow exfoliant" },
    targets: { dullness: 3, pigmentation: 2, aging: 2, pores: 2 },
    traits: ["exfoliating", "brightening"],
    gentleness: 1,
    timing: "PM",
    loves: ["normal", "combination", "oily"],
    why: {
      fr: "Le plus pénétrant des AHA : ravive l'éclat et lisse la texture, mais demande une barrière solide et une introduction progressive.",
      en: "The most penetrating AHA: revives glow and smooths texture, but needs a solid barrier and gradual introduction.",
    },
    howToUse: {
      fr: "Le soir, 1–2 fois par semaine au début. SPF obligatoire le lendemain.",
      en: "At night, 1–2 times a week to start. SPF the next day is mandatory.",
    },
    conflictsWith: ["retinoid", "exfoliant", "vitc"],
    strong: true,
  },
  {
    id: "lactic",
    name: { fr: "Acide lactique (AHA)", en: "Lactic acid (AHA)" },
    tag: { fr: "Exfoliant hydratant", en: "Hydrating exfoliant" },
    targets: { dullness: 2, dehydration: 2, pigmentation: 2, pores: 1 },
    traits: ["exfoliating", "hydrating", "brightening"],
    gentleness: 2,
    timing: "PM",
    loves: ["dry", "normal", "combination"],
    why: {
      fr: "AHA qui exfolie tout en hydratant : idéal pour les peaux sèches et ternes qui ne supportent pas le glycolique.",
      en: "An AHA that exfoliates while hydrating: ideal for dry, dull skin that can't tolerate glycolic.",
    },
    howToUse: {
      fr: "Le soir, 2 fois par semaine ; suivi d'une crème réparatrice.",
      en: "At night, twice a week; follow with a repairing cream.",
    },
    conflictsWith: ["retinoid", "exfoliant"],
    strong: true,
  },
  {
    id: "pha",
    name: { fr: "PHA (gluconolactone)", en: "PHA (gluconolactone)" },
    tag: { fr: "Exfoliant le plus doux", en: "The gentlest exfoliant" },
    targets: { pores: 2, dullness: 2, barrier: 1 },
    traits: ["exfoliating", "hydrating"],
    gentleness: 2,
    timing: "PM",
    loves: ["dry", "combination", "normal", "oily"],
    why: {
      fr: "Acide à très grosse molécule qui exfolie en surface et retient l'eau — l'entrée idéale vers les acides pour peaux réactives.",
      en: "A very large-molecule acid that exfoliates the surface and holds water — the ideal gateway into acids for reactive skin.",
    },
    howToUse: {
      fr: "Le soir, 2–3 fois par semaine ; bien mieux toléré que les AHA classiques.",
      en: "At night, 2–3 times a week; far better tolerated than classic AHAs.",
    },
    conflictsWith: ["retinoid", "exfoliant"],
  },
];

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

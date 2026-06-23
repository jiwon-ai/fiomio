// DRAFT catalog — product names are real but URLs/availability MUST be verified before launch. No prices (confirm at launch).

import type { ConcernKey } from "@/lib/ingredients";

export const PRODUCTS_DRAFT = true;

export type Product = {
  id: string;
  brand: string;
  name: string;
  ingredientIds: string[];
  concerns?: ConcernKey[];
  category:
    | "cleanser"
    | "toner"
    | "essence"
    | "serum"
    | "moisturizer"
    | "sunscreen"
    | "treatment"
    | "mask";
  blurb: { fr: string; en: string };
  url: string;
};

/* Real, well-known K-beauty products mapped to our active ids.
   URLs point to brand official sites or retailer search pages we are
   confident exist — NEVER pre-baked with affiliate tags. Every url is
   passed through buildAffiliateLink() at render time. */
export const PRODUCTS: Product[] = [
  {
    id: "cosrx-snail-96",
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    ingredientIds: ["snail"],
    concerns: ["dehydration", "barrier"],
    category: "essence",
    blurb: {
      fr: "Essence mucine : répare et repulpe la barrière en douceur.",
      en: "Snail-mucin essence: gently repairs and plumps the barrier.",
    },
    url: "https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence",
  },
  {
    id: "anua-heartleaf-77",
    brand: "Anua",
    name: "Heartleaf 77% Soothing Toner",
    ingredientIds: ["heartleaf", "centella"],
    concerns: ["redness", "acne"],
    category: "toner",
    blurb: {
      fr: "Toner heartleaf : apaise rougeurs et imperfections sans assécher.",
      en: "Heartleaf toner: calms redness and blemishes without drying.",
    },
    url: "https://anua.co.kr/en/product/heartleaf-77-soothing-toner",
  },
  {
    id: "skin1004-centella-ampoule",
    brand: "SKIN1004",
    name: "Madagascar Centella Ampoule",
    ingredientIds: ["centella"],
    concerns: ["redness", "barrier"],
    category: "serum",
    blurb: {
      fr: "Ampoule cica pure : calme la réactivité et soutient la barrière.",
      en: "Pure cica ampoule: calms reactivity and supports the barrier.",
    },
    url: "https://skin1004.com/products/madagascar-centella-ampoule",
  },
  {
    id: "purito-centella-serum",
    brand: "PURITO",
    name: "Centella Unscented Serum",
    ingredientIds: ["centella", "panthenol"],
    concerns: ["redness", "barrier"],
    category: "serum",
    blurb: {
      fr: "Sérum cica sans parfum : apaisant minimaliste pour peaux réactives.",
      en: "Fragrance-free cica serum: minimalist soothing for reactive skin.",
    },
    url: "https://www.yesstyle.com/en/search?q=Purito%20Centella%20Unscented%20Serum",
  },
  {
    id: "boj-glow-deep-serum",
    brand: "Beauty of Joseon",
    name: "Glow Deep Serum: Rice + Alpha Arbutin",
    ingredientIds: ["niacinamide", "arbutin"],
    concerns: ["dullness", "pigmentation"],
    category: "serum",
    blurb: {
      fr: "Sérum riz et arbutine : ravive l'éclat et estompe les taches.",
      en: "Rice + arbutin serum: revives glow and fades dark spots.",
    },
    url: "https://beautyofjoseon.com/products/glow-deep-serum-rice-alpha-arbutin",
  },
  {
    id: "boj-revive-serum",
    brand: "Beauty of Joseon",
    name: "Revive Serum: Ginseng + Snail Mucin",
    ingredientIds: ["snail", "propolis"],
    concerns: ["dehydration", "barrier"],
    category: "serum",
    blurb: {
      fr: "Sérum ginseng et mucine : nourrit et redonne du rebond.",
      en: "Ginseng + snail serum: nourishes and restores bounce.",
    },
    url: "https://beautyofjoseon.com/products/revive-serum-ginseng-snail-mucin",
  },
  {
    id: "boj-relief-sun",
    brand: "Beauty of Joseon",
    name: "Relief Sun: Rice + Probiotics SPF50+",
    ingredientIds: ["greentea"],
    concerns: ["barrier"],
    category: "sunscreen",
    blurb: {
      fr: "SPF50+ fluide au fini naturel : protection quotidienne agréable.",
      en: "Lightweight SPF50+ with a natural finish: easy daily protection.",
    },
    url: "https://beautyofjoseon.com/products/relief-sun-rice-probiotics",
  },
  {
    id: "boj-glow-serum",
    brand: "Beauty of Joseon",
    name: "Glow Serum: Propolis + Niacinamide",
    ingredientIds: ["propolis", "niacinamide"],
    concerns: ["dullness", "acne"],
    category: "serum",
    blurb: {
      fr: "Propolis et niacinamide : éclat et clarté pour peaux fatiguées.",
      en: "Propolis + niacinamide: glow and clarity for tired skin.",
    },
    url: "https://beautyofjoseon.com/products/glow-serum-propolis-niacinamide",
  },
  {
    id: "numbuzin-no3",
    brand: "Numbuzin",
    name: "No.3 Skin Brightening Serum",
    ingredientIds: ["niacinamide", "galactomyces"],
    concerns: ["dullness", "pigmentation"],
    category: "serum",
    blurb: {
      fr: "Sérum éclat multi-ferments : unifie et illumine le teint.",
      en: "Multi-ferment brightening serum: evens and lights up the complexion.",
    },
    url: "https://www.yesstyle.com/en/search?q=numbuzin%20No.3%20Skin%20Brightening%20Serum",
  },
  {
    id: "isntree-ha-toner",
    brand: "Isntree",
    name: "Hyaluronic Acid Toner",
    ingredientIds: ["hyaluronic"],
    concerns: ["dehydration"],
    category: "toner",
    blurb: {
      fr: "Toner à l'acide hyaluronique : hydratation repulpante en couches.",
      en: "Hyaluronic acid toner: plumping, layerable hydration.",
    },
    url: "https://www.yesstyle.com/en/search?q=Isntree%20Hyaluronic%20Acid%20Toner",
  },
  {
    id: "torriden-dive-in-serum",
    brand: "Torriden",
    name: "DIVE-IN Low Molecular Hyaluronic Acid Serum",
    ingredientIds: ["hyaluronic", "betaglucan"],
    concerns: ["dehydration", "barrier"],
    category: "serum",
    blurb: {
      fr: "Sérum hyaluronique léger : hydrate en profondeur, fini frais.",
      en: "Light hyaluronic serum: deep hydration, fresh finish.",
    },
    url: "https://www.yesstyle.com/en/search?q=Torriden%20Dive-In%20Hyaluronic%20Acid%20Serum",
  },
  {
    id: "aestura-atobarrier365",
    brand: "Aestura",
    name: "Atobarrier365 Cream",
    ingredientIds: ["ceramides", "panthenol"],
    concerns: ["barrier", "dehydration"],
    category: "moisturizer",
    blurb: {
      fr: "Crème céramides : restaure la barrière des peaux sèches et sensibles.",
      en: "Ceramide cream: rebuilds the barrier of dry, sensitive skin.",
    },
    url: "https://www.yesstyle.com/en/search?q=Aestura%20Atobarrier365%20Cream",
  },
  {
    id: "drjart-ceramidin-cream",
    brand: "Dr.Jart+",
    name: "Ceramidin Cream",
    ingredientIds: ["ceramides"],
    concerns: ["barrier", "dehydration"],
    category: "moisturizer",
    blurb: {
      fr: "Crème ceramidin : confort et étanchéité pour barrière fragilisée.",
      en: "Ceramidin cream: comfort and seal for a compromised barrier.",
    },
    url: "https://www.drjart.com/en-us/products/ceramidin-cream",
  },
  {
    id: "somebymi-retinol",
    brand: "SOME BY MI",
    name: "Retinol Intense Advanced Triple Action Serum",
    ingredientIds: ["retinol"],
    concerns: ["aging"],
    category: "serum",
    blurb: {
      fr: "Sérum rétinol progressif : lissage et fermeté, à introduire lentement.",
      en: "Gradual retinol serum: smoothing and firmness, introduce slowly.",
    },
    url: "https://www.yesstyle.com/en/search?q=Some%20By%20Mi%20Retinol%20Intense%20Serum",
  },
  {
    id: "naturium-vitc",
    brand: "Naturium",
    name: "Vitamin C Complex Serum",
    ingredientIds: ["vitaminc"],
    concerns: ["dullness", "pigmentation"],
    category: "serum",
    blurb: {
      fr: "Sérum vitamine C : bouclier antioxydant et éclat du matin.",
      en: "Vitamin C serum: antioxidant shield and morning glow.",
    },
    url: "https://naturium.com/products/vitamin-c-complex-serum",
  },
  {
    id: "cosrx-aha-bha-toner",
    brand: "COSRX",
    name: "AHA/BHA Clarifying Treatment Toner",
    ingredientIds: ["glycolic", "salicylic"],
    concerns: ["pores", "acne"],
    category: "toner",
    blurb: {
      fr: "Toner AHA/BHA : affine le grain et désincruste les pores.",
      en: "AHA/BHA toner: refines texture and decongests pores.",
    },
    url: "https://www.cosrx.com/products/aha-bha-clarifying-treatment-toner",
  },
  {
    id: "cosrx-bha-blackhead",
    brand: "COSRX",
    name: "BHA Blackhead Power Liquid",
    ingredientIds: ["salicylic"],
    concerns: ["pores", "acne"],
    category: "treatment",
    blurb: {
      fr: "BHA ciblé : déloge sébum et points noirs au cœur du pore.",
      en: "Targeted BHA: clears sebum and blackheads inside the pore.",
    },
    url: "https://www.cosrx.com/products/bha-blackhead-power-liquid",
  },
  {
    id: "isntree-mugwort",
    brand: "Isntree",
    name: "Spot Saver Mugwort Ampoule",
    ingredientIds: ["mugwort"],
    concerns: ["redness", "acne"],
    category: "serum",
    blurb: {
      fr: "Ampoule armoise : apaise profondément les peaux irritées.",
      en: "Mugwort ampoule: deeply calms irritated, reactive skin.",
    },
    url: "https://www.yesstyle.com/en/search?q=Isntree%20Mugwort%20Ampoule",
  },
  {
    id: "roundlab-dokdo-toner",
    brand: "Round Lab",
    name: "1025 Dokdo Toner",
    ingredientIds: ["panthenol", "betaglucan"],
    concerns: ["dehydration", "barrier"],
    category: "toner",
    blurb: {
      fr: "Toner minéral apaisant : hydrate et rééquilibre en douceur.",
      en: "Soothing mineral toner: hydrates and rebalances gently.",
    },
    url: "https://www.yesstyle.com/en/search?q=Round%20Lab%201025%20Dokdo%20Toner",
  },
  {
    id: "roundlab-mugwort-cream",
    brand: "Round Lab",
    name: "Mugwort Calming Cream",
    ingredientIds: ["mugwort", "centella"],
    concerns: ["redness", "barrier"],
    category: "moisturizer",
    blurb: {
      fr: "Crème armoise : calme et nourrit les barrières sensibilisées.",
      en: "Mugwort cream: calms and nourishes sensitised barriers.",
    },
    url: "https://www.yesstyle.com/en/search?q=Round%20Lab%20Mugwort%20Calming%20Cream",
  },
  {
    id: "mixsoon-bean-essence",
    brand: "Mixsoon",
    name: "Bean Essence",
    ingredientIds: ["galactomyces", "niacinamide"],
    concerns: ["dullness", "dehydration"],
    category: "essence",
    blurb: {
      fr: "Essence fermentée minimaliste : lisse le grain et ravive l'éclat.",
      en: "Minimalist fermented essence: smooths texture and revives glow.",
    },
    url: "https://www.yesstyle.com/en/search?q=Mixsoon%20Bean%20Essence",
  },
  {
    id: "abib-heartleaf-toner",
    brand: "Abib",
    name: "Heartleaf Essence Calming Toner",
    ingredientIds: ["heartleaf", "allantoin"],
    concerns: ["redness", "barrier"],
    category: "toner",
    blurb: {
      fr: "Toner heartleaf apaisant : confort immédiat pour peaux sensibles.",
      en: "Soothing heartleaf toner: instant comfort for sensitive skin.",
    },
    url: "https://www.yesstyle.com/en/search?q=Abib%20Heartleaf%20Essence%20Calming%20Toner",
  },
  {
    id: "axisy-dark-spot-serum",
    brand: "AXIS-Y",
    name: "Dark Spot Correcting Glow Serum",
    ingredientIds: ["niacinamide", "squalane"],
    concerns: ["pigmentation", "dullness"],
    category: "serum",
    blurb: {
      fr: "Sérum anti-taches : unifie le teint et nourrit légèrement.",
      en: "Dark-spot serum: evens tone with a light nourishing finish.",
    },
    url: "https://www.yesstyle.com/en/search?q=AXIS-Y%20Dark%20Spot%20Correcting%20Glow%20Serum",
  },
  {
    id: "klairs-vitc-drop",
    brand: "Dear, Klairs",
    name: "Freshly Juiced Vitamin Drop",
    ingredientIds: ["vitaminc"],
    concerns: ["dullness", "pigmentation"],
    category: "serum",
    blurb: {
      fr: "Vitamine C douce 5 % : éclat progressif, bien tolérée.",
      en: "Gentle 5% vitamin C: gradual glow, well tolerated.",
    },
    url: "https://www.yesstyle.com/en/search?q=Klairs%20Freshly%20Juiced%20Vitamin%20Drop",
  },
];

/** Products whose ingredientIds intersect `ids`, de-duplicated,
 *  preserving the input id priority order, capped at `max`. */
export function productsForIngredients(ids: string[], max = 6): Product[] {
  const out: Product[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    for (const p of PRODUCTS) {
      if (seen.has(p.id)) continue;
      if (p.ingredientIds.includes(id)) {
        out.push(p);
        seen.add(p.id);
        if (out.length >= max) return out;
      }
    }
  }
  return out;
}

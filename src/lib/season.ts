/* ============================================================
   FIOMIO — Paris climate / season model
   The "climate variable" is Fiomio's core differentiator.
   Maps the current month to a seasonal context that biases
   the recommendation engine (boost / demote ingredient traits).
   ============================================================ */

import type { TraitKey, ConcernKey } from "./ingredients";

export type Season = "winter" | "spring" | "summer" | "autumn";

export type SeasonInfo = {
  key: Season;
  emoji: string;
  fr: { label: string; humidity: string; note: string };
  en: { label: string; humidity: string; note: string };
  boostTraits: Partial<Record<TraitKey, number>>;
  boostConcerns: Partial<Record<ConcernKey, number>>;
  demoteTraits: TraitKey[];
};

export const SEASONS: Record<Season, SeasonInfo> = {
  winter: {
    key: "winter",
    emoji: "❄️",
    fr: {
      label: "Hiver",
      humidity: "Air sec · chauffage · humidité intérieure ~30–40 %",
      note: "Le froid et le chauffage fragilisent la barrière cutanée. Priorité à l'hydratation et à la réparation.",
    },
    en: {
      label: "Winter",
      humidity: "Dry air · heating · indoor humidity ~30–40%",
      note: "Cold and indoor heating weaken the skin barrier. Hydration and repair come first.",
    },
    boostTraits: { hydrating: 2, barrier: 2, soothing: 1, occlusive: 1 },
    boostConcerns: { dehydration: 2, barrier: 2, redness: 1 },
    demoteTraits: ["exfoliating"],
  },
  spring: {
    key: "spring",
    emoji: "🌿",
    fr: {
      label: "Printemps",
      humidity: "Transition · pollution urbaine · pollens",
      note: "Saison de transition. On rééquilibre, on protège des agressions urbaines.",
    },
    en: {
      label: "Spring",
      humidity: "Transition · urban pollution · pollen",
      note: "A transition season. Rebalance and protect against urban stressors.",
    },
    boostTraits: { antioxidant: 1, soothing: 1, hydrating: 1 },
    boostConcerns: { redness: 1, dullness: 1 },
    demoteTraits: [],
  },
  summer: {
    key: "summer",
    emoji: "☀️",
    fr: {
      label: "Été",
      humidity: "UV élevés · chaleur · sébum · pollution",
      note: "UV, chaleur et pollution dominent. On privilégie les antioxydants, les textures légères et le contrôle du sébum.",
    },
    en: {
      label: "Summer",
      humidity: "High UV · heat · sebum · pollution",
      note: "UV, heat and pollution dominate. Favor antioxidants, light textures and oil control.",
    },
    boostTraits: { antioxidant: 2, oilControl: 1, brightening: 1 },
    boostConcerns: { dullness: 1, acne: 1, pigmentation: 2, pores: 1 },
    demoteTraits: ["occlusive"],
  },
  autumn: {
    key: "autumn",
    emoji: "🍂",
    fr: {
      label: "Automne",
      humidity: "Reprise du chauffage · baisse d'humidité",
      note: "On répare les dégâts de l'été et on prépare la barrière pour l'hiver.",
    },
    en: {
      label: "Autumn",
      humidity: "Heating resumes · dropping humidity",
      note: "Repair summer damage and prepare the barrier for winter.",
    },
    boostTraits: { barrier: 1, hydrating: 1, brightening: 1 },
    boostConcerns: { dehydration: 1, pigmentation: 1, barrier: 1 },
    demoteTraits: [],
  },
};

/** Northern-hemisphere meteorological seasons (Paris). */
export function getParisSeason(date: Date = new Date()): Season {
  const m = date.getMonth(); // 0 = Jan
  if (m === 11 || m <= 1) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
}

export function getSeasonInfo(date?: Date): SeasonInfo {
  return SEASONS[getParisSeason(date)];
}

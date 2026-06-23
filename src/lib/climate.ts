/* ============================================================
   FIOMIO — climate context
   The core differentiator: we recommend for the weather the skin
   will actually face when the products ARRIVE (≈ J+7 shipping),
   not today's weather. Real forecast → ingredient-trait biases.
   Falls back to a seasonal estimate if the forecast is unavailable.
   ============================================================ */

import type { TraitKey, ConcernKey } from "./ingredients";
import { getSeasonInfo } from "./season";

export type ClimateMetrics = {
  tempC: number;
  humidity: number;
  uv: number;
  precipMm: number;
};

export type ClimateContext = {
  source: "forecast" | "season";
  emoji: string;
  city?: string; // resolved location label (the user's city)
  deliveryFrom?: string; // ISO yyyy-mm-dd
  deliveryTo?: string;
  metrics?: ClimateMetrics;
  /** short tag used as a "matched reason" chip */
  chip: { fr: string; en: string };
  fr: { label: string; detail: string; note: string };
  en: { label: string; detail: string; note: string };
  boostTraits: Partial<Record<TraitKey, number>>;
  boostConcerns: Partial<Record<ConcernKey, number>>;
  demoteTraits: TraitKey[];
};

function bump<T extends string>(m: Partial<Record<T, number>>, k: T, v: number) {
  m[k] = (m[k] ?? 0) + v;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildNote(humidity: number, tempC: number, uv: number) {
  if (humidity < 45)
    return {
      fr: "Air sec à la réception : priorité à la réparation de la barrière et à l'hydratation.",
      en: "Dry air on delivery: prioritize barrier repair and hydration.",
    };
  if (uv >= 6)
    return {
      fr: "UV élevés cette semaine-là : antioxydants le matin et protection solaire renforcée.",
      en: "High UV that week: antioxidants in the morning and stronger sun protection.",
    };
  if (humidity > 70)
    return {
      fr: "Air humide : textures légères et contrôle du sébum plutôt que des soins occlusifs.",
      en: "Humid air: light textures and oil control rather than occlusive care.",
    };
  if (tempC < 8)
    return {
      fr: "Temps frais : on renforce la barrière contre le froid et le chauffage.",
      en: "Cool weather: reinforce the barrier against cold and indoor heating.",
    };
  return {
    fr: "Conditions modérées : on entretient l'équilibre, l'hydratation et l'éclat.",
    en: "Moderate conditions: maintain balance, hydration and glow.",
  };
}

/** Map real forecast metrics for the delivery window → trait/concern biases. */
export function deriveClimate(
  metrics: ClimateMetrics,
  from: string,
  to: string,
  city?: string,
): ClimateContext {
  const { tempC, humidity, uv } = metrics;
  const boostTraits: Partial<Record<TraitKey, number>> = {};
  const boostConcerns: Partial<Record<ConcernKey, number>> = {};
  const demoteTraits: TraitKey[] = [];

  let humFr: string, humEn: string;
  if (humidity < 45) {
    humFr = "air sec";
    humEn = "dry air";
    bump(boostTraits, "hydrating", 2);
    bump(boostTraits, "barrier", 2);
    bump(boostTraits, "occlusive", 1);
    bump(boostTraits, "soothing", 1);
    bump(boostConcerns, "dehydration", 2);
    bump(boostConcerns, "barrier", 2);
  } else if (humidity > 70) {
    humFr = "air humide";
    humEn = "humid air";
    bump(boostTraits, "oilControl", 1);
    demoteTraits.push("occlusive");
  } else {
    humFr = "humidité modérée";
    humEn = "moderate humidity";
    bump(boostTraits, "hydrating", 1);
  }

  let tempFr: string, tempEn: string;
  if (tempC < 8) {
    tempFr = "frais";
    tempEn = "cold";
    bump(boostTraits, "barrier", 1);
    bump(boostTraits, "soothing", 1);
    bump(boostConcerns, "dehydration", 1);
    bump(boostConcerns, "redness", 1);
  } else if (tempC > 25) {
    tempFr = "chaud";
    tempEn = "hot";
    bump(boostTraits, "oilControl", 1);
    bump(boostTraits, "antioxidant", 1);
    bump(boostConcerns, "acne", 1);
    if (!demoteTraits.includes("occlusive")) demoteTraits.push("occlusive");
  } else if (tempC > 18) {
    tempFr = "tempéré";
    tempEn = "mild";
  } else {
    tempFr = "doux";
    tempEn = "cool";
  }

  let uvFr = "";
  let uvEn = "";
  if (uv >= 6) {
    uvFr = " · UV élevés";
    uvEn = " · high UV";
    bump(boostTraits, "antioxidant", 2);
    bump(boostTraits, "brightening", 1);
    bump(boostConcerns, "pigmentation", 2);
  } else if (uv >= 3) {
    bump(boostTraits, "antioxidant", 1);
    bump(boostConcerns, "pigmentation", 1);
  }

  // dominant descriptor → short chip
  let chip: { fr: string; en: string };
  if (humidity < 45) chip = { fr: "Air sec", en: "Dry air" };
  else if (uv >= 6) chip = { fr: "UV élevés", en: "High UV" };
  else if (humidity > 70) chip = { fr: "Air humide", en: "Humid air" };
  else if (tempC < 8) chip = { fr: "Temps frais", en: "Cool" };
  else chip = { fr: "Climat J+7", en: "D+7 climate" };

  const note = buildNote(humidity, tempC, uv);
  const t = Math.round(tempC);
  const h = Math.round(humidity);
  const u = Math.round(uv);

  return {
    source: "forecast",
    emoji: uv >= 6 ? "☀️" : humidity < 45 ? "🌬️" : tempC < 8 ? "❄️" : "🌤️",
    city,
    deliveryFrom: from,
    deliveryTo: to,
    metrics: { tempC, humidity, uv, precipMm: metrics.precipMm },
    chip,
    fr: {
      label: `${cap(humFr)}, ${tempFr}${uvFr}`,
      detail: `~${t}°C · humidité ${h}% · UV ${u}`,
      note: note.fr,
    },
    en: {
      label: `${cap(humEn)}, ${tempEn}${uvEn}`,
      detail: `~${t}°C · humidity ${h}% · UV ${u}`,
      note: note.en,
    },
    boostTraits,
    boostConcerns,
    demoteTraits,
  };
}

/** Seasonal fallback when the live forecast can't be reached. */
export function seasonFallbackClimate(
  date?: Date,
  city?: string,
  lat?: number,
): ClimateContext {
  const s = getSeasonInfo(date, lat);
  return {
    source: "season",
    emoji: s.emoji,
    city,
    chip: { fr: s.fr.label, en: s.en.label },
    fr: { label: s.fr.label, detail: s.fr.humidity, note: s.fr.note },
    en: { label: s.en.label, detail: s.en.humidity, note: s.en.note },
    boostTraits: s.boostTraits,
    boostConcerns: s.boostConcerns,
    demoteTraits: s.demoteTraits,
  };
}

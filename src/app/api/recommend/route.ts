// POST /api/recommend
// Generates a personalised FR/EN skin note via Claude for the top-3 recommended
// ingredients. Called client-side after runDiagnostic() renders the cards.
// Returns { note: { fr, en } } or { note: null } when no API key is set.

import Anthropic from "@anthropic-ai/sdk";
import { retrieveIngredientContext } from "@/lib/rag";

export const runtime = "nodejs";

/** GET /api/recommend — reports whether the LLM layer is active */
export function GET() {
  return Response.json({ llmEnabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}

// ── French labels for internal keys ──────────────────────────────────────────

const SKIN_TYPE_FR: Record<string, string> = {
  dry:         "peau sèche",
  combination: "peau mixte",
  oily:        "peau grasse",
  normal:      "peau normale",
};

const CONCERN_FR: Record<string, string> = {
  redness:      "rougeurs",
  dehydration:  "déshydratation",
  dullness:     "manque d'éclat",
  aging:        "anti-âge",
  acne:         "imperfections",
  pores:        "pores dilatés",
  barrier:      "barrière cutanée fragilisée",
  pigmentation: "taches pigmentaires",
};

const ACTIVE_FR: Record<string, string> = {
  retinoid:   "rétinoïde",
  exfoliant:  "exfoliant",
  vitc:       "vitamine C",
  none:       "",
};

const AGE_FR: Record<string, string> = {
  u25:    "moins de 25 ans",
  a25_34: "25-34 ans",
  a35_44: "35-44 ans",
  a45p:   "45 ans et plus",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Body = {
  input: {
    skinType: string;
    sensitive: boolean;
    concerns: string[];
    activeUse: string;
    ageRange: string;
    pregnancy: string;
  };
  climate: {
    fr?: { label?: string; detail?: string };
    en?: { label?: string; detail?: string };
    city?: string;
  } | null;
  top3: Array<{ fr: string; en: string }>;
};

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ note: null });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ note: null }, { status: 400 });
  }

  const { input, climate, top3 } = body;

  // ── Build French context ───────────────────────────────────────────────────
  const skinTypeFr   = SKIN_TYPE_FR[input.skinType] ?? input.skinType;
  const sensitiveFr  = input.sensitive ? " sensible" : "";
  const concernsFr   = input.concerns.map((c) => CONCERN_FR[c] ?? c).join(", ");
  const activeFr     = ACTIVE_FR[input.activeUse];
  const activeLine   = activeFr ? `Actif en cours d'utilisation : ${activeFr}` : "";
  const ageFr        = AGE_FR[input.ageRange] ?? "";
  const pregnancyFr  = input.pregnancy === "pregnant"
    ? " (enceinte, sécurité des ingrédients prioritaire)"
    : input.pregnancy === "trying" ? " (essaie de concevoir)" : "";

  const cityFr      = climate?.city ?? "";
  const weatherFr   = (climate?.fr?.label ?? climate?.en?.label)
    ? `Météo prévue à la livraison${cityFr ? ` (${cityFr})` : ""} : ${climate?.fr?.label ?? climate?.en?.label}, ${climate?.fr?.detail ?? climate?.en?.detail}.`
    : "";

  const ingredientsFr = top3.map((n) => n.fr).join(", ");
  const ingredientsEn = top3.map((n) => n.en).join(", ");

  // ── Build English context (for EN note) ───────────────────────────────────
  const skinTypeEn  = input.skinType;
  const sensitiveEn = input.sensitive ? " sensitive" : "";
  const concernsEn  = input.concerns.join(", ");
  const weatherEn   = climate?.en?.label
    ? `Forecast: ${climate.en.label}, ${climate.en.detail}.`
    : "";

  // RAG: retrieve relevant ingredient science from Supabase (if configured)
  const ragQuery = `${skinTypeFr} ${sensitiveFr} ${concernsFr} ${ingredientsFr}`.trim();
  const ragContext = await retrieveIngredientContext(
    ragQuery,
    input.pregnancy !== "none"
  );

  try {
    const client = new Anthropic({ apiKey: key });

    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: `Tu es la conseillère experte en K-beauty de Fiomio.
Tu t'adresses toujours à la cliente avec le vouvoiement (vous, votre, vos), jamais le tutoiement.
Tu parles en français authentique, comme une dermatologue bienveillante et experte.
Tu connais les actifs cosmétiques en profondeur et tu adaptes tes conseils à la peau et à la météo.
Quand des données scientifiques te sont fournies, utilise-les pour enrichir ta réponse avec des détails précis et crédibles.`,
      messages: [
        {
          role: "user",
          content: `Écris une note personnalisée pour cette cliente Fiomio.
Renvoie UNIQUEMENT un objet JSON de cette forme exacte : {"fr": "...", "en": "..."}
Aucun autre texte, aucun markdown.

Profil
Type de peau : ${skinTypeFr}${sensitiveFr}${pregnancyFr}
Préoccupations : ${concernsFr}
Tranche d'âge : ${ageFr}
${activeLine}
${weatherFr}

Ingrédients recommandés
FR : ${ingredientsFr}
EN : ${ingredientsEn}
${ragContext}
Instructions :
• "fr" : 2-3 phrases en français naturel et chaleureux, TOUJOURS avec le vouvoiement (vous/votre/vos). Explique pourquoi ces trois ingrédients fonctionnent ensemble pour CE profil et CETTE météo. Si des données scientifiques sont disponibles ci-dessus, mentionne un fait précis (sans citer la source). Jamais générique.
• "en" : même message en anglais, même ton, même niveau de détail.
• Ton : experte bienveillante, pas clinique, pas commercial.
• N'utilise jamais de tiret cadratin (—) ni de tiret demi-cadratin; sépare par une virgule, un point ou deux points.
• Si enceinte, rassure sur la sécurité des ingrédients choisis.`,
        },
      ],
    });

    const raw   = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ note: null });

    const note = JSON.parse(match[0]) as { fr: string; en: string };
    return Response.json({ note });
  } catch {
    return Response.json({ note: null });
  }
}

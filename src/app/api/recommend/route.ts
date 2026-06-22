// POST /api/recommend
// Generates a personalised FR/EN skin note via Claude for the top-3 recommended
// ingredients. Called client-side after runDiagnostic() renders the cards.
// Returns { note: { fr, en } } or { note: null } when no API key is set.

import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

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
    en?: { label?: string; detail?: string };
    city?: string;
  } | null;
  top3: Array<{ fr: string; en: string }>;
};

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

  const ingredientsFr = top3.map((n) => n.fr).join(", ");
  const ingredientsEn = top3.map((n) => n.en).join(", ");
  const concernsStr   = input.concerns.join(", ");
  const pregnancyNote = input.pregnancy !== "none" ? " (enceinte — sécurité prioritaire / pregnant — safety first)" : "";
  const sensitiveNote = input.sensitive ? " sensible/sensitive" : "";
  const weatherCtx    = climate?.en?.label
    ? `Forecast for delivery window: ${climate.en.label} — ${climate.en.detail}.`
    : "";

  try {
    const client = new Anthropic({ apiKey: key });

    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 320,
      messages: [
        {
          role: "user",
          content: `You are Fiomio's expert K-beauty skin advisor.
Write a warm, personalised 2-3 sentence skin note for this customer.
Return ONLY a JSON object with this exact shape: {"fr": "...", "en": "..."}
Each value is the complete note in that language. No other text, no markdown.

Profile: ${input.skinType}${sensitiveNote} skin${pregnancyNote}
Concerns: ${concernsStr}
${weatherCtx}
Recommended ingredients — FR: ${ingredientsFr} / EN: ${ingredientsEn}

Be specific about WHY these three work together for this exact skin profile and climate.
Tone: warm, expert friend — not clinical. 2-3 sentences per language.`,
        },
      ],
    });

    const raw = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ note: null });

    const note = JSON.parse(match[0]) as { fr: string; en: string };
    return Response.json({ note });
  } catch {
    return Response.json({ note: null });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Data flywheel v1 — stores each completed diagnostic ANONYMOUSLY (no email,
 * no IP) so the recommendation engine can improve from real usage over time:
 * which profiles ask for what, in which city/season, and which actives we
 * surface. This is the proprietary dataset behind the moat.
 *
 * Storage is best-effort and never blocks the user: Supabase if configured,
 * else a generic webhook, else a no-op. Always returns ok.
 */
type Body = {
  diagId?: string;
  skinType?: string;
  sensitive?: boolean;
  concerns?: string[];
  activeUse?: string;
  gender?: string;
  pregnancy?: string;
  city?: string;
  region?: string;
  tempC?: number;
  humidity?: number;
  uv?: number;
  season?: string;
  recommended?: string[];
  recommendations?: { active_id?: string; score?: number; rank?: number }[];
  anonId?: string;
  sessionId?: string;
  engineVersion?: string;
  schemaVersion?: string;
  lang?: string;
};

const str = (v: unknown, max = 60) =>
  typeof v === "string" ? v.slice(0, max) : null;
const arr = (v: unknown, max = 8) =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, max) : [];

// structured, scored, ranked recommendations for learning-to-rank later
const recs = (v: unknown, max = 12) =>
  Array.isArray(v)
    ? v
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .slice(0, max)
        .map((x) => ({
          active_id: typeof x.active_id === "string" ? x.active_id.slice(0, 40) : null,
          score: typeof x.score === "number" ? x.score : null,
          rank: typeof x.rank === "number" ? Math.round(x.rank) : null,
        }))
    : null;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true }); // never block the UX
  }

  // anonymous record — deliberately no email / no IP
  const record = {
    diag_id: str(body.diagId, 40),
    skin_type: str(body.skinType, 20),
    sensitive: typeof body.sensitive === "boolean" ? body.sensitive : null,
    concerns: arr(body.concerns),
    active_use: str(body.activeUse, 20),
    gender: str(body.gender, 20),
    pregnancy: str(body.pregnancy, 20),
    city: str(body.city, 80),
    region: str(body.region, 80),
    season: str(body.season, 40),
    temp_c: typeof body.tempC === "number" ? body.tempC : null,
    humidity: typeof body.humidity === "number" ? body.humidity : null,
    uv: typeof body.uv === "number" ? body.uv : null,
    recommended: arr(body.recommended),
    recommendations: recs(body.recommendations),
    anon_id: str(body.anonId, 64),
    session_id: str(body.sessionId, 64),
    engine_version: str(body.engineVersion, 20),
    schema_version: str(body.schemaVersion, 10),
    lang: body.lang === "en" ? "en" : "fr",
    created_at: new Date().toISOString(),
  };

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.from("diagnostics").insert(record);
      if (error) console.error("[diagnostic] supabase insert:", error.message);
    } catch (err) {
      console.error("[diagnostic] supabase failed:", err);
    }
    return NextResponse.json({ ok: true });
  }

  const webhook = process.env.DIAGNOSTIC_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error("[diagnostic] webhook failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Outcome loop — captures whether a recommendation felt right (and, later, an
 * optional reason). Linked to the anonymous diagnostic via `diagId` so we can
 * learn which profiles/actives land well. No email / no IP. Best-effort.
 */
type Body = {
  diagId?: string;
  helpful?: boolean;
  recommended?: string[];
  note?: string;
  lang?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (typeof body.helpful !== "boolean") {
    return NextResponse.json({ ok: true });
  }

  const record = {
    diag_id: typeof body.diagId === "string" ? body.diagId.slice(0, 40) : null,
    helpful: body.helpful,
    recommended: Array.isArray(body.recommended)
      ? body.recommended.filter((x) => typeof x === "string").slice(0, 8)
      : [],
    note: typeof body.note === "string" ? body.note.slice(0, 280) : null,
    lang: body.lang === "en" ? "en" : "fr",
    created_at: new Date().toISOString(),
  };

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.from("feedback").insert(record);
      if (error) console.error("[feedback] supabase insert:", error.message);
    } catch (err) {
      console.error("[feedback] supabase failed:", err);
    }
    return NextResponse.json({ ok: true });
  }

  const webhook =
    process.env.FEEDBACK_WEBHOOK_URL ?? process.env.DIAGNOSTIC_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "feedback", ...record }),
      });
    } catch (err) {
      console.error("[feedback] webhook failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}

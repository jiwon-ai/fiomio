import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Data flywheel — stores each logged product ANONYMOUSLY (no email, no IP):
 * the product's INCI list + whether the user's skin tolerated it. Aggregated,
 * this is the proprietary "ingredient × outcome" dataset that powers the
 * personal-elimination engine and is sellable to brands. Best-effort: Supabase
 * if configured, else a webhook, else a no-op. Always returns ok.
 */
type Body = {
  scanId?: string;
  barcode?: string;
  name?: string;
  brand?: string;
  inci?: string[];
  verdict?: string;
  lang?: string;
};

const str = (v: unknown, max = 80) =>
  typeof v === "string" ? v.slice(0, max) : null;
const arr = (v: unknown, max = 60) =>
  Array.isArray(v)
    ? v.filter((x) => typeof x === "string").map((x) => x.slice(0, 60)).slice(0, max)
    : [];

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // anonymous record — deliberately no email / no IP
  const record = {
    scan_id: str(body.scanId, 40),
    barcode: str(body.barcode, 20),
    name: str(body.name, 120),
    brand: str(body.brand, 80),
    inci: arr(body.inci),
    verdict: body.verdict === "bad" ? "bad" : body.verdict === "good" ? "good" : null,
    lang: body.lang === "en" ? "en" : "fr",
    created_at: new Date().toISOString(),
  };
  if (!record.verdict || record.inci.length === 0) {
    return NextResponse.json({ ok: true }); // nothing useful to store
  }

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.from("product_scans").insert(record);
      if (error) console.error("[scan] supabase insert:", error.message);
    } catch (err) {
      console.error("[scan] supabase failed:", err);
    }
    return NextResponse.json({ ok: true });
  }

  const webhook = process.env.SCAN_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error("[scan] webhook failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}

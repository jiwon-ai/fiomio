import { NextResponse } from "next/server";
import { getSeason } from "@/lib/season";
import { buildSeasonalEmail } from "@/lib/season-email";
import type { Lang } from "@/lib/locale";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Retention engine — runs weekly (Vercel Cron). For each subscriber it computes
 * the season at THEIR location (hemisphere-aware) and, when the season has just
 * changed since we last emailed them, sends a short hyper-local routine update
 * via Brevo. LAST_SEASON guards against duplicates. Best-effort + idempotent.
 *
 * Secure with CRON_SECRET (Vercel sends it as `Authorization: Bearer …`).
 * Requires Brevo contact attributes: CITY, LAT, LON, LANG, LAST_SEASON.
 */
const BREVO = "https://api.brevo.com/v3";
const num = (v: unknown) =>
  typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.BREVO_API_KEY;
  if (!key) return NextResponse.json({ ok: true, skipped: "no_brevo_key" });

  const sender = {
    name: "Fiomio",
    email: process.env.NEWSLETTER_FROM || "hello@fiomio.io",
  };
  const headers = {
    "api-key": key,
    "Content-Type": "application/json",
    accept: "application/json",
  };

  let processed = 0;
  let sent = 0;
  const errors: string[] = [];

  try {
    // v1: a single batch (newest 500 contacts). Paginate later as the list grows.
    const res = await fetch(`${BREVO}/contacts?limit=500&sort=desc`, { headers });
    if (!res.ok) throw new Error(`contacts ${res.status}`);
    const data = (await res.json()) as {
      contacts?: Array<{ email: string; attributes?: Record<string, unknown> }>;
    };
    const contacts = data.contacts ?? [];

    for (const c of contacts) {
      processed++;
      const a = c.attributes ?? {};
      const lat = num(a.LAT);
      const season = getSeason(new Date(), Number.isFinite(lat) ? lat : undefined);
      const last = typeof a.LAST_SEASON === "string" ? a.LAST_SEASON : "";
      if (last === season) continue; // already greeted for this season

      const lang: Lang = a.LANG === "en" ? "en" : "fr";
      const city = typeof a.CITY === "string" ? a.CITY : undefined;
      const { subject, html } = buildSeasonalEmail(lang, season, city);

      const sendRes = await fetch(`${BREVO}/smtp/email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender,
          to: [{ email: c.email }],
          subject,
          htmlContent: html,
        }),
      });
      if (!sendRes.ok) {
        errors.push(`send ${c.email}: ${sendRes.status}`);
        continue;
      }
      sent++;

      // mark the season so we don't email again until it changes
      await fetch(`${BREVO}/contacts/${encodeURIComponent(c.email)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ attributes: { LAST_SEASON: season } }),
      }).catch(() => {});
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, processed, sent, error: String(err) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, processed, sent, errors: errors.slice(0, 10) });
}

import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = { email?: string; lang?: string; source?: string };

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const entry = {
    email,
    lang: body.lang === "en" ? "en" : "fr",
    source: body.source ?? "landing",
    at: new Date().toISOString(),
  };

  // 1) Brevo (collect + store contacts; send from Brevo's free tier later,
  //    or export the list to any other ESP — no lock-in). Set BREVO_API_KEY
  //    (+ optional BREVO_LIST_ID) in the Vercel env.
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey) {
    try {
      const listId = process.env.BREVO_LIST_ID;
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email,
          updateEnabled: true, // 204 instead of error if already a contact
          ...(listId ? { listIds: [Number(listId)] } : {}),
        }),
      });
      // 201 created / 204 updated are both res.ok. A 400 "duplicate_parameter"
      // just means the email is already on file → still a success for our UX.
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        if (!txt.includes("duplicate_parameter")) {
          throw new Error(`brevo ${res.status} ${txt}`);
        }
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[waitlist] brevo failed:", err);
      // TEMP DEBUG: surface the upstream reason (401 bad key / 400 bad list) so
      // we can pinpoint a misconfigured env var. Remove once verified.
      const detail = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: "provider_error", detail }, { status: 502 });
    }
  }

  // 2) Generic webhook fallback (Google Sheet, Zapier/Make, Formspree, etc.).
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[waitlist] webhook failed:", err);
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
    }
  }

  // 2) Dev fallback: append to a local JSON file. (No-op on read-only
  //    serverless filesystems — configure WAITLIST_WEBHOOK_URL for prod.)
  try {
    const dir = path.join(process.cwd(), "data");
    const file = path.join(dir, "waitlist.json");
    await fs.mkdir(dir, { recursive: true });
    let list: unknown[] = [];
    try {
      list = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      /* first write */
    }
    list.push(entry);
    await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    // Don't fail the UX over a storage hiccup; the lead is logged below.
    console.warn("[waitlist] local store skipped:", err);
  }

  console.log("[waitlist] new signup:", entry.email, `(${entry.lang})`);
  return NextResponse.json({ ok: true });
}

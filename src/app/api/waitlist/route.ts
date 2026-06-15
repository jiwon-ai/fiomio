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

  // 1) Beehiiv (collect + send the newsletter). Set BEEHIIV_API_KEY +
  //    BEEHIIV_PUBLICATION_ID (pub_xxxx) in the Vercel env.
  const beehiivKey = process.env.BEEHIIV_API_KEY;
  const beehiivPub = process.env.BEEHIIV_PUBLICATION_ID;
  if (beehiivKey && beehiivPub) {
    try {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${beehiivPub}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${beehiivKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: "fiomio",
            utm_medium: entry.source,
            referring_site: "fiomio.io",
          }),
        },
      );
      // 409 = already subscribed → still a success for our UX.
      if (!res.ok && res.status !== 409) throw new Error(`beehiiv ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[waitlist] beehiiv failed:", err);
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
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

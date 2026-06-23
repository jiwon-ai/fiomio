import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  email?: string;
  lang?: string;
  source?: string;
  city?: string;
  lat?: number;
  lon?: number;
};

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

  const city = (body.city ?? "").trim().slice(0, 80) || undefined;
  const lat = typeof body.lat === "number" ? body.lat : undefined;
  const lon = typeof body.lon === "number" ? body.lon : undefined;

  const entry = {
    email,
    lang: body.lang === "en" ? "en" : "fr",
    source: body.source ?? "landing",
    city,
    lat,
    lon,
    at: new Date().toISOString(),
  };

  // 1) Brevo (collect + store contacts; send from Brevo's free tier later,
  //    or export the list to any other ESP — no lock-in). Set BREVO_API_KEY
  //    (+ optional BREVO_LIST_ID) in the Vercel env.
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey) {
    try {
      // Default to list 2 ("Votre première liste") so signups always land in a
      // list; override with BREVO_LIST_ID env if you create a dedicated one.
      const listId = process.env.BREVO_LIST_ID || "2";
      const attributes: Record<string, string | number> = {};
      if (city) attributes.CITY = city;
      if (lat !== undefined) attributes.LAT = lat;
      if (lon !== undefined) attributes.LON = lon;

      const postContact = (withAttrs: boolean) =>
        fetch("https://api.brevo.com/v3/contacts", {
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
            ...(withAttrs && Object.keys(attributes).length
              ? { attributes }
              : {}),
          }),
        });

      let res = await postContact(true);
      // 201 created / 204 updated are both res.ok. A 400 "duplicate_parameter"
      // just means the email is already on file → still a success for our UX.
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        // If the CITY/LAT/LON attributes aren't defined in Brevo yet, don't
        // lose the signup — retry without attributes (create the "CITY" text
        // attribute in Brevo to start segmenting by city).
        if (/attribute/i.test(txt) && Object.keys(attributes).length) {
          res = await postContact(false);
          if (!res.ok) {
            const t2 = await res.text().catch(() => "");
            if (!t2.includes("duplicate_parameter")) {
              throw new Error(`brevo ${res.status} ${t2}`);
            }
          }
        } else if (!txt.includes("duplicate_parameter")) {
          throw new Error(`brevo ${res.status} ${txt}`);
        }
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[waitlist] brevo failed:", err);
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

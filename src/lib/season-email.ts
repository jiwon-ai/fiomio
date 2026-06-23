/* ============================================================
   FIOMIO — seasonal newsletter builder (server)
   Turns a subscriber's season into a short, hyper-local email:
   the season at their city + a few K-beauty actives that fit it.
   This is the retention engine behind "we send it before the
   season turns, not after."
   ============================================================ */

import { SEASONS, type Season } from "./season";
import { INGREDIENTS } from "./ingredients";
import type { Lang } from "./locale";

const SITE = "https://fiomio.io";

/** Pick the 3 actives that best fit the season's boosted traits. */
function picksForSeason(season: Season) {
  const boosted = Object.keys(SEASONS[season].boostTraits);
  const scored = INGREDIENTS.map((ing) => ({
    ing,
    score: ing.traits.filter((tr) => boosted.includes(tr)).length,
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return (scored.length ? scored : INGREDIENTS.map((ing) => ({ ing, score: 0 })))
    .slice(0, 3)
    .map((x) => x.ing);
}

export function buildSeasonalEmail(
  lang: Lang,
  season: Season,
  city?: string,
): { subject: string; html: string } {
  const s = SEASONS[season];
  const label = s[lang].label;
  const note = s[lang].note;
  const where = city || (lang === "fr" ? "votre ville" : "your city");
  const picks = picksForSeason(season);

  const subject =
    lang === "fr"
      ? `${label} arrive à ${where} — votre routine`
      : `${label} is coming to ${where} — your routine`;

  const intro =
    lang === "fr"
      ? `La saison change à <strong>${where}</strong>. Voici les actifs à privilégier pour votre peau dans les semaines à venir.`
      : `The season is turning in <strong>${where}</strong>. Here are the actives to prioritize for your skin in the coming weeks.`;

  const ctaLabel = lang === "fr" ? "Refaire mon diagnostic" : "Re-run my diagnostic";
  const unsub =
    lang === "fr"
      ? "Vous recevez cet e-mail car vous êtes inscrite à Fiomio. Désinscription en un clic."
      : "You're receiving this because you joined Fiomio. Unsubscribe in one click.";

  const items = picks
    .map(
      (ing) => `
      <tr>
        <td style="padding:14px 0;border-top:1px solid #e3e7dd;">
          <div style="font:600 16px/1.3 Arial,Helvetica,sans-serif;color:#0f2b31;">${ing.name[lang]}</div>
          <div style="font:400 13px/1.4 Arial,Helvetica,sans-serif;color:#5f6b66;margin-top:2px;">${ing.tag[lang]}</div>
          <div style="font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#333b38;margin-top:6px;">${ing.why[lang]}</div>
        </td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f6f7f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f2;padding:28px 0;">
    <tr><td align="center">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;background:#fbfbf6;border:1px solid #e3e7dd;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;">
          <div style="font:700 22px/1 Arial,Helvetica,sans-serif;color:#0f2b31;letter-spacing:-0.5px;">fiomio<span style="color:#cbef4d;">.</span></div>
        </td></tr>
        <tr><td style="padding:8px 32px 0;">
          <div style="font:600 11px/1 Arial,Helvetica,sans-serif;color:#2f6b4f;text-transform:uppercase;letter-spacing:2px;">${label} · ${where}</div>
          <h1 style="font:600 26px/1.2 Arial,Helvetica,sans-serif;color:#0f2b31;margin:12px 0 0;">${subject}</h1>
          <p style="font:400 15px/1.55 Arial,Helvetica,sans-serif;color:#333b38;margin:14px 0 0;">${intro}</p>
          <p style="font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#5f6b66;margin:10px 0 0;">${note}</p>
        </td></tr>
        <tr><td style="padding:18px 32px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
        </td></tr>
        <tr><td style="padding:18px 32px 28px;">
          <a href="${SITE}/#diagnostic" style="display:inline-block;background:#cbef4d;color:#0f2b31;font:600 14px Arial,Helvetica,sans-serif;text-decoration:none;padding:12px 22px;border-radius:999px;">${ctaLabel} →</a>
          <p style="font:400 11px/1.5 Arial,Helvetica,sans-serif;color:#88938d;margin:20px 0 0;">${unsub}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;

  return { subject, html };
}

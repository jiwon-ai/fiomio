/* ============================================================
   FIOMIO — affiliate link builder
   Three layers, in priority order:
   1. Awin DEEPLINK for merchants where we have a DIRECT Awin
      program (highest, reliable commission). Stylevana FR is live.
   2. Direct ?param= tag for non-Awin programs (Amazon, etc.),
      enabled once their tag env is set.
   3. Everything else is left raw for the site-wide Sovrn script
      (layout.tsx) to auto-affiliate across its 50k+ network.

   IDs below are public (not secrets): the Awin publisher id and
   merchant ids appear in every outbound link anyway. Override via
   env if needed.
   ============================================================ */

// Awin publisher (affiliate) id. Public.
const AWIN_AFFID = process.env.NEXT_PUBLIC_AWIN_AFFID ?? "2935207";

// host -> Awin merchant id (awinmid) for our APPROVED direct programs.
const AWIN_MERCHANTS: Record<string, string> = {
  "stylevana.com": process.env.NEXT_PUBLIC_AWIN_MID_STYLEVANA ?? "23223",
};

// Non-Awin direct programs (append our tag as a query param). Empty tag = skip.
const TAGS = {
  amazon: process.env.NEXT_PUBLIC_AFF_AMAZON ?? "",
  yesstyle: process.env.NEXT_PUBLIC_AFF_YESSTYLE ?? "",
  iherb: process.env.NEXT_PUBLIC_AFF_IHERB ?? "",
} as const;

type Partner = { name: string; hosts: string[]; tag: string; param: string };

const PARTNERS: Partner[] = [
  { name: "Amazon", hosts: ["amazon.fr", "amazon.de", "amazon.es", "amazon.it", "amazon.co.uk", "amazon.com"], tag: TAGS.amazon, param: "tag" },
  { name: "YesStyle", hosts: ["yesstyle.com"], tag: TAGS.yesstyle, param: "rco" },
  { name: "iHerb", hosts: ["iherb.com"], tag: TAGS.iherb, param: "rcode" },
];

function awinDeeplink(mid: string, dest: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(dest)}`;
}

/** Turn a product URL into an affiliate link.
 *  Awin merchants -> deeplink; direct partners -> our tag; else raw (Sovrn). */
export function buildAffiliateLink(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");

    // 1. Awin direct merchant -> deeplink (priority, best commission)
    const mid = Object.entries(AWIN_MERCHANTS).find(
      ([h]) => host === h || host.endsWith(`.${h}`),
    )?.[1];
    if (mid && AWIN_AFFID) return awinDeeplink(mid, rawUrl);

    // 2. Non-Awin direct partner with a configured tag
    const partner = PARTNERS.find((p) =>
      p.hosts.some((h) => host === h || host.endsWith(`.${h}`)),
    );
    if (partner && partner.tag) {
      url.searchParams.set(partner.param, partner.tag);
      return url.toString();
    }

    // 3. Raw -> Sovrn auto-affiliates it
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/** Configured direct partners (for docs/diagnostics). */
export const directPartners = [
  ...Object.keys(AWIN_MERCHANTS).map((h) => `Awin:${h}`),
  ...PARTNERS.filter((p) => p.tag).map((p) => p.name),
];

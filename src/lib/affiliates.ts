/* ============================================================
   FIOMIO — affiliate link builder
   Two layers:
   1. Sovrn (the site-wide script in layout.tsx) auto-affiliates
      everything in its 50k+ merchant network. Long-tail, zero work.
   2. For the few KEY retailers where we have a DIRECT program
      (higher commission), we OVERRIDE here by appending our own
      affiliate tag. Set tags via env; leave empty and the raw URL
      is used (Sovrn still affiliates it).

   NOTE: the exact query param differs per program. Adjust `param`
   below to match each program's instructions when you sign up.
   ============================================================ */

// Static env refs (Next.js inlines NEXT_PUBLIC_* at build time).
const TAGS = {
  amazon: process.env.NEXT_PUBLIC_AFF_AMAZON ?? "",
  yesstyle: process.env.NEXT_PUBLIC_AFF_YESSTYLE ?? "",
  stylevana: process.env.NEXT_PUBLIC_AFF_STYLEVANA ?? "",
  iherb: process.env.NEXT_PUBLIC_AFF_IHERB ?? "",
} as const;

type Partner = {
  name: string;
  hosts: string[];
  tag: string;
  param: string; // query param the program uses for the affiliate id
};

const PARTNERS: Partner[] = [
  {
    name: "Amazon",
    hosts: ["amazon.fr", "amazon.de", "amazon.es", "amazon.it", "amazon.co.uk", "amazon.com"],
    tag: TAGS.amazon,
    param: "tag", // Amazon Associates store id, e.g. "fiomio-21"
  },
  {
    name: "YesStyle",
    hosts: ["yesstyle.com"],
    tag: TAGS.yesstyle,
    param: "rco", // adjust to your YesStyle program's referral param
  },
  {
    name: "Stylevana",
    hosts: ["stylevana.com"],
    tag: TAGS.stylevana,
    param: "aff", // adjust per Stylevana / network program
  },
  {
    name: "iHerb",
    hosts: ["iherb.com"],
    tag: TAGS.iherb,
    param: "rcode", // iHerb rewards / referral code
  },
];

/** Turn a product URL into an affiliate link. Direct partners get our tag;
 *  everything else is left raw for Sovrn's script to auto-affiliate. */
export function buildAffiliateLink(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    const partner = PARTNERS.find((p) =>
      p.hosts.some((h) => host === h || host.endsWith(`.${h}`)),
    );
    if (partner && partner.tag) {
      url.searchParams.set(partner.param, partner.tag);
      return url.toString();
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/** Which direct partners are configured (for docs/diagnostics). */
export const directPartners = PARTNERS.filter((p) => p.tag).map((p) => p.name);

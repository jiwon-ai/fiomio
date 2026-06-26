import { dictionaries, type Lang } from "@/lib/locale";

const SITE_URL = "https://fiomio.io";

/**
 * Server-rendered structured data (schema.org / JSON-LD).
 * Emitted in the initial HTML so crawlers index it without running JS.
 * - Organization + WebSite: site-wide identity & search box eligibility.
 * - FAQPage: built from the canonical FR dictionary so it always mirrors
 *   the visible FAQ (a Google requirement for rich results).
 */
export function SiteJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Fiomio",
        url: SITE_URL,
        email: "hello@fiomio.io",
        logo: `${SITE_URL}/icon.svg`,
        description:
          "Fiomio est une plateforme parisienne de recommandation de skincare K-beauty par IA, qui aide les Européennes à trouver les produits coréens adaptés à leur peau, leur ville, le climat et la saison.",
        slogan: "La K-beauty décodée pour votre peau et le climat de votre ville.",
        foundingLocation: "Paris, France",
        foundingDate: "2026",
        founder: { "@type": "Person", name: "Jiwon Yi" },
        areaServed: ["France", "Europe"],
        knowsAbout: [
          "K-beauty",
          "Korean skincare",
          "skincare ingredients",
          "personalized skincare",
          "niacinamide",
          "retinol",
          "centella asiatica",
          "sensitive skin",
        ],
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Fiomio",
        description:
          "AI-powered Korean skincare recommendation platform for European users.",
        inLanguage: ["fr-FR", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export function FaqJsonLd({ lang }: { lang: Lang }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: dictionaries[lang].faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import { fr } from "@/lib/messages";

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
          "Fiomio réinterprète les ingrédients de la K-beauty pour votre peau, votre ville et votre saison.",
        foundingLocation: "Paris, France",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Fiomio",
        inLanguage: "fr-FR",
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

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: fr.faq.items.map((item) => ({
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

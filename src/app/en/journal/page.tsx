import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { JournalIndex } from "@/components/JournalIndex";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Journal · Weather-aware skincare",
  description:
    "Every week: how to adapt your skin to your city's climate, K-beauty ingredients decoded, anti-ageing, concrete steps. Zero influence, only facts.",
  alternates: {
    canonical: `${SITE_URL}/en/journal`,
    languages: {
      fr: `${SITE_URL}/journal`,
      en: `${SITE_URL}/en/journal`,
      "x-default": `${SITE_URL}/journal`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Fiomio Journal · Weather-aware skincare",
    description: "Ingredients decoded, anti-ageing, local climate. No influence.",
  },
};

export default function JournalPageEn() {
  const articles = getAllArticles();
  return <JournalIndex lang="en" articles={articles} />;
}

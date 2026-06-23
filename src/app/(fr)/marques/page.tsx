import type { Metadata } from "next";
import { BrandsContent } from "@/components/BrandsContent";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Pour les marques",
  description:
    "Données de demande K-beauty anonymisées et rapports de marché : ce que les consommatrices européennes veulent vraiment, par ville et par saison.",
  alternates: {
    canonical: `${SITE_URL}/marques`,
    languages: {
      fr: `${SITE_URL}/marques`,
      en: `${SITE_URL}/en/marques`,
      "x-default": `${SITE_URL}/marques`,
    },
  },
  robots: { index: true, follow: true },
};

export default function MarquesPage() {
  return <BrandsContent lang="fr" />;
}

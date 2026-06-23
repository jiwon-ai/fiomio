import type { Metadata } from "next";
import { BrandsContent } from "@/components/BrandsContent";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "For brands",
  description:
    "Anonymized K-beauty demand data and market reports: what European consumers actually want, by city and by season.",
  alternates: {
    canonical: `${SITE_URL}/en/marques`,
    languages: {
      fr: `${SITE_URL}/marques`,
      en: `${SITE_URL}/en/marques`,
      "x-default": `${SITE_URL}/marques`,
    },
  },
  robots: { index: true, follow: true },
};

export default function MarquesEnPage() {
  return <BrandsContent lang="en" />;
}

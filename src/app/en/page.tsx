import type { Metadata } from "next";
import { HomeSections } from "@/components/HomeSections";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Fiomio · K-beauty skincare chosen for your skin and your city's weather",
  description:
    "Fiomio reinterprets K-beauty ingredients for your skin, your city and your season. A personalised, detailed recommendation, not a list of best-sellers.",
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      fr: SITE_URL,
      en: `${SITE_URL}/en`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
    url: `${SITE_URL}/en`,
    siteName: "Fiomio",
    title: "Fiomio · Adaptive skincare intelligence",
    description: "K-beauty decoded for your skin, your climate, your season.",
  },
};

export default function HomeEn() {
  return <HomeSections lang="en" />;
}

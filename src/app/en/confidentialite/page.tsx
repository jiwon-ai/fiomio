import type { Metadata } from "next";
import { ConfidentialiteContent } from "../../(fr)/confidentialite/content";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Fiomio collects and protects your personal data (GDPR).",
  alternates: {
    canonical: `${SITE_URL}/en/confidentialite`,
    languages: {
      fr: `${SITE_URL}/confidentialite`,
      en: `${SITE_URL}/en/confidentialite`,
      "x-default": `${SITE_URL}/confidentialite`,
    },
  },
  robots: { index: true, follow: true },
};

export default function ConfidentialiteEn() {
  return <ConfidentialiteContent lang="en" />;
}

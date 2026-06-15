import type { Metadata } from "next";
import { ConfidentialiteContent } from "./content";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Fiomio collecte et protège vos données personnelles (RGPD).",
  alternates: { canonical: "https://fiomio.io/confidentialite" },
  robots: { index: true, follow: true },
};

export default function Confidentialite() {
  return <ConfidentialiteContent />;
}

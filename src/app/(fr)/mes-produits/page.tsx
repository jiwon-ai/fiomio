import type { Metadata } from "next";
import { ProductScanner } from "@/components/ProductScanner";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Affinités · vos ingrédients compatibles",
  description:
    "Scannez les cosmétiques que vous avez utilisés et dites si votre peau a bien réagi. Fiomio repère les ingrédients liés à vos mauvaises expériences, à éviter.",
  alternates: {
    canonical: `${SITE_URL}/mes-produits`,
    languages: {
      fr: `${SITE_URL}/mes-produits`,
      en: `${SITE_URL}/en/mes-produits`,
      "x-default": `${SITE_URL}/mes-produits`,
    },
  },
  robots: { index: true, follow: true },
};

export default function MesProduitsPage() {
  return <ProductScanner lang="fr" />;
}

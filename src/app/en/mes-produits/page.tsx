import type { Metadata } from "next";
import { ProductScanner } from "@/components/ProductScanner";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "My products · ingredients to avoid",
  description:
    "Scan the cosmetics you've used and say whether your skin reacted well. Fiomio surfaces the ingredients linked to your bad experiences, to avoid.",
  alternates: {
    canonical: `${SITE_URL}/en/mes-produits`,
    languages: {
      fr: `${SITE_URL}/mes-produits`,
      en: `${SITE_URL}/en/mes-produits`,
      "x-default": `${SITE_URL}/mes-produits`,
    },
  },
  robots: { index: true, follow: true },
};

export default function MyProductsPage() {
  return <ProductScanner lang="en" />;
}

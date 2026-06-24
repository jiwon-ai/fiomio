import type { Metadata } from "next";
import { GuideContent } from "@/components/GuideContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Guide K-beauty : routine, actifs et climat",
  description: "Le guide complet de la K-beauty pour l'Europe : ce qu'est le soin coréen, les actifs clés décodés (niacinamide, centella, rétinol…) et comment adapter votre routine au climat de votre ville.",
  alternates: { canonical: `${SITE}/guide-k-beauty`, languages: { fr: `${SITE}/guide-k-beauty`, en: `${SITE}/en/guide-k-beauty`, "x-default": `${SITE}/guide-k-beauty` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <GuideContent lang="fr" />; }

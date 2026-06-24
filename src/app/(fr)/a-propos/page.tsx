import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "À propos · plateforme de recommandation K-beauty par IA",
  description: "Fiomio est une plateforme parisienne de recommandation de skincare K-beauty par IA pour les utilisateurs européens : peau, ville, climat et saison.",
  alternates: { canonical: `${SITE}/a-propos`, languages: { fr: `${SITE}/a-propos`, en: `${SITE}/en/a-propos`, "x-default": `${SITE}/a-propos` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <AboutContent lang="fr" />; }

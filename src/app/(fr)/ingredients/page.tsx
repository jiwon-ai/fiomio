import type { Metadata } from "next";
import { IngredientsIndex } from "@/components/IngredientsIndex";

const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Ingrédients K-beauty : l'encyclopédie des actifs",
  description:
    "Ce que fait chaque actif K-beauty, à qui il convient, dans quel climat, et avec quoi ne pas le mélanger. Décodé par Fiomio.",
  alternates: {
    canonical: `${SITE}/ingredients`,
    languages: { fr: `${SITE}/ingredients`, en: `${SITE}/en/ingredients`, "x-default": `${SITE}/ingredients` },
  },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <IngredientsIndex lang="fr" />;
}

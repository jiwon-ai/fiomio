import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { JournalIndex } from "@/components/JournalIndex";

export const metadata: Metadata = {
  title: "Journal — La météo-soin de Paris",
  description:
    "Chaque semaine, comment adapter votre peau au climat parisien — ingrédients K-beauty décodés, anti-âge, gestes concrets. Zéro influence, rien que de l'expertise.",
  alternates: { canonical: "https://fiomio.io/journal" },
  openGraph: {
    type: "website",
    title: "Journal Fiomio — La météo-soin de Paris",
    description: "Ingrédients décodés, anti-âge, climat parisien. Sans influence.",
  },
};

export default function JournalPage() {
  const articles = getAllArticles();
  return <JournalIndex articles={articles} />;
}

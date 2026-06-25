import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { JournalIndex } from "@/components/JournalIndex";

export const metadata: Metadata = {
  title: "Journal · La météo-soin",
  description:
    "Chaque semaine, comment adapter votre peau au climat de votre ville, ingrédients K-beauty décodés, anti-âge, gestes concrets. Zéro influence, rien que des faits.",
  alternates: { canonical: "https://fiomio.io/journal" },
  openGraph: {
    type: "website",
    title: "Journal Fiomio · La météo-soin",
    description: "Ingrédients décodés, anti-âge, climat local. Sans influence.",
  },
};

export default function JournalPage() {
  const articles = getAllArticles("fr");
  return <JournalIndex lang="fr" articles={articles} />;
}

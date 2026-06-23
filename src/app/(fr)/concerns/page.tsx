import type { Metadata } from "next";
import { ConcernsIndex } from "@/components/ConcernsIndex";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Préoccupations peau : trouvez les bons actifs K-beauty",
  description: "Rougeurs, déshydratation, taches, anti-âge, pores : les actifs K-beauty qui ciblent chaque préoccupation, décodés par Fiomio.",
  alternates: { canonical: `${SITE}/concerns`, languages: { fr: `${SITE}/concerns`, en: `${SITE}/en/concerns`, "x-default": `${SITE}/concerns` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <ConcernsIndex lang="fr" />; }

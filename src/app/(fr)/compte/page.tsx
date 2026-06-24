import type { Metadata } from "next";
import { AccountContent } from "@/components/AccountContent";

export const metadata: Metadata = {
  title: "Mon espace · Fiomio",
  description:
    "Connectez-vous pour enregistrer vos résultats et suivre votre peau dans le temps.",
  robots: { index: false, follow: false },
};

export default function ComptePage() {
  return <AccountContent lang="fr" />;
}

import type { Metadata } from "next";
import { ContactContent } from "@/components/ContactContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Fiomio : questions, partenariats de marque, presse. hello@fiomio.io",
  alternates: { canonical: `${SITE}/contact`, languages: { fr: `${SITE}/contact`, en: `${SITE}/en/contact`, "x-default": `${SITE}/contact` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <ContactContent lang="fr" />; }

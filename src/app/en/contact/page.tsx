import type { Metadata } from "next";
import { ContactContent } from "@/components/ContactContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Fiomio: questions, brand partnerships, press. hello@fiomio.io",
  alternates: { canonical: `${SITE}/en/contact`, languages: { fr: `${SITE}/contact`, en: `${SITE}/en/contact`, "x-default": `${SITE}/contact` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <ContactContent lang="en" />; }

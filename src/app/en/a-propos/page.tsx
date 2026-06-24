import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "About · AI Korean skincare recommendation platform",
  description: "Fiomio is a Paris-based AI Korean-skincare recommendation platform for European users: skin type, city, climate and season.",
  alternates: { canonical: `${SITE}/en/a-propos`, languages: { fr: `${SITE}/a-propos`, en: `${SITE}/en/a-propos`, "x-default": `${SITE}/a-propos` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <AboutContent lang="en" />; }

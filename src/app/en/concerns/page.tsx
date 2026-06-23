import type { Metadata } from "next";
import { ConcernsIndex } from "@/components/ConcernsIndex";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "Skin concerns: find the right K-beauty actives",
  description: "Redness, dehydration, dark spots, anti-aging, pores: the K-beauty actives that target each concern, decoded by Fiomio.",
  alternates: { canonical: `${SITE}/en/concerns`, languages: { fr: `${SITE}/concerns`, en: `${SITE}/en/concerns`, "x-default": `${SITE}/concerns` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <ConcernsIndex lang="en" />; }

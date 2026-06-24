import type { Metadata } from "next";
import { GuideContent } from "@/components/GuideContent";
const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "K-beauty guide: routine, actives and climate",
  description: "The complete K-beauty guide for Europe: what Korean skincare is, the key actives decoded (niacinamide, centella, retinol…) and how to adapt your routine to your city's climate.",
  alternates: { canonical: `${SITE}/en/guide-k-beauty`, languages: { fr: `${SITE}/guide-k-beauty`, en: `${SITE}/en/guide-k-beauty`, "x-default": `${SITE}/guide-k-beauty` } },
  robots: { index: true, follow: true },
};
export default function Page() { return <GuideContent lang="en" />; }

import type { Metadata } from "next";
import { IngredientsIndex } from "@/components/IngredientsIndex";

const SITE = "https://fiomio.io";
export const metadata: Metadata = {
  title: "K-beauty ingredients: the active encyclopaedia",
  description:
    "What each K-beauty active does, who it suits, in which climate, and what not to mix it with. Decoded by Fiomio.",
  alternates: {
    canonical: `${SITE}/en/ingredients`,
    languages: { fr: `${SITE}/ingredients`, en: `${SITE}/en/ingredients`, "x-default": `${SITE}/ingredients` },
  },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <IngredientsIndex lang="en" />;
}

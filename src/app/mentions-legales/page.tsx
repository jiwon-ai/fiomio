import type { Metadata } from "next";
import { MentionsContent } from "./content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Fiomio.",
  alternates: { canonical: "https://fiomio.io/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return <MentionsContent />;
}

import type { Metadata } from "next";
import { MentionsContent } from "../../(fr)/mentions-legales/content";

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Legal notice for the Fiomio website.",
  alternates: {
    canonical: `${SITE_URL}/en/mentions-legales`,
    languages: {
      fr: `${SITE_URL}/mentions-legales`,
      en: `${SITE_URL}/en/mentions-legales`,
      "x-default": `${SITE_URL}/mentions-legales`,
    },
  },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesEn() {
  return <MentionsContent lang="en" />;
}

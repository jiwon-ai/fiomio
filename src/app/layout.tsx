import type { Metadata } from "next";
import { Schibsted_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

// Sovrn Commerce (ex-Skimlinks) auto-affiliation. Loads only once the
// publisher id is set (post-approval) — then all outbound merchant links
// are turned into affiliate links automatically. Set NEXT_PUBLIC_SOVRN_ID
// in the Vercel env (e.g. "123456X1700000").
const SOVRN_ID = process.env.NEXT_PUBLIC_SOVRN_ID;

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fiomio · Le soin K-beauty choisi pour votre peau et la météo de votre ville",
    template: "%s · Fiomio",
  },
  description:
    "Fiomio est une plateforme parisienne de recommandation de skincare K-beauty par IA : elle aide les Européennes à trouver les produits coréens adaptés à leur type de peau, leur ville, le climat et la saison. Une recommandation personnalisée et expliquée, pas une liste de best-sellers.",
  keywords: [
    "K-beauty",
    "skincare coréen",
    "recommandation skincare",
    "skincare IA",
    "Korean skincare",
    "AI skincare recommendation",
    "ingrédients cosmétiques",
    "peau sensible",
    "niacinamide",
    "centella",
    "rétinol",
    "céramides",
    "routine coréenne",
    "Paris",
    "Séoul",
  ],
  authors: [{ name: "Fiomio" }],
  creator: "Fiomio",
  alternates: {
    canonical: SITE_URL,
    languages: {
      fr: SITE_URL,
      en: `${SITE_URL}/en`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Fiomio",
    title: "Fiomio · Intelligence skincare adaptative",
    description:
      "K-beauty décodée pour votre peau, votre climat, votre saison.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiomio · Intelligence skincare adaptative",
    description:
      "K-beauty décodée pour votre peau, votre climat, votre saison.",
  },
  robots: { index: true, follow: true },
  verification: { google: "lNWskzElnYrnFdqrjf5QiOztpczeTIVTCYE7IsndAIo" },
  category: "beauty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${schibsted.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://ipwho.is" crossOrigin="" />
        <link rel="preconnect" href="https://ipapi.co" crossOrigin="" />
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://geocoding-api.open-meteo.com"
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-paper text-ink">
        <a href="#main-content" className="skip-link">
          Aller au contenu
        </a>
        {children}
        <SiteJsonLd />
        <Analytics />
        {SOVRN_ID ? (
          <Script
            id="sovrn-commerce"
            strategy="afterInteractive"
            src={`https://s.skimresources.com/js/${SOVRN_ID}.skimlinks.js`}
          />
        ) : null}
      </body>
    </html>
  );
}

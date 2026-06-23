import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

// Sovrn Commerce (ex-Skimlinks) auto-affiliation. Loads only once the
// publisher id is set (post-approval) — then all outbound merchant links
// are turned into affiliate links automatically. Set NEXT_PUBLIC_SOVRN_ID
// in the Vercel env (e.g. "123456X1700000").
const SOVRN_ID = process.env.NEXT_PUBLIC_SOVRN_ID;

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
    "Fiomio réinterprète les ingrédients de la K-beauty pour votre peau, votre ville et votre saison. Une recommandation personnalisée et explicable, pas une liste de best-sellers.",
  keywords: [
    "K-beauty",
    "skincare",
    "ingrédients",
    "niacinamide",
    "centella",
    "rétinol",
    "céramides",
    "Paris",
    "Séoul",
    "routine coréenne",
    "soin de la peau",
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
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
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

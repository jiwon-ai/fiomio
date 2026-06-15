import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

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

const geistMono = Geist_Mono({
  variable: "--font-mono-geist",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://fiomio.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fiomio — Le soin K-beauty choisi pour votre peau et la météo de Paris",
    template: "%s · Fiomio",
  },
  description:
    "Fiomio réinterprète les ingrédients de la K-beauty pour votre peau, votre ville et votre saison. Une recommandation personnalisée et explicable — pas une liste de best-sellers.",
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
    languages: { fr: SITE_URL, en: `${SITE_URL}/?lang=en` },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Fiomio",
    title: "Fiomio — Intelligence skincare adaptative",
    description:
      "K-beauty décodée pour votre peau, votre climat, votre saison. Korean Insider × Paris Observer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiomio — Intelligence skincare adaptative",
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
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <LangProvider>
          <Nav />
          {children}
          <Footer />
        </LangProvider>
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConcernPageContent } from "@/components/ConcernPageContent";
import { allConcernSlugs, concernKeyBySlug } from "@/lib/concerns";
import { CONCERN_TITLE, CONCERN_INTRO, CONCERN_SLUG } from "@/lib/concerns";

const SITE = "https://fiomio.io";
export function generateStaticParams() {
  return allConcernSlugs().map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ck = concernKeyBySlug(slug);
  if (!ck) return { title: "Concern not found" };
  return {
    title: `${CONCERN_TITLE[ck].en}: K-beauty actives and products`,
    description: CONCERN_INTRO[ck].en.slice(0, 155),
    alternates: { canonical: `${SITE}/en/concerns/${CONCERN_SLUG[ck]}`, languages: { fr: `${SITE}/concerns/${CONCERN_SLUG[ck]}`, en: `${SITE}/en/concerns/${CONCERN_SLUG[ck]}`, "x-default": `${SITE}/concerns/${CONCERN_SLUG[ck]}` } },
    robots: { index: true, follow: true },
  };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ck = concernKeyBySlug(slug);
  if (!ck) notFound();
  return <ConcernPageContent lang="en" ck={ck} />;
}

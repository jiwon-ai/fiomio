import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/articles";
import { ArticleView } from "@/components/ArticleView";

const SITE_URL = "https://fiomio.io";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: {
      canonical: `${SITE_URL}/en/journal/${a.slug}`,
      languages: {
        fr: `${SITE_URL}/journal/${a.slug}`,
        en: `${SITE_URL}/en/journal/${a.slug}`,
        "x-default": `${SITE_URL}/journal/${a.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      title: a.title,
      description: a.excerpt,
      publishedTime: a.date,
      tags: a.tags,
    },
  };
}

export default async function ArticlePageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const related = getAllArticles()
    .filter((x) => x.slug !== slug)
    .slice(0, 2);
  return <ArticleView lang="en" article={article} related={related} />;
}

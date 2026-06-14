import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/articles";
import { ArticleView } from "@/components/ArticleView";

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
  if (!a) return { title: "Article introuvable" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `https://fiomio.io/journal/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      publishedTime: a.date,
      tags: a.tags,
    },
  };
}

export default async function ArticlePage({
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
  return <ArticleView article={article} related={related} />;
}

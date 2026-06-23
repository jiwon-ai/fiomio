import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IngredientPageContent } from "@/components/IngredientPageContent";
import {
  allIngredientSlugs,
  ingredientBySlug,
  ingredientSlug,
} from "@/lib/ingredient-pages";

const SITE = "https://fiomio.io";

export function generateStaticParams() {
  return allIngredientSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ing = ingredientBySlug(slug);
  if (!ing) return { title: "Actif introuvable" };
  const s = ingredientSlug(ing);
  return {
    title: `${ing.name.fr} : bienfaits, peau et climat`,
    description: ing.why.fr.slice(0, 155),
    alternates: {
      canonical: `${SITE}/ingredients/${s}`,
      languages: {
        fr: `${SITE}/ingredients/${s}`,
        en: `${SITE}/en/ingredients/${s}`,
        "x-default": `${SITE}/ingredients/${s}`,
      },
    },
    openGraph: { type: "article", title: `${ing.name.fr} · Fiomio`, description: ing.tag.fr },
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ing = ingredientBySlug(slug);
  if (!ing) notFound();
  return <IngredientPageContent lang="fr" ing={ing} />;
}

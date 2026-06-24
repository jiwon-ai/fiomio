import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { allIngredientSlugs } from "@/lib/ingredient-pages";
import { allConcernSlugs } from "@/lib/concerns";

const BASE = "https://fiomio.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const all = getAllArticles();

  const frArticles = all.map((a) => ({
    url: `${BASE}/journal/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const ingSlugs = allIngredientSlugs();
  const concernSlugs = allConcernSlugs();
  const frConcern = concernSlugs.map((slug) => ({ url: `${BASE}/concerns/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }));
  const enConcern = concernSlugs.map((slug) => ({ url: `${BASE}/en/concerns/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 }));
  const frIng = ingSlugs.map((slug) => ({
    url: `${BASE}/ingredients/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const enIng = ingSlugs.map((slug) => ({
    url: `${BASE}/en/ingredients/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const enArticles = all.map((a) => ({
    url: `${BASE}/en/journal/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/marques`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${BASE}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${BASE}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/ingredients`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...frIng,
    { url: `${BASE}/concerns`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...frConcern,
    ...frArticles,
    // English (/en) mirror
    { url: `${BASE}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${BASE}/en/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/en/marques`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${BASE}/en/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/en/contact`, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${BASE}/en/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${BASE}/en/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${BASE}/en/ingredients`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...enIng,
    { url: `${BASE}/en/concerns`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    ...enConcern,
    ...enArticles,
  ];
}

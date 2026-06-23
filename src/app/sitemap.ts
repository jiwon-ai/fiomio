import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const BASE = "https://fiomio.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const all = getAllArticles();

  const frArticles = all.map((a) => ({
    url: `${BASE}/journal/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
    ...enArticles,
  ];
}

/* ============================================================
   FIOMIO — journal / product reviews
   Markdown files in /content/articles with frontmatter, rendered
   to static HTML at build time. Reviews carry structured data
   (product, rating, photos, pros/cons) in frontmatter; the body
   is the personal narrative. Drafts are hidden from the index.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const DIR = path.join(process.cwd(), "content/articles");

export type ProductInfo = {
  name: string;
  brand: string;
  category?: string;
  price?: string;
  rating?: number; // out of 10
  url?: string; // buy / affiliate link
  verdict?: string;
};

export type Photo = { src: string; label?: string; alt?: string };

export type ArticleMeta = {
  slug: string;
  lang: "fr" | "en";
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  author: string;
  accent: "lime" | "teal" | "sage";
  readingMinutes: number;
  type: "review" | "guide";
  draft: boolean;
  product?: ProductInfo;
  pros: string[];
  cons: string[];
  photos: Photo[];
};

export type Article = ArticleMeta & { html: string };

function readRaw(slug: string): string {
  return fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
}

export function getArticleSlugs(lang?: "fr" | "en"): string[] {
  if (!fs.existsSync(DIR)) return [];
  const slugs = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  if (!lang) return slugs;
  return slugs.filter((slug) => toMeta(slug, readRaw(slug)).lang === lang);
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

function toMeta(slug: string, raw: string): ArticleMeta {
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  const rawDate = data.date;
  const date =
    typeof rawDate === "string"
      ? rawDate
      : rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : "";
  const accent = (["lime", "teal", "sage"] as const).includes(data.accent)
    ? (data.accent as ArticleMeta["accent"])
    : "teal";

  const p = data.product;
  const product: ProductInfo | undefined = p
    ? {
        name: String(p.name ?? ""),
        brand: String(p.brand ?? ""),
        category: p.category ? String(p.category) : undefined,
        price: p.price ? String(p.price) : undefined,
        rating: typeof p.rating === "number" ? p.rating : undefined,
        url: p.url ? String(p.url) : undefined,
        verdict: p.verdict ? String(p.verdict) : undefined,
      }
    : undefined;

  const photos: Photo[] = Array.isArray(data.photos)
    ? data.photos.map((ph: { src?: unknown; label?: unknown; alt?: unknown }) => ({
        src: String(ph.src ?? ""),
        label: ph.label ? String(ph.label) : undefined,
        alt: ph.alt ? String(ph.alt) : undefined,
      }))
    : [];

  const lang: "fr" | "en" = data.lang === "en" ? "en" : "fr";

  return {
    slug,
    lang,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date,
    tags: asStringArray(data.tags),
    author: data.author ?? "Fiomio",
    accent,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    type: data.type === "guide" ? "guide" : "review",
    draft: data.draft === true,
    product,
    pros: asStringArray(data.pros),
    cons: asStringArray(data.cons),
    photos,
  };
}

/** Published articles only (drafts hidden), newest first. */
export function getAllArticles(lang?: "fr" | "en"): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => toMeta(slug, readRaw(slug)))
    .filter((a) => !a.draft)
    .filter((a) => !lang || a.lang === lang)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const raw = readRaw(slug);
    const { content } = matter(raw);
    const meta = toMeta(slug, raw);
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeStringify)
      .process(content);
    return { ...meta, html: String(file) };
  } catch {
    return null;
  }
}

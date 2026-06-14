/* ============================================================
   FIOMIO — journal / articles
   Markdown files in /content/articles with frontmatter, rendered
   to static HTML at build time (best SEO, zero runtime cost).
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

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  author: string;
  accent: "lime" | "teal" | "sage";
  readingMinutes: number;
};

export type Article = ArticleMeta & { html: string };

function readRaw(slug: string): string {
  return fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
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
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? "Fiomio",
    accent,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => toMeta(slug, readRaw(slug)))
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

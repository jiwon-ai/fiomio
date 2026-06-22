/**
 * rag/seed.ts — embed ingredients and push to Supabase pgvector
 * Run: npx tsx rag/seed.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import kb from "./knowledge-base.json";

// Load .env.local automatically
try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const eq = line.indexOf("=");
    if (eq < 1 || line.trimStart().startsWith("#")) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
} catch {}

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const VOYAGE_KEY   = process.env.VOYAGE_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY || !VOYAGE_KEY) {
  console.error("Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, VOYAGE_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function embed(text: string, attempt = 0): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_KEY}`,
    },
    body: JSON.stringify({ input: [text], model: "voyage-3-lite" }),
  });

  if (res.status === 429) {
    const wait = 21_000 * (attempt + 1);
    console.log(`  ⏳ rate limited — waiting ${wait / 1000}s...`);
    await new Promise((r) => setTimeout(r, wait));
    return embed(text, attempt + 1);
  }

  if (!res.ok) throw new Error(`Voyage error: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0].embedding;
}

async function seed() {
  const total = kb.reduce((n, ing) => n + ing.chunks.length, 0);
  console.log(`Seeding ${kb.length} ingredients (${total} chunks)...\n`);

  let done = 0;
  for (const ingredient of kb) {
    for (const chunk of ingredient.chunks) {
      const content = `${ingredient.name_fr} — ${chunk.title}\n\n${chunk.text}`;
      const embedding = await embed(content);

      const { error } = await supabase.from("ingredients_rag").upsert(
        {
          ingredient_id:  ingredient.id,
          name_fr:        ingredient.name_fr,
          name_en:        ingredient.name_en,
          chunk_title:    chunk.title,
          content_fr:     content,
          pregnancy_safe: ingredient.pregnancy_safe,
          concerns:       ingredient.concerns,
          embedding,
        },
        { onConflict: "ingredient_id,chunk_title" }
      );

      done++;
      if (error) {
        console.error(`  ✗ [${done}/${total}] ${ingredient.name_fr} — ${chunk.title}`);
        console.error("   ", error.message);
      } else {
        console.log(`  ✓ [${done}/${total}] ${ingredient.name_fr} — ${chunk.title}`);
      }

      await new Promise((r) => setTimeout(r, 120)); // stay within rate limit
    }
  }

  console.log(`\nDone! ${done} chunks inserted.`);
}

seed().catch((e) => { console.error(e); process.exit(1); });

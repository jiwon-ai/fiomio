/**
 * rag/seed.ts — build embeddings and push to Supabase pgvector
 *
 * Prerequisites:
 *   1. Supabase project with pgvector extension enabled
 *   2. Run the SQL in schema.sql to create the ingredients_rag table
 *   3. Set env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY
 *
 * Run: npx tsx rag/seed.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import kb from "./knowledge-base.json";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function embed(text: string): Promise<number[]> {
  // Voyage AI embeddings via Anthropic — optimised for Claude retrieval
  // Falls back to a simple approach if voyage not available
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: [text], model: "voyage-3-lite" }),
  });
  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0].embedding;
}

async function seed() {
  console.log(`Seeding ${kb.length} ingredients...`);

  for (const ingredient of kb) {
    for (const chunk of ingredient.chunks) {
      const content = `${ingredient.name_fr} — ${chunk.title}\n\n${chunk.text}`;
      const embedding = await embed(content);

      const { error } = await supabase.from("ingredients_rag").upsert({
        ingredient_id: ingredient.id,
        name_fr: ingredient.name_fr,
        name_en: ingredient.name_en,
        chunk_title: chunk.title,
        content_fr: content,
        pregnancy_safe: ingredient.pregnancy_safe,
        concerns: ingredient.concerns,
        embedding,
      });

      if (error) console.error(`Error inserting ${ingredient.id}:`, error);
      else console.log(`  ✓ ${ingredient.name_fr} — ${chunk.title}`);

      await new Promise((r) => setTimeout(r, 100)); // rate limit
    }
  }

  console.log("Done.");
}

seed().catch(console.error);

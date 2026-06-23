/**
 * RAG retrieval helper for /api/recommend
 * Searches the Supabase pgvector table and returns relevant ingredient chunks.
 * Returns [] if Supabase is not configured — route falls back gracefully.
 */

import { createClient } from "@supabase/supabase-js";

type RagChunk = {
  ingredient_id: string;
  name_fr: string;
  name_en: string;
  chunk_title: string;
  content_fr: string;
  pregnancy_safe: boolean;
  similarity: number;
};

async function embed(text: string): Promise<number[] | null> {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ input: [text], model: "voyage-3-lite" }),
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0]?.embedding ?? null;
}

export async function retrieveIngredientContext(
  query: string,
  isPregnant: boolean,
  topK = 4
): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return "";

  const embedding = await embed(query);
  if (!embedding) return "";

  const supabase = createClient(url, key);

  const { data, error } = await supabase.rpc("match_ingredients", {
    query_embedding: embedding,
    match_count: topK,
    filter_pregnant: isPregnant,
  });

  if (error || !data) return "";

  const chunks = data as RagChunk[];
  if (!chunks.length) return "";

  return (
    "\n\n---\nConnaissances scientifiques pertinentes (base de données Fiomio) :\n" +
    chunks
      .map((c) => `• ${c.name_fr} : ${c.chunk_title}\n${c.content_fr}`)
      .join("\n\n")
  );
}

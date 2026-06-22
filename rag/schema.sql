-- Run this in Supabase SQL Editor before seeding

-- Enable pgvector
create extension if not exists vector;

-- Ingredient knowledge base table
create table if not exists ingredients_rag (
  id              bigserial primary key,
  ingredient_id   text not null,
  name_fr         text not null,
  name_en         text not null,
  chunk_title     text not null,
  content_fr      text not null,
  pregnancy_safe  boolean not null default true,
  concerns        text[] not null default '{}',
  embedding       vector(512),      -- voyage-3-lite dimension
  created_at      timestamptz default now()
);

-- Cosine similarity search function
create or replace function match_ingredients(
  query_embedding vector(512),
  match_count     int     default 5,
  filter_pregnant boolean default false
)
returns table (
  ingredient_id  text,
  name_fr        text,
  name_en        text,
  chunk_title    text,
  content_fr     text,
  pregnancy_safe boolean,
  similarity     float
)
language sql stable
as $$
  select
    ingredient_id,
    name_fr,
    name_en,
    chunk_title,
    content_fr,
    pregnancy_safe,
    1 - (embedding <=> query_embedding) as similarity
  from ingredients_rag
  where
    case when filter_pregnant then pregnancy_safe = true else true end
  order by embedding <=> query_embedding
  limit match_count;
$$;

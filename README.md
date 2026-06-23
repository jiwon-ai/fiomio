# Fiomio — Intelligence skincare adaptative

> **Korean Insider × Paris Observer.**
> La K-beauty décodée pour votre peau, votre ville et votre saison : une
> recommandation personnalisée et *expliquée*, pas une liste de best-sellers.

Plateforme de recommandation skincare. Un diagnostic gratuit croise le profil
cutané, le **climat local** et une base d'**actifs K-beauty décodés** pour
proposer des ingrédients argumentés. Bilingue **FR / EN** (FR par défaut).
Cible : Parisiennes 25–35 ans, extensible à toute l'Europe.

Site : **https://fiomio.io**

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (design tokens CSS-first via `@theme`)
- Polices : **Outfit** (display/sans) · **Cormorant Garamond** (éditorial)
- Couleur signature : **céladon de Goryeo** (`#ACD6CD`, profond `#316B62`)
- 3D temps réel : **three.js** (orbe « sérum » réactif au climat, lazy-load)
- Données : **Supabase** (stockage anonyme) · **Brevo** (e-mail / newsletter)
- Météo / géo : **Open-Meteo** · Données produit : **Open Beauty Facts**
- Déploiement **Vercel** (edge + cron)

## Fonctionnalités

- **Diagnostic explicable** — moteur de scoring transparent (`src/lib/diagnostic.ts`)
  qui croise peau × préoccupations × climat de la semaine de livraison et
  renvoie des actifs avec *raison*, *cautions* et logique de routine.
- **Réactif au climat** — météo locale réelle (Open-Meteo), repli saisonnier
  hémisphère-aware ; chaque recommandation est reliée aux conditions de la ville.
- **Élimination d'ingrédients** (`/mes-produits`) — scan code-barres, recherche
  ou saisie/OCR des produits utilisés, notés 👍/👎. Le moteur isole les
  ingrédients suspects via **lift** (et non fréquence brute) + pondération
  des **allergènes/irritants documentés**, puis les écarte du diagnostic.
- **SEO programmatique** — une page par actif (`/ingredients/[slug]`) et par
  préoccupation (`/concerns/[slug]`), FR + EN, avec **FAQ + JSON-LD**, climat
  idéal, maillage interne actifs ↔ préoccupations, sitemap auto.
- **Data flywheel** — diagnostics et scans stockés **anonymement** (sans e-mail,
  sans IP) pour améliorer le moteur ; jeu de données ingrédient × résultat propriétaire.
- **Liste d'attente** (Brevo, avec ville/coordonnées) + **newsletter saisonnière**
  automatisée (cron hebdomadaire).
- **B2B** — page `/marques` (demande agrégée et anonymisée, rapports de marché).
- **Conformité** — RGPD, analytics sans cookie (Vercel), liens d'affiliation signalés.

## Pages

| Route | Description |
|-------|-------------|
| `/` · `/en` | Landing + démo du diagnostic |
| `/ingredients` · `/ingredients/[slug]` | Encyclopédie des 72 actifs (FR/EN) |
| `/concerns` · `/concerns/[slug]` | Hubs par préoccupation (8) |
| `/mes-produits` | Scan & élimination d'ingrédients |
| `/journal` · `/journal/[slug]` | Tests & contenu éditorial |
| `/marques` | Offre B2B (données de marché) |
| `/mentions-legales` · `/confidentialite` | Légal · RGPD |

## API (`src/app/api`)

| Route | Rôle |
|-------|------|
| `forecast` | Météo/climat agrégé pour la fenêtre de livraison |
| `recommend` | Note personnalisée (couche LLM optionnelle) |
| `diagnostic` | Persistance anonyme des diagnostics |
| `feedback` | Boucle de résultat (recommandation utile ou non) |
| `scan` | Persistance anonyme des produits scannés |
| `products/search` · `products/barcode` | Lookup dans la base produit propriétaire |
| `waitlist` | Inscription → Brevo (crée les attributs ville auto) |
| `cron/seasonal-newsletter` | Newsletter saisonnière (Vercel Cron) |
| `admin/import-obf` · `admin/import-feed` | Import produits (Open Beauty Facts / flux d'affiliation) |

## Données

- **72 actifs** curatés et pondérés (`src/lib/ingredients.ts`) : efficacité par
  préoccupation, traits, douceur, timing, conflits — bilingue.
- **136 produits** K-beauty réels mappés aux actifs (`src/lib/products.ts`).
- Moteur INCI : normalisation, allergènes, **lift** (`src/lib/inci.ts`).
- Base **seed_products** (Supabase) pré-remplie depuis Open Beauty Facts.

### Tables Supabase

```sql
-- diagnostics : profils anonymes (sans e-mail / IP)
-- product_scans : produits scannés + verdict (anonyme)
create table if not exists seed_products (
  barcode text primary key, name text, brand text,
  inci text[], categories text[], source text,
  updated_at timestamptz default now()
);
```

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de production
```

## Variables d'environnement

| Variable | Usage |
|----------|-------|
| `SUPABASE_URL` · `SUPABASE_SERVICE_KEY` | Stockage (diagnostics, scans, seed) |
| `BREVO_API_KEY` · `BREVO_LIST_ID` | Liste d'attente & newsletter |
| `CRON_SECRET` | Auth des crons Vercel |
| `IMPORT_SECRET` | Auth des routes d'import produit |
| `NEXT_PUBLIC_AFF_*` | Tags d'affiliation (YesStyle, iHerb, Stylevana, Amazon) |
| `OPENAI`/LLM (optionnel) | Note personnalisée enrichie |

## Déploiement

Déploiement automatique sur **Vercel** à chaque push sur `main`. Crons définis
dans `vercel.json` (newsletter hebdomadaire, import produit quotidien).

---

© 2026 Fiomio. Conçu entre Paris et Séoul.

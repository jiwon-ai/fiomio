# Fiomio, intelligence skincare adaptative

> La K-beauty décodée pour votre peau, votre ville et votre saison.
> Une recommandation personnalisée et *expliquée*, pas une liste de best-sellers.

Plateforme de recommandation skincare. Un diagnostic gratuit croise le profil
cutané, le **climat local** et une base d'**actifs K-beauty décodés** pour
proposer des ingrédients argumentés. Bilingue **FR / EN** (FR par défaut, EN sous `/en`).
Cible : utilisateurs européens anglophones et francophones, 24-45 ans.

Site : **https://fiomio.io** · Lancement visé : **1er juillet 2026**

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (design tokens CSS-first via `@theme`)
- Police : **Geist** (famille unique, neutre et propre), via `next/font`
- Couleur signature : céladon de Goryeo (`#ACD6CD`, profond `#316B62`)
- 3D temps réel : **three.js** (orbe sérum réactif au climat, lazy-load)
- Données : **Supabase** (stockage anonyme) · **Brevo** (e-mail / newsletter, UE)
- Météo et géo : **Open-Meteo** · Données produit : **Open Beauty Facts**
- Affiliation : **Awin** (publisher 2935207), Sovrn en attente
- Déploiement **Vercel** (edge + cron)

## Fonctionnalités

- **Diagnostic explicable** : moteur de scoring transparent (`src/lib/diagnostic.ts`)
  qui croise peau, préoccupations et climat de la semaine de livraison, puis
  renvoie des actifs avec raison, cautions et logique de routine. L'en-tête de
  résultat affiche la ville et la saison, sans chiffres bruts.
- **Réactif au climat** : météo locale réelle (Open-Meteo), repli saisonnier
  conscient de l'hémisphère. Chaque recommandation est reliée aux conditions
  qualitatives de la ville, sans répéter les mêmes mentions.
- **Affinités** (`/mes-produits`) : analyse à deux faces de vos produits, alliés
  et ingrédients à surveiller. Scan code-barres, recherche dans le catalogue
  curaté (marques connues) ou saisie INCI. Le moteur isole les ingrédients
  suspects via **lift** (et non fréquence brute), pondère les irritants
  documentés, et filtre les excipients. Le résultat se réinjecte dans le
  diagnostic (préférés et écartés), avec un toggle pour activer ou non.
- **SEO programmatique** : une page par actif (`/ingredients/[slug]`) et par
  préoccupation (`/concerns/[slug]`), FR et EN, avec FAQ et JSON-LD, climat
  idéal, maillage interne actifs et préoccupations, sitemap et hreflang.
- **Contenu pilier** : guide K-beauty (`/guide-k-beauty`) reliant actifs et
  préoccupations, pages À propos et Contact pour l'E-E-A-T.
- **Données structurées** : Organization, WebSite, AboutPage, FAQPage,
  BreadcrumbList en JSON-LD.
- **Comptes et suivi de peau** (`/compte`) : connexion par lien magique e-mail
  (Supabase Auth) ou Google. Une fois connecté, l'utilisateur enregistre ses
  résultats et suit l'état de sa peau dans le temps (check-ins). Le diagnostic
  anonyme reste ouvert, sans compte. Donnée identifiée minimale, RGPD.
- **Signaux de demande** (indépendants de l'affiliation) : clics produits au
  moment du résultat et recherches Affinités enregistrés anonymement
  (`/api/signal`), pour savoir ce que les gens veulent acheter et ce qu'il faut
  ajouter au catalogue. Snapshot climat (température, humidité, UV) joint aux
  diagnostics et aux clics.
- **Data flywheel** : diagnostics et scans stockés **anonymement** (sans e-mail,
  sans IP) pour améliorer le moteur. Jeu de données ingrédient et résultat propriétaire.
- **Liste d'attente** (Brevo, avec ville) et **newsletter saisonnière**
  automatisée (cron hebdomadaire).
- **B2B** : page `/marques` (demande agrégée et anonymisée, rapports de marché).
- **Conformité** : RGPD, analytics sans cookie, liens d'affiliation signalés,
  politique de confidentialité minimale (catégories de destinataires).

## Vision produit

1. **Phase 1** : recommandation skincare expliquée (actuel).
2. **Phase 2** : cosmétiques Fiomio en propre (D2C).
3. **Phase 3** : réservation de voyages dermatologie à Séoul (commission).
4. **Phase 4** : données de marché agrégées et anonymisées.

## Pages

| Route | Description |
|-------|-------------|
| `/` · `/en` | Landing et démo du diagnostic |
| `/ingredients` · `/ingredients/[slug]` | Encyclopédie des 72 actifs (FR/EN) |
| `/concerns` · `/concerns/[slug]` | Hubs par préoccupation (8) |
| `/guide-k-beauty` | Page pilier, guide complet K-beauty |
| `/mes-produits` | Affinités, analyse à deux faces de vos produits |
| `/compte` | Mon espace : connexion, résultats enregistrés, suivi de peau |
| `/admin/capture` | Outil interne de capture produit (clé) |
| `/journal` · `/journal/[slug]` | Tests et contenu éditorial |
| `/a-propos` · `/contact` | À propos et contact (E-E-A-T) |
| `/marques` | Offre B2B (données de marché) |
| `/mentions-legales` · `/confidentialite` | Légal et RGPD |

## API (`src/app/api`)

| Route | Rôle |
|-------|------|
| `forecast` | Météo et climat agrégé pour la fenêtre de livraison |
| `recommend` | Note personnalisée (couche LLM optionnelle) |
| `diagnostic` | Persistance anonyme des diagnostics |
| `feedback` | Boucle de résultat (recommandation utile ou non) |
| `scan` | Persistance anonyme des produits scannés |
| `products/search` · `products/barcode` | Lookup base propre ; le code-barres bascule sur Open Beauty Facts si absent |
| `signal` | Signaux anonymes : clics produits et recherches Affinités |
| `waitlist` | Inscription vers Brevo (crée les attributs ville auto) |
| `cron/seasonal-newsletter` | Newsletter saisonnière (Vercel Cron) |
| `admin/import-obf` · `admin/import-feed` | Import produits (OBF par catégories ou marques K-beauty, flux d'affiliation) |
| `admin/add-product` · `admin/add-photo` | Ajout manuel produit et photos (clé), depuis l'app compagnon |

## Données

- **72 actifs** curatés et pondérés (`src/lib/ingredients.ts`) : efficacité par
  préoccupation, traits, douceur, timing, conflits. Bilingue.
- **Catalogue adosse au feed Awin Stylevana FR (~1 243 produits recommandables)** :
  base curatee (`src/lib/products.ts`) + ensemble etendu auto-genere depuis le
  feed (`src/lib/stylevana-catalog.ts`). Chaque produit recommandable est en stock
  chez Stylevana avec un deeplink Awin trace et un prix reel
  (`src/lib/stylevana-products.ts`). La curation passe en premier dans les
  resultats.
- Moteur INCI : normalisation, allergènes, irritants, lift (`src/lib/inci.ts`).
- Base **seed_products** (Supabase) pré-remplie depuis Open Beauty Facts.

### Tables Supabase

Tables : `diagnostics`, `feedback`, `product_scans` (anonymes) ;
`seed_products` (catalogue INCI, OBF + captures) ; `product_clicks`,
`product_impressions`, `search_queries` (signaux de demande et funnel) ;
`saved_diagnostics`, `skin_checkins` (comptes) ; `product_photos` (+ bucket
Storage `product-photos`). Le SQL de chaque table est dans `supabase/`.

**Flywheel donnees v2 (Phase 1).** Le funnel anonyme est relie par des cles sans
donnee personnelle : `anon_id` (localStorage), `session_id` (sessionStorage) et
`diag_id` relient recherche, diagnostic, impressions et clics. Chaque evenement
porte `engine_version` et `schema_version`. Les recommandations sont stockees
structurees (`[{active_id, score, rank}]`) et les impressions (produits
affiches) servent de denominateur CTR et d'exemples negatifs. Migration
additive : `supabase/data_signals_v2.sql`. Dictionnaire :
`supabase/DATA_DICTIONARY.md`. Regle : incrementer `ENGINE_VERSION`
(`src/lib/data-version.ts`) quand le scoring du diagnostic change.

```sql
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
| `SUPABASE_URL` · `SUPABASE_SERVICE_KEY` | Stockage serveur (diagnostics, scans, seed, photos) |
| `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth comptes et suivi de peau (côté client, RLS) |
| `BREVO_API_KEY` · `BREVO_LIST_ID` | Liste d'attente et newsletter |
| `CRON_SECRET` | Auth des crons Vercel |
| `IMPORT_SECRET` | Auth des routes d'import produit |
| `NEXT_PUBLIC_AFF_*` | Tags d'affiliation (Awin, YesStyle, iHerb, Stylevana, Amazon) |
| `NEXT_PUBLIC_SOVRN_ID` | Sovrn Commerce, auto-affiliation site-wide (interrupteur de revenus) |
| `NEXT_PUBLIC_AWIN_AFFID` | Awin publisher id (defaut 2935207) pour les deeplinks |
| `NEXT_PUBLIC_AWIN_MID_STYLEVANA` | Awin merchant id Stylevana FR (defaut 23223) |
| `OPENAI` ou LLM (optionnel) | Note personnalisée enrichie |

## Indexation et e-mail (en place)

- Google Search Console : propriété vérifiée (balise meta), sitemap soumis
  (184 pages découvertes), page d'accueil indexée. Suivi de l'indexation et des
  requêtes via la console.
- Brevo : domaine fiomio.io authentifié (SPF, DKIM, DMARC), SMTP branché pour les
  liens de connexion et la newsletter.

## Veille et automatisations

- Veille beaute quotidienne (Slack) : canal `#fiomio-beauty-news`, briefing
  mondial cosmetiques et K-beauty (EN + FR) publie chaque matin vers 7h (Paris).

## Journal (26 juin 2026)

- Refonte visuelle : fond blanc avec bande celadon alternee (#e4f1ef), accent
  #78C0BD, CTA et liens #289479 ; polices Geist remplacees par Schibsted Grotesk
  (titres) et Inter (texte) ; echelle de titres calmee (max 62px) ; texte
  secondaire assombri pour la lisibilite ; ponctuation du hero unifiee.
- Sections Solution et WhyDifferent passees en liste editoriale sobre (fin des
  grilles de cartes facon presentation, des labels monospace et du chiffre
  filigrane ; accent celadon discret sur les numeros).
- Flywheel donnees v2 Phase 1 (voir Donnees).
- Veille beaute Slack automatisee (voir ci-dessus).
- Affiliation Stylevana FR active : les liens d'achat des produits recommandes
  sont routes vers Stylevana via deeplinks Awin (merchant 23223, publisher
  2935207). Premier programme monetise (commission 5 a 15 pourcent).
- Catalogue produits adosse au feed Awin Stylevana : 1 243 produits en stock avec
  deeplinks traces et prix reels, affiches sur les cartes. Couverture passee a 65
  actifs. Seuls les produits presents chez Stylevana sont recommandes (zero lien
  mort).
- Cartes produits : bouton d'achat plein (CTA visible), prix reel, et pour les
  produits vendus seulement en lot, mention "lot de N" + prix unitaire (le
  catalogue privilegie les formats unitaires).
- Diagnostic : le genre est demande en premier ; les hommes ne voient pas la
  preoccupation rougeurs hormonales (menopause) ni l'etape grossesse.
- Navigation : menu haut a 5 items (Diagnostic, Ingredients, Affinites, Guide,
  Blog) ; Guide promu depuis le footer, A propos / Pour les marques / legal au
  footer ; bascule en menu hamburger sous 1024px.
- Footer restructure en colonnes Decouvrir / Societe / Legal (navigation scindee,
  Pour les marques deplace dans Societe B2B), reseaux sociaux et langue sous Legal.
- Blog : premier article de contenu publie, "Les best-sellers K-beauty en Coree,
  expliques" (explication Olive Young + donnees + top 10 avec photos produits du
  feed, liens affilies Stylevana et sources). Style image ajoute a article-prose.
- Catalogue multi-source (Stylevana + YesStyle via Awin) : ~1233 liens d'achat,
  source la mieux commissionnee preferee (YesStyle 10% vs Stylevana 5%) quand le
  produit existe aux deux endroits (matching EAN), filtre marques K-beauty, label
  de source sur les cartes.
- Page A propos : portrait et signature de la fondatrice (Jiwon Yi) dans "Le mot
  de la fondatrice" ; founder ajoute au schema Organization.
- Favicons raster (favicon.ico 16/32/48, icon.png 192, apple-icon 180) pour un
  favicon Google fiable ; intro du diagnostic ramenee sur deux lignes.

## Reste à faire avant lancement

- **Affiliation (priorite 1).** Stylevana FR : APPROUVE et actif (deeplinks Awin,
  tous les liens produits monetises). Reste : confirmer Sovrn et definir
  `NEXT_PUBLIC_SOVRN_ID` (filet large), postuler YesStyle et Amazon Associates
  (le code applique leur tag des qu'il est en env), completer le profil Awin.
  Sephora et iHerb refuses : repostuler apres le lancement avec du trafic.
- **Trafic de lancement.** Calendrier editorial, articles SEO cibles (K-beauty x
  preoccupation x climat de ville), comptes reseaux sociaux puis sameAs et liens
  du footer, backlinks de marque (Crunchbase, Product Hunt).
- **QA avant lancement.** Diagnostic de bout en bout, tous les CTA, mobile, FR et
  EN, verifier que le logging (diagnostics, impressions, clics) arrive bien dans
  Supabase.
- **Dashboard funnel.** Artefact lisant Supabase (diagnostics, impressions,
  clics, recherches) pour suivre le funnel chaque jour apres le lancement.

## App compagnon (Fiomio Jiwon)

Petite app Android (Expo / React Native, dossier hors-repo) pour collecter des
produits toutes marques et enrichir `seed_products` : scan du code-barres
(remplissage auto via base propre ou OBF), jusqu'à 5 photos étiquetées, OCR
on-device (ML Kit) des ingrédients. Envoie vers `/api/admin/add-product` et
`/api/admin/add-photo`. Outil interne, protégé par `IMPORT_SECRET`.

## Déploiement

Déploiement automatique sur **Vercel** à chaque push sur `main`. Crons définis
dans `vercel.json` (newsletter hebdomadaire, import produit quotidien).

(c) 2026 Fiomio. Conçu entre Paris et Séoul.

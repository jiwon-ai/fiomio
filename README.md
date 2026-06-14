# Fiomio — Intelligence skincare adaptative

> **Korean Insider × Paris Observer.**
> La K-beauty décodée pour votre peau, votre ville et votre saison — une
> recommandation personnalisée et *expliquée*, pas une liste de best-sellers.

Landing page + démo interactive du moteur de recommandation Fiomio.
Bilingue **FR / EN** (français par défaut, cible : Parisiennes 25–35 ans).

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (design tokens en CSS-first via `@theme`)
- Polices : **Fraunces** (display) · **Inter** (texte) · **Geist Mono** (labels)
- i18n maison léger (contexte React, FR/EN, persistance localStorage)
- Aucune dépendance lourde — déploiement statique/edge sur **Vercel**

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de production :

```bash
npm run build && npm start
```

## Structure

```
src/
├─ app/
│  ├─ layout.tsx            # polices, SEO/metadata, <LangProvider>
│  ├─ page.tsx              # assemble les sections
│  ├─ globals.css           # design system (tokens @theme, utilitaires)
│  ├─ icon.svg              # favicon (auto-détecté)
│  ├─ opengraph-image.tsx   # carte de partage générée (1200×630)
│  ├─ sitemap.ts · robots.ts
│  └─ api/waitlist/route.ts # capture e-mail (webhook ou fichier local)
├─ components/              # Nav, Hero, Diagnostic, Waitlist, Footer, …
│  └─ SkinConstellation.tsx # visuel "données sur la peau" (SVG animé)
└─ lib/
   ├─ i18n.tsx · messages.ts   # dictionnaire bilingue FR/EN
   ├─ ingredients.ts           # base de connaissances des actifs K-beauty
   ├─ season.ts                # modèle climatique de Paris (saison → biais)
   └─ diagnostic.ts            # moteur de scoring (peau × climat × actifs)
```

## Le moteur de diagnostic

`lib/diagnostic.ts` est un modèle de scoring **transparent** (pas une boîte
noire) — un aperçu de la couche contextuelle que le produit complet
approfondira. Il croise :

1. **Profil cutané** — type de peau + réactivité
2. **Climat de Paris** — la saison courante est détectée et biaise les actifs
   (hiver → réparation/hydratation ; été → antioxydants/contrôle du sébum)
3. **Préoccupations** — pondérées par ordre de priorité
4. **Actifs déjà utilisés** — conflits (ex. rétinol + acide) et synergies
   (rétinol → on renforce la réparation de la barrière)

Sortie : 3 actifs classés, chacun **avec sa raison**, plus une logique de
routine et des précautions. Pour enrichir : éditez `lib/ingredients.ts`
(ajout d'actifs) et les règles de `lib/diagnostic.ts`.

## Liste d'attente (capture e-mail)

`POST /api/waitlist` accepte `{ email, lang, source }` et :

- **forwarde vers `WAITLIST_WEBHOOK_URL`** si défini (Google Sheet, Zapier,
  Formspree, Resend… — tout endpoint POST JSON) ;
- sinon, écrit dans `./data/waitlist.json` en dev local.

> ⚠️ Le système de fichiers est en lecture seule sur Vercel : **définissez
> `WAITLIST_WEBHOOK_URL` avant le lancement** pour ne perdre aucun lead.
> Voir `.env.example`.

## Déploiement (Vercel)

1. `git push` vers `github.com/jiwon-ai/fiomio`
2. Sur [vercel.com](https://vercel.com) → *New Project* → importez le repo
   (Next.js détecté automatiquement, aucune config requise)
3. Ajoutez la variable d'env `WAITLIST_WEBHOOK_URL`
4. *Domains* → reliez **fiomio.io** (le domaine est déjà actif)

## À faire ensuite (pistes)

- Brancher la météo/qualité de l'air de Paris en temps réel (au lieu de la
  saison estimée) — la vraie « variable climat ».
- Associer chaque actif recommandé à des **produits réels** + liens affiliés
  (le flux de revenu B2C, monnayable dès le jour 1).
- Pages SEO par actif (niacinamide, cica, rétinol, céramides…).
- Photographie sous licence pour les sections éditoriales (les visuels
  actuels sont 100 % CSS/SVG, sans dépendance à des images tierces).
- Mentions légales / politique de confidentialité (RGPD).

---

© Fiomio — conçu entre Paris et Séoul. Information éducative sur les
ingrédients cosmétiques ; ne constitue pas un avis dermatologique.

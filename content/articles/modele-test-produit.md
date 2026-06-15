---
title: "Modèle, test produit (dupliquez ce fichier)"
excerpt: "Le gabarit d'un test produit Fiomio. Dupliquez ce fichier, remplacez tout par votre vrai test et vos photos, puis passez draft à false."
date: "2026-06-14"
tags: ["Modèle"]
author: "Jiwon"
accent: "lime"
draft: true
type: "review"
product:
  name: "[Nom du produit]"
  brand: "[Marque]"
  category: "Essence"
  price: "≈ 00 €"
  rating: 8.5
  url: "https://exemple.com/produit?aff=fiomio"
  verdict: "[Une phrase qui résume tout, pour qui, dans quel climat.]"
pros:
  - "[Un point fort concret et précis]"
  - "[Un autre, la texture, l'absorption, l'effet observé]"
cons:
  - "[Un vrai défaut, l'honnêteté crée la confiance]"
photos:
  - src: ""
    label: "Avant"
    alt: "Ma peau avant le test"
  - src: ""
    label: "Après · 4 semaines"
    alt: "Ma peau après quatre semaines"
---

> **Comment utiliser ce modèle.** Dupliquez ce fichier, renommez-le (le nom de fichier devient l'URL), remplacez **tout** le contenu par votre vrai test, déposez vos photos dans `public/journal/`, puis passez `draft: true` à `false` pour le publier. Le bloc en haut (`product`, `pros`, `cons`, `photos`) alimente automatiquement la carte produit, les notes et la galerie avant/après.

## Pourquoi j'ai testé ce produit

[Plantez le décor, c'est ce qui rend un test crédible. Votre type de peau, le problème du moment, la météo de Paris cette semaine-là. Plus c'est précis, plus c'est vrai : « ma peau tiraillait depuis le retour du chauffage » vaut mieux que « ma peau était sèche ».]

## Mon expérience, semaine après semaine

[Le cœur du test. Décrivez ce que les autres ne disent pas : la texture, l'odeur, la sensation à l'application, le temps d'absorption. Ce qui a changé, et quand. Ce qui n'a **pas** marché. Une vraie chronologie bat dix superlatifs.]

[Vos photos avant/après s'affichent au-dessus. Pour insérer d'autres images dans le texte : `![légende](/journal/mon-produit/photo.jpg)`.]

## Pour quelle peau, à quel moment

[Reliez le produit au climat, c'est l'angle Fiomio. À qui le conseillez-vous, dans quel climat parisien, à quelle saison ? Et à qui le déconseillez-vous ?]

---

[Concluez avec votre verdict honnête, puis reportez-le dans `product.verdict` et `product.rating` en haut du fichier : ils s'affichent dans la carte produit et sur la vignette du journal.]

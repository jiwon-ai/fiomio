/* ============================================================
   FIOMIO — bilingual content dictionary
   `fr` is the canonical shape; `en` must match it.
   Sourced figures use the report's defensible numbers.
   ============================================================ */

export const fr = {
  langName: "FR",
  switchTo: "EN",

  nav: {
    problem: "Le problème",
    solution: "La solution",
    diagnostic: "Diagnostic",
    market: "Le marché",
    cta: "Rejoindre",
  },

  hero: {
    eyebrow: "Korean Insider × Paris Observer",
    titleLead: "La K-beauty décodée pour",
    titleEmph: "votre peau",
    titleMid: " — et pour le climat de",
    titleEmph2: "Paris",
    subtitle:
      "Les routines coréennes sont pensées pour Séoul. Fiomio croise votre profil cutané, le climat local et les actifs K-beauty pour une recommandation personnalisée — et expliquée. Pas une liste de best-sellers.",
    ctaPrimary: "Faire mon diagnostic",
    ctaSecondary: "Rejoindre la liste d'attente",
    scrollHint: "Découvrir",
    chip1: "Climat × Peau × Actifs",
    chip2: "Recommandation explicable",
    statMarketValue: "1,01 Md$",
    statMarketLabel: "Marché K-beauty France projeté en 2032",
    statTrustValue: "68 %",
    statTrustLabel: "des Français vérifient les recommandations d'influenceurs",
    statActivesValue: "52 %",
    statActivesLabel: "recherchent activement des actifs précis",
  },

  marquee: [
    "Niacinamide",
    "Centella asiatica",
    "Rétinol",
    "Céramides",
    "Acide hyaluronique",
    "Madécassoside",
    "Panthénol B5",
    "Squalane",
    "Vitamine C",
    "Mucine d'escargot",
    "Acide salicylique",
    "Peptides",
  ],

  problem: {
    eyebrow: "01 — Le problème",
    title: "Les consommateurs français sont perdus face à la K-beauty.",
    intro:
      "La K-beauty s'est imposée en France comme un phénomène d'achat de masse — mais sans grille de lecture locale. Quatre frictions structurent le problème.",
    items: [
      {
        title: "Offre saturée",
        body: "Des milliers de références coréennes arrivent sans filtre adapté au contexte local — une paralysie décisionnelle plutôt qu'un choix éclairé.",
      },
      {
        title: "Routines inadaptées",
        body: "La routine coréenne en dix étapes ne correspond ni au rythme ni aux contraintes de temps d'une active parisienne.",
      },
      {
        title: "Écart climatique Séoul / Paris",
        body: "Humidité, pollution, dureté de l'eau, chauffage : tout diffère. Une formule pensée pour un climat humide peut être insuffisante dans un hiver parisien sec.",
      },
      {
        title: "Absence d'intelligence locale",
        body: "La donnée — recherches, achats, abandons — existe, mais personne ne la structure. C'est précisément la barrière à l'entrée que Fiomio construit.",
      },
    ],
  },

  solution: {
    eyebrow: "02 — La solution",
    title: "Un moteur de recommandation contextuel, pas un décodeur d'étiquettes.",
    intro:
      "Fiomio transforme trois entrées en une sortie personnalisée et explicable. La valeur n'est pas seulement quoi appliquer, mais pourquoi ce soin convient à cette peau, dans ce climat, à cette saison.",
    steps: [
      {
        n: "01",
        title: "Profil cutané",
        body: "Type de peau, sensibilités et habitudes de routine — la variabilité individuelle.",
      },
      {
        n: "02",
        title: "Données climatiques",
        body: "Humidité, pollution, saison à Paris — la variable absente de tous les outils concurrents.",
      },
      {
        n: "03",
        title: "Analyse d'actifs",
        body: "Les actifs K-beauty sont décodés et pondérés, pas seulement listés.",
      },
    ],
    resultLabel: "Recommandation",
    resultTitle: "Des actifs adaptés, avec une explication.",
    resultBody:
      "Une logique de soin cohérente et justifiée — l'explicabilité qui construit la confiance dans un marché où l'influence en manque.",
    differentiatorLabel: "Différenciation",
    differentiator:
      "Yuka et INCI Beauty décodent déjà les étiquettes — ce terrain est saturé. L'avantage de Fiomio est la personnalisation contextuelle : climat × peau × actifs.",
  },

  diagnostic: {
    eyebrow: "03 — Diagnostic",
    title: "Voyez la logique Fiomio à l'œuvre.",
    intro:
      "Un aperçu du moteur. Renseignez votre peau et vos préoccupations — Fiomio croise la saison parisienne actuelle pour proposer des actifs argumentés.",
    demoBadge: "Démo — aperçu produit",
    step: "Étape",
    of: "sur",

    q1Title: "Quel est votre type de peau ?",
    q1Help: "Choisissez celui qui vous correspond le mieux aujourd'hui.",
    q2Title: "Votre peau est-elle réactive ?",
    q2Help: "Rougeurs, tiraillements ou inconfort fréquents.",
    q3Title: "Quelles sont vos préoccupations ?",
    q3Help: "Sélectionnez jusqu'à trois priorités.",
    q4Title: "Utilisez-vous déjà un actif fort ?",
    q4Help: "Ces actifs fragilisent la barrière — la recommandation s'adapte.",

    sensitiveYes: "Oui, réactive",
    sensitiveNo: "Non, tolérante",

    climateTitle: "Contexte pris en compte",
    climateCity: "Paris",
    climateNote: "détecté automatiquement",

    back: "Retour",
    next: "Continuer",
    seeResults: "Voir ma recommandation",
    restart: "Recommencer",
    pickAtLeastOne: "Sélectionnez au moins une préoccupation.",

    resultEyebrow: "Recommandation Fiomio",
    resultTitle: "Votre logique de soin",
    resultIntro: "Trois actifs, choisis pour votre peau et le climat parisien actuel — chacun avec sa raison.",
    why: "Pourquoi",
    howToUse: "Quand l'utiliser",
    priority: "Priorité",
    avoidTitle: "À manier avec précaution",
    routineTitle: "La logique d'ensemble",
    ctaAfterTitle: "Recevez votre routine complète au lancement",
    ctaAfterBody:
      "Le produit complet associera ces actifs à des produits réels, à votre budget et à la météo en temps réel.",
    disclaimer:
      "Aperçu éducatif à but informatif — ne remplace pas un avis dermatologique. Introduisez un nouvel actif progressivement et faites un test de tolérance.",
  },

  // Labels for the diagnostic options (values map to engine keys)
  skinTypes: [
    { key: "dry", label: "Sèche", desc: "Tiraille, peut desquamer" },
    { key: "combination", label: "Mixte", desc: "Zone T grasse, joues sèches" },
    { key: "oily", label: "Grasse", desc: "Brillance, pores visibles" },
    { key: "normal", label: "Normale", desc: "Équilibrée, peu de désagréments" },
  ],
  concerns: [
    { key: "redness", label: "Rougeurs & réactivité" },
    { key: "dehydration", label: "Déshydratation & tiraillements" },
    { key: "dullness", label: "Teint terne, manque d'éclat" },
    { key: "aging", label: "Anti-âge préventif, fermeté" },
    { key: "acne", label: "Imperfections & excès de sébum" },
    { key: "pores", label: "Pores & texture" },
    { key: "barrier", label: "Barrière abîmée, sensibilité" },
    { key: "pigmentation", label: "Taches & uniformité" },
  ],
  actives: [
    { key: "retinoid", label: "Rétinol / Rétinal" },
    { key: "exfoliant", label: "Exfoliant acide (AHA/BHA)" },
    { key: "vitc", label: "Vitamine C" },
    { key: "none", label: "Aucun pour l'instant" },
  ],

  market: {
    eyebrow: "04 — Le marché",
    title: "Un marché en forte croissance, sans intelligence locale.",
    intro:
      "Trois signaux convergent vers un positionnement expert : une demande en expansion, une défiance envers l'influence, une appétence pour les actifs précis.",
    stats: [
      {
        value: "522 M$ → 1,01 Md$",
        label: "Marché K-beauty France, 2023 → 2032 (CAGR +7,6 %)",
        source: "Credence Research, 2025",
      },
      {
        value: "68 %",
        label: "des Français recoupent les recommandations d'influenceurs avant d'acheter",
        source: "Sago, 2025",
      },
      {
        value: "52 %",
        label: "recherchent activement des produits aux actifs reconnaissables",
        source: "Market.us, 2026",
      },
      {
        value: "2ᵉ",
        label: "exportateur mondial de cosmétiques — la Corée du Sud (> 10,2 Mds$ en 2024)",
        source: "Korea Net / Weitnauer, 2025",
      },
    ],
  },

  positioning: {
    eyebrow: "05 — Positionnement",
    title: "Le seul acteur à l'intersection de trois univers.",
    intro:
      "Le décodage d'étiquettes est saturé. La valeur de Fiomio réside dans la couche de personnalisation contextuelle que personne d'autre ne propose.",
    axisX: "Généraliste → Spécialisé K-beauty",
    axisY: "Global → Ancrage local + climat",
    others: ["Yuka", "INCI Beauty", "INCIdecoder", "BeautyDecoded"],
    fiomioPoints: [
      "Korean insider + Paris observer",
      "Donnée climatique locale intégrée",
      "Analyse d'actifs K-beauty spécialisée",
    ],
  },

  waitlist: {
    eyebrow: "Rejoindre",
    title: "Soyez les premières à lire votre peau avec Fiomio.",
    body: "Inscrivez-vous pour l'accès anticipé. Vous recevrez votre diagnostic complet et votre routine personnalisée au lancement — sans spam, désinscription en un clic.",
    placeholder: "votre@email.com",
    button: "Rejoindre la liste",
    sending: "Envoi…",
    success: "Bienvenue. Vous êtes sur la liste — surveillez votre boîte mail.",
    errorEmail: "Veuillez entrer une adresse e-mail valide.",
    errorGeneric: "Une erreur est survenue. Réessayez dans un instant.",
    privacy: "Aucune revente de données. RGPD-friendly.",
    countNote: "Acquisition prioritaire — accès gratuit au lancement.",
  },

  footer: {
    tagline: "Intelligence skincare contextualisée — entre Paris et Séoul.",
    pillars: ["Korean Insider", "Paris Observer", "Data-Driven", "Ingredient-First"],
    nav: "Navigation",
    legalCol: "Légal",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    contact: "Contact",
    rights: "Tous droits réservés.",
    madeIn: "Conçu entre Paris et Séoul.",
    disclaimer:
      "Fiomio fournit une information éducative sur les ingrédients cosmétiques et ne constitue pas un avis médical ou dermatologique.",
  },
};

export type Messages = typeof fr;

export const en: Messages = {
  langName: "EN",
  switchTo: "FR",

  nav: {
    problem: "The problem",
    solution: "The solution",
    diagnostic: "Diagnostic",
    market: "The market",
    cta: "Join",
  },

  hero: {
    eyebrow: "Korean Insider × Paris Observer",
    titleLead: "K-beauty, decoded for",
    titleEmph: "your skin",
    titleMid: " — and for the climate of",
    titleEmph2: "Paris",
    subtitle:
      "Korean routines are designed for Seoul. Fiomio crosses your skin profile, your local climate and K-beauty actives into a personalized — and explained — recommendation. Not a list of best-sellers.",
    ctaPrimary: "Run my diagnostic",
    ctaSecondary: "Join the waitlist",
    scrollHint: "Discover",
    chip1: "Climate × Skin × Actives",
    chip2: "Explainable recommendation",
    statMarketValue: "$1.01B",
    statMarketLabel: "French K-beauty market projected for 2032",
    statTrustValue: "68%",
    statTrustLabel: "of French shoppers fact-check influencer recommendations",
    statActivesValue: "52%",
    statActivesLabel: "actively seek specific, recognizable actives",
  },

  marquee: [
    "Niacinamide",
    "Centella asiatica",
    "Retinol",
    "Ceramides",
    "Hyaluronic acid",
    "Madecassoside",
    "Panthenol B5",
    "Squalane",
    "Vitamin C",
    "Snail mucin",
    "Salicylic acid",
    "Peptides",
  ],

  problem: {
    eyebrow: "01 — The problem",
    title: "French consumers are lost in front of K-beauty.",
    intro:
      "K-beauty became a mass-market phenomenon in France — but with no local lens. Four frictions structure the problem.",
    items: [
      {
        title: "Saturated supply",
        body: "Thousands of Korean references arrive with no filter for the local context — decision paralysis rather than informed choice.",
      },
      {
        title: "Ill-fitting routines",
        body: "The ten-step Korean routine matches neither the rhythm nor the time constraints of a busy Parisian.",
      },
      {
        title: "Seoul / Paris climate gap",
        body: "Humidity, pollution, water hardness, heating: everything differs. A formula made for a humid climate can fall short in a dry Parisian winter.",
      },
      {
        title: "No local intelligence",
        body: "The data — searches, purchases, drop-offs — exists, but no one structures it. That is precisely the moat Fiomio is building.",
      },
    ],
  },

  solution: {
    eyebrow: "02 — The solution",
    title: "A contextual recommendation engine, not a label decoder.",
    intro:
      "Fiomio turns three inputs into one personalized, explainable output. The value is not only what to apply, but why this care fits this skin, in this climate, this season.",
    steps: [
      {
        n: "01",
        title: "Skin profile",
        body: "Skin type, sensitivities and routine habits — individual variability.",
      },
      {
        n: "02",
        title: "Climate data",
        body: "Humidity, pollution, season in Paris — the variable missing from every competing tool.",
      },
      {
        n: "03",
        title: "Active analysis",
        body: "K-beauty actives are decoded and weighted, not merely listed.",
      },
    ],
    resultLabel: "Recommendation",
    resultTitle: "Fitting actives, with an explanation.",
    resultBody:
      "A coherent, justified skincare logic — the explainability that builds trust in a market where influence falls short.",
    differentiatorLabel: "Differentiation",
    differentiator:
      "Yuka and INCI Beauty already decode labels — that ground is saturated. Fiomio's edge is contextual personalization: climate × skin × actives.",
  },

  diagnostic: {
    eyebrow: "03 — Diagnostic",
    title: "See the Fiomio logic at work.",
    intro:
      "A glimpse of the engine. Tell us about your skin and concerns — Fiomio factors in the current Parisian season to suggest reasoned actives.",
    demoBadge: "Demo — product preview",
    step: "Step",
    of: "of",

    q1Title: "What's your skin type?",
    q1Help: "Pick the one that fits you best today.",
    q2Title: "Is your skin reactive?",
    q2Help: "Frequent redness, tightness or discomfort.",
    q3Title: "What are your concerns?",
    q3Help: "Select up to three priorities.",
    q4Title: "Are you already using a strong active?",
    q4Help: "These weaken the barrier — the recommendation adapts.",

    sensitiveYes: "Yes, reactive",
    sensitiveNo: "No, tolerant",

    climateTitle: "Context factored in",
    climateCity: "Paris",
    climateNote: "auto-detected",

    back: "Back",
    next: "Continue",
    seeResults: "See my recommendation",
    restart: "Start over",
    pickAtLeastOne: "Select at least one concern.",

    resultEyebrow: "Fiomio recommendation",
    resultTitle: "Your skincare logic",
    resultIntro: "Three actives, chosen for your skin and the current Parisian climate — each with its reason.",
    why: "Why",
    howToUse: "When to use it",
    priority: "Priority",
    avoidTitle: "Handle with care",
    routineTitle: "The overall logic",
    ctaAfterTitle: "Get your full routine at launch",
    ctaAfterBody:
      "The full product will pair these actives with real products, your budget and live weather.",
    disclaimer:
      "Educational preview for information only — not a substitute for dermatological advice. Introduce any new active gradually and patch-test first.",
  },

  skinTypes: [
    { key: "dry", label: "Dry", desc: "Tight, may flake" },
    { key: "combination", label: "Combination", desc: "Oily T-zone, dry cheeks" },
    { key: "oily", label: "Oily", desc: "Shine, visible pores" },
    { key: "normal", label: "Normal", desc: "Balanced, few issues" },
  ],
  concerns: [
    { key: "redness", label: "Redness & reactivity" },
    { key: "dehydration", label: "Dehydration & tightness" },
    { key: "dullness", label: "Dullness, lack of glow" },
    { key: "aging", label: "Preventive aging, firmness" },
    { key: "acne", label: "Breakouts & excess oil" },
    { key: "pores", label: "Pores & texture" },
    { key: "barrier", label: "Damaged barrier, sensitivity" },
    { key: "pigmentation", label: "Dark spots & evenness" },
  ],
  actives: [
    { key: "retinoid", label: "Retinol / Retinal" },
    { key: "exfoliant", label: "Acid exfoliant (AHA/BHA)" },
    { key: "vitc", label: "Vitamin C" },
    { key: "none", label: "None for now" },
  ],

  market: {
    eyebrow: "04 — The market",
    title: "A fast-growing market, with no local intelligence.",
    intro:
      "Three signals converge toward an expert positioning: expanding demand, distrust of influence, appetite for precise actives.",
    stats: [
      {
        value: "$522M → $1.01B",
        label: "French K-beauty market, 2023 → 2032 (CAGR +7.6%)",
        source: "Credence Research, 2025",
      },
      {
        value: "68%",
        label: "of French shoppers cross-check influencer recommendations before buying",
        source: "Sago, 2025",
      },
      {
        value: "52%",
        label: "actively seek products with recognizable actives",
        source: "Market.us, 2026",
      },
      {
        value: "2nd",
        label: "largest cosmetics exporter worldwide — South Korea (> $10.2B in 2024)",
        source: "Korea Net / Weitnauer, 2025",
      },
    ],
  },

  positioning: {
    eyebrow: "05 — Positioning",
    title: "The only player at the intersection of three worlds.",
    intro:
      "Label decoding is saturated. Fiomio's value lies in the contextual personalization layer no one else offers.",
    axisX: "Generalist → K-beauty specialist",
    axisY: "Global → Local anchoring + climate",
    others: ["Yuka", "INCI Beauty", "INCIdecoder", "BeautyDecoded"],
    fiomioPoints: [
      "Korean insider + Paris observer",
      "Local climate data, integrated",
      "Specialized K-beauty active analysis",
    ],
  },

  waitlist: {
    eyebrow: "Join",
    title: "Be the first to read your skin with Fiomio.",
    body: "Sign up for early access. You'll get your full diagnostic and personalized routine at launch — no spam, one-click unsubscribe.",
    placeholder: "you@email.com",
    button: "Join the list",
    sending: "Sending…",
    success: "Welcome. You're on the list — keep an eye on your inbox.",
    errorEmail: "Please enter a valid email address.",
    errorGeneric: "Something went wrong. Try again in a moment.",
    privacy: "No data reselling. GDPR-friendly.",
    countNote: "Priority acquisition — free access at launch.",
  },

  footer: {
    tagline: "Contextual skincare intelligence — between Paris and Seoul.",
    pillars: ["Korean Insider", "Paris Observer", "Data-Driven", "Ingredient-First"],
    nav: "Navigation",
    legalCol: "Legal",
    legalNotice: "Legal notice",
    privacy: "Privacy",
    contact: "Contact",
    rights: "All rights reserved.",
    madeIn: "Crafted between Paris and Seoul.",
    disclaimer:
      "Fiomio provides educational information about cosmetic ingredients and does not constitute medical or dermatological advice.",
  },
};

export const dictionaries = { fr, en };
export type Lang = keyof typeof dictionaries;

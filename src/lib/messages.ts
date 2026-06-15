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
    solution: "Comment ça marche",
    diagnostic: "Diagnostic",
    market: "Le marché",
    journal: "Journal",
    cta: "Rejoindre",
  },

  hero: {
    eyebrow: "Diagnostic gratuit · pensé pour Paris",
    titleLead: "La K-beauty décodée pour",
    titleEmph: "votre peau",
    titleMid: " — et pour le climat de",
    titleEmph2: "votre ville",
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
    eyebrow: "Le vrai problème",
    title: "Trop de produits coréens. Aucun repère pour votre peau.",
    intro:
      "Vous achetez une essence parce qu'elle cartonne sur TikTok, sans savoir si elle est faite pour vous. Voilà pourquoi c'est si frustrant.",
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
        title: "Personne ne tient compte de Paris",
        body: "Aucun outil ne relie votre peau, votre ville et la saison. Résultat : vous testez à l'aveugle, et votre argent finit en flacons à moitié vides.",
      },
    ],
  },

  solution: {
    eyebrow: "Comment ça marche",
    title: "On ne décode pas une étiquette. On vous dit quoi mettre, et pourquoi.",
    intro:
      "Trois informations suffisent pour une recommandation personnalisée — et expliquée. Pas seulement quoi appliquer, mais pourquoi ce soin convient à votre peau, dans ce climat, à cette saison.",
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
      "La plupart des applis se contentent de décoder une étiquette. Fiomio va plus loin : elle croise votre peau, le climat de Paris et la saison pour vous dire quoi appliquer — et surtout pourquoi.",
  },

  whyDifferent: {
    eyebrow: "Pourquoi Fiomio",
    title: "Ce qui change tout pour votre peau.",
    items: [
      {
        title: "On lit votre peau, pas les tendances",
        body: "Pas de produit star imposé. Une recommandation construite à partir de votre type de peau et de vos vraies préoccupations.",
      },
      {
        title: "Le climat, pas seulement les ingrédients",
        body: "La météo de votre ville au moment où vous recevrez vos soins change ce qui fonctionne. On en tient compte — personne d'autre ne le fait.",
      },
      {
        title: "On vous dit toujours pourquoi",
        body: "Chaque conseil est expliqué. Vous comprenez ce que vous mettez sur votre peau, et pourquoi ça lui convient.",
      },
    ],
  },

  journalTeaser: {
    eyebrow: "Le journal",
    title: "Des tests produits honnêtes. Vraies photos, vrai avis.",
    body: "On teste, on photographie, on note sur 10 — sans filtre et sans complaisance. Recevez chaque semaine la météo-soin de Paris et nos derniers tests.",
    cta: "Voir le journal",
  },

  diagnostic: {
    eyebrow: "Votre diagnostic, gratuit",
    title: "Voyez ce que Fiomio vous recommande.",
    intro:
      "Un aperçu du moteur. Renseignez votre peau et vos préoccupations — Fiomio croise les prévisions météo de votre ville pour la semaine où vous recevrez vos produits, et propose des actifs argumentés.",
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
    deliveryAround: "Réception estimée",
    forecastSrc: "prévisions Open-Meteo",
    seasonEst: "estimation saisonnière",
    forecastLoading: "Lecture du ciel parisien…",
    leadTimeNote: "On vous conseille pour la météo que votre peau affrontera à la livraison — pas celle d'aujourd'hui.",
    changeCity: "changer",
    cityPlaceholder: "Votre ville…",
    detecting: "Localisation…",

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

  journal: {
    eyebrow: "Le journal",
    title: "La météo-soin de Paris",
    intro:
      "Chaque semaine, comment adapter votre peau au climat parisien — ingrédients décodés, anti-âge, gestes concrets. Zéro influence, rien que de l'expertise.",
    readMore: "Lire l'article",
    minRead: "min de lecture",
    backToJournal: "Le journal",
    by: "par",
    newsletterEyebrow: "La météo-soin",
    newsletterTitle: "Recevez la météo-soin de Paris chaque semaine",
    newsletterBody:
      "Le climat de la semaine + un conseil d'expert adapté à votre peau. Pas de spam, désinscription en un clic.",
    newsletterButton: "S'abonner",
    empty: "Les premiers tests produits arrivent très bientôt.",
    review: {
      rating: "Note",
      buy: "Acheter ce produit",
      verdict: "Le verdict",
      pros: "Ce que j'ai aimé",
      cons: "Ce que j'ai moins aimé",
      draftBadge: "Brouillon",
      photoPlaceholder: "Votre photo ici",
      testedBy: "Testé par",
    },
  },

  engagement: {
    eyebrow: "Notre engagement",
    title: "Les marques achètent de la visibilité. Jamais notre avis.",
    intro:
      "Vous recoupez les recommandations avant d'acheter ? Nous aussi. Voici nos règles — les mêmes que vous appliqueriez.",
    items: [
      {
        title: "On ne vend jamais notre avis",
        body: "Aucune marque ne peut acheter une recommandation, une note ou une place dans un classement.",
      },
      {
        title: "Transparence sur l'argent",
        body: "Les liens d'affiliation sont signalés : on touche une commission seulement si vous achetez — jamais en échange d'un avis favorable.",
      },
      {
        title: "La publicité est étiquetée",
        body: "Un espace sponsorisé est indiqué clairement, noir sur blanc, et séparé de nos tests.",
      },
      {
        title: "On dit aussi ce qui ne marche pas",
        body: "Un test honnête inclut les défauts. Sinon, ce n'est pas un test.",
      },
      {
        title: "Vos données restent les vôtres",
        body: "Jamais revendues. Conforme au RGPD, désinscription en un clic.",
      },
      {
        title: "Information, pas ordonnance",
        body: "Des conseils éducatifs sur les ingrédients, pas un avis médical.",
      },
    ],
    transparence: "Comment on gagne de l'argent",
    founderEyebrow: "Le mot de la fondatrice",
    founderNote:
      "Analyste de données et passionnée de cosmétique, coréenne installée à Paris. Fiomio est né de là. J'adore la K-beauty, mais ses formules sont pensées pour Séoul, pas pour le climat parisien. Alors j'ai appliqué mon métier, l'analyse de données, à ce que j'aime, le soin de la peau, pour comprendre ce qui marche vraiment selon votre peau, votre ville et la saison. Des recommandations expliquées, vérifiables, jamais sponsorisées.",
    founderSign: "Jiwon, fondatrice",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Vos questions, sans détour.",
    items: [
      {
        q: "C'est vraiment gratuit ?",
        a: "Oui. Le diagnostic et le contenu sont gratuits. On se rémunère via des liens d'affiliation (toujours signalés) et, plus tard, des rapports de marché vendus aux marques — jamais en vendant notre avis.",
      },
      {
        q: "Au fond, ce n'est pas de la pub déguisée ?",
        a: "Non. Une marque peut acheter de la visibilité clairement étiquetée, jamais une recommandation ni une note. Nos tests restent indépendants, payés ou non.",
      },
      {
        q: "Est-ce que ça marche vraiment pour MA peau ?",
        a: "Le diagnostic croise votre type de peau, vos préoccupations et la météo de votre ville. Chaque conseil est expliqué — à vous de juger. Introduisez toujours un actif à la fois.",
      },
      {
        q: "En quoi êtes-vous différents de Yuka ou INCI Beauty ?",
        a: "Ces applis décodent une étiquette, de façon générique. Fiomio personnalise : votre peau × votre climat × la saison, avec une recommandation expliquée.",
      },
      {
        q: "Mes données sont-elles en sécurité ?",
        a: "Vos réponses au diagnostic restent dans votre navigateur. Votre e-mail n'est jamais revendu et la désinscription se fait en un clic.",
      },
      {
        q: "Est-ce un avis médical ?",
        a: "Non. Fiomio fournit une information éducative sur les ingrédients. En cas de problème cutané, consultez un dermatologue.",
      },
    ],
  },

  footer: {
    tagline: "Le bon soin pour votre peau, votre ville, votre saison.",
    pillars: ["Peau", "Climat", "Actifs", "Sans influence"],
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
    solution: "How it works",
    diagnostic: "Diagnostic",
    market: "The market",
    journal: "Journal",
    cta: "Join",
  },

  hero: {
    eyebrow: "Free diagnostic · made for Paris",
    titleLead: "K-beauty, decoded for",
    titleEmph: "your skin",
    titleMid: " — and for the climate of",
    titleEmph2: "your city",
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
    eyebrow: "The real problem",
    title: "Too many Korean products. No compass for your skin.",
    intro:
      "You buy an essence because it's blowing up on TikTok, with no idea whether it's right for you. That's why it feels so frustrating.",
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
        title: "No one accounts for Paris",
        body: "No tool connects your skin, your city and the season. So you test blindly — and your money ends up in half-used bottles.",
      },
    ],
  },

  solution: {
    eyebrow: "How it works",
    title: "We don't decode a label. We tell you what to apply, and why.",
    intro:
      "Three pieces of info are enough for a personalized — and explained — recommendation. Not just what to apply, but why this care suits your skin, in this climate, this season.",
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
      "Most apps just decode a label. Fiomio goes further: it crosses your skin, the Paris climate and the season to tell you what to apply — and above all, why.",
  },

  whyDifferent: {
    eyebrow: "Why Fiomio",
    title: "What changes everything for your skin.",
    items: [
      {
        title: "We read your skin, not the trends",
        body: "No hero product forced on you. A recommendation built from your skin type and your real concerns.",
      },
      {
        title: "The climate, not just the ingredients",
        body: "Your city's weather when your products arrive changes what works. We factor it in — no one else does.",
      },
      {
        title: "We always tell you why",
        body: "Every tip is explained. You understand what you put on your skin, and why it suits it.",
      },
    ],
  },

  journalTeaser: {
    eyebrow: "The journal",
    title: "Honest product tests. Real photos, real verdicts.",
    body: "We test, we photograph, we score out of 10 — no filter, no flattery. Get the Paris skincare weather and our latest tests every week.",
    cta: "See the journal",
  },

  diagnostic: {
    eyebrow: "Your free diagnostic",
    title: "See what Fiomio recommends for you.",
    intro:
      "A glimpse of the engine. Tell us about your skin and concerns — Fiomio factors in your city's forecast for the week your products will arrive, and suggests reasoned actives.",
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
    deliveryAround: "Estimated delivery",
    forecastSrc: "Open-Meteo forecast",
    seasonEst: "seasonal estimate",
    forecastLoading: "Reading the Paris sky…",
    leadTimeNote: "We advise for the weather your skin will face on delivery — not today's.",
    changeCity: "change",
    cityPlaceholder: "Your city…",
    detecting: "Locating…",

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

  journal: {
    eyebrow: "The journal",
    title: "Paris skincare weather",
    intro:
      "Each week, how to adapt your skin to the Paris climate — ingredients decoded, anti-aging, concrete steps. Zero influence, only expertise.",
    readMore: "Read the article",
    minRead: "min read",
    backToJournal: "The journal",
    by: "by",
    newsletterEyebrow: "Skincare weather",
    newsletterTitle: "Get the Paris skincare weather every week",
    newsletterBody:
      "The week's climate + an expert tip tailored to your skin. No spam, one-click unsubscribe.",
    newsletterButton: "Subscribe",
    empty: "The first product tests are coming very soon.",
    review: {
      rating: "Rating",
      buy: "Buy this product",
      verdict: "The verdict",
      pros: "What I liked",
      cons: "What I liked less",
      draftBadge: "Draft",
      photoPlaceholder: "Your photo here",
      testedBy: "Tested by",
    },
  },

  engagement: {
    eyebrow: "Our promise",
    title: "Brands can buy visibility. Never our verdict.",
    intro:
      "You fact-check recommendations before buying? So do we. Here are our rules — the same ones you'd apply.",
    items: [
      {
        title: "We never sell our verdict",
        body: "No brand can buy a recommendation, a score, or a place in a ranking.",
      },
      {
        title: "Transparent about money",
        body: "Affiliate links are flagged: we earn a commission only if you buy — never in exchange for a favorable review.",
      },
      {
        title: "Advertising is labeled",
        body: "Any sponsored space is clearly marked and kept separate from our tests.",
      },
      {
        title: "We also say what doesn't work",
        body: "An honest test includes the flaws. Otherwise it isn't a test.",
      },
      {
        title: "Your data stays yours",
        body: "Never resold. GDPR-compliant, one-click unsubscribe.",
      },
      {
        title: "Information, not a prescription",
        body: "Educational guidance on ingredients, not medical advice.",
      },
    ],
    transparence: "How we make money",
    founderEyebrow: "From the founder",
    founderNote:
      "A data analyst and a cosmetics lover, Korean, living in Paris. Fiomio grew out of that. I love K-beauty, but its formulas are made for Seoul, not for the Paris climate. So I applied my craft, data analysis, to what I love, skincare, to understand what actually works for your skin, your city and the season. Recommendations that are explained, verifiable, and never sponsored.",
    founderSign: "Jiwon, founder",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Your questions, straight up.",
    items: [
      {
        q: "Is it really free?",
        a: "Yes. The diagnostic and the content are free. We earn through affiliate links (always flagged) and, later, market reports sold to brands — never by selling our verdict.",
      },
      {
        q: "Isn't this just disguised advertising?",
        a: "No. A brand can buy clearly-labeled visibility, never a recommendation or a score. Our tests stay independent, paid or not.",
      },
      {
        q: "Does it really work for MY skin?",
        a: "The diagnostic crosses your skin type, your concerns and your city's weather. Every tip is explained — you decide. Always introduce one active at a time.",
      },
      {
        q: "How are you different from Yuka or INCI Beauty?",
        a: "Those apps decode a label, generically. Fiomio personalizes: your skin × your climate × the season, with an explained recommendation.",
      },
      {
        q: "Is my data safe?",
        a: "Your diagnostic answers stay in your browser. Your email is never resold and unsubscribing takes one click.",
      },
      {
        q: "Is this medical advice?",
        a: "No. Fiomio provides educational information about ingredients. For any skin condition, see a dermatologist.",
      },
    ],
  },

  footer: {
    tagline: "The right care for your skin, your city, your season.",
    pillars: ["Skin", "Climate", "Actives", "No influencers"],
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

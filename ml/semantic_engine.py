# Fiomio — Semantic ingredient matching
#
# Two-tier strategy:
#   Tier 1 (always available): TF-IDF cosine similarity via scikit-learn
#   Tier 2 (when downloaded):  Neural sentence embeddings via sentence-transformers
#
# Falls back to Tier 1 automatically if Tier 2 model is unavailable.

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

INGREDIENT_DESCRIPTIONS = {
    "ceramides":    "Repairs skin barrier locks in moisture reduces redness dryness rebuilds lipid layer dehydration",
    "hyaluronic":   "Deep hydration plumps replenishes water reduces tightness dehydrated skin all skin types",
    "niacinamide":  "Minimises pores controls oil sebum evens skin tone reduces redness dark spots brightening",
    "centella":     "Calms reactive sensitive skin reduces redness inflammation soothes irritation barrier repair",
    "panthenol":    "Soothes irritated skin attracts moisture buffers retinol cold weather barrier recovery",
    "snail":        "Hydrates repairs bounce tired dull skin scarring acne marks",
    "vitaminc":     "Brightens complexion fades dark spots hyperpigmentation antioxidant pollution protection",
    "azelaic":      "Calms redness rosacea clears breakouts acne fades post-acne marks sensitive skin",
    "salicylic":    "Unclogs pores controls oil blackheads acne exfoliates inside pores oily skin",
    "retinol":      "Anti-aging fine lines wrinkles increases cell turnover firmness mature skin",
    "peptides":     "Builds collagen elastin firms plumps anti-aging mature skin sensitive",
    "allantoin":    "Soothes heals irritated skin calms redness speeds barrier recovery sensitive",
    "betaglucan":   "Long-lasting hydration calms inflammation repairs barrier gentle everyday moisturiser",
    "bakuchiol":    "Plant retinol alternative firms smooths without irritation safe pregnancy",
    "tranexamic":   "Fades stubborn dark spots pigmentation calms redness tolerated sensitive skin",
    "arbutin":      "Gently brightens fades hyperpigmentation evens skin tone reduces melanin",
    "galactomyces": "Ferment essence refines skin texture brightens glow minimises pores",
    "greentea":     "Antioxidant shield pollution regulates sebum calms redness acne oily skin",
    "heartleaf":    "K-beauty soother blemish-prone skin calms without drying reduces redness",
    "mandelic":     "Gentle AHA exfoliant acne pigmentation safer glycolic sensitive skin",
    "glycolic":     "Strong AHA exfoliant brightens resurfaces smooths texture fades spots",
    "lactic":       "Hydrating AHA exfoliant gentle brightening dry dull skin",
}

_ING_IDS   = list(INGREDIENT_DESCRIPTIONS.keys())
_ING_TEXTS = list(INGREDIENT_DESCRIPTIONS.values())

# Tier 1: TF-IDF (always works, zero network dependency)
_tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
_tfidf_matrix = _tfidf.fit_transform(_ING_TEXTS)


def _tfidf_scores(user_text: str) -> dict[str, float]:
    user_vec = _tfidf.transform([user_text])
    sims = cosine_similarity(user_vec, _tfidf_matrix)[0]
    return dict(zip(_ING_IDS, sims.tolist()))


# Tier 2: Neural embeddings (better quality, needs model downloaded from HuggingFace)
_neural_model = None
SEMANTIC_MODE = "tfidf"
try:
    from sentence_transformers import SentenceTransformer
    _neural_model = SentenceTransformer("all-MiniLM-L6-v2")
    _neural_vecs  = _neural_model.encode(_ING_TEXTS, normalize_embeddings=True)
    SEMANTIC_MODE = "neural"
except Exception:
    pass

SEMANTIC_AVAILABLE = True   # TF-IDF is always available


def semantic_scores(user_text: str) -> dict[str, float]:
    """
    Cosine-similarity score (0–1) for each ingredient vs user's free-text concerns.
    Uses neural embeddings when available (SEMANTIC_MODE='neural'),
    falls back to TF-IDF (SEMANTIC_MODE='tfidf').
    """
    if not user_text.strip():
        return {ing: 0.0 for ing in _ING_IDS}

    if SEMANTIC_MODE == "neural":
        user_vec = _neural_model.encode(user_text, normalize_embeddings=True)
        sims = (_neural_vecs @ user_vec).tolist()
        return dict(zip(_ING_IDS, sims))

    return _tfidf_scores(user_text)

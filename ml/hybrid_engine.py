# Fiomio — Hybrid recommendation engine
#
# Combines four signals:
#   ① Rule engine   (explainability, domain knowledge)
#   ② ML model      (learned patterns from synthetic data)
#   ③ Semantic search (natural-language concern matching)
#   ④ LLM re-ranking (Claude reasons about edge cases)
#
# Final score = weighted ensemble of ①②③, then ④ reorders.

import numpy as np
import joblib
from fiomio_engine import (
    run_diagnostic, INGREDIENT_IDS, INGREDIENTS,
    encode_profile, _score_ingredient,
    SKIN_TYPES, CONCERNS, ACTIVE_USES, AGE_RANGES, GENDERS, PREGNANCIES,
)
from semantic_engine import semantic_scores, SEMANTIC_AVAILABLE
from llm_engine import llm_rerank, llm_explain, LLM_AVAILABLE


def _rule_scores(profile: dict) -> dict[str, float]:
    """Raw rule-engine scores, normalised to [0, 1]."""
    seen, scores = set(), {}
    for ing in INGREDIENTS:
        if ing["id"] in seen:
            continue
        seen.add(ing["id"])
        scores[ing["id"]] = _score_ingredient(
            ing,
            profile["skin_type"],
            profile["sensitive"],
            profile["concerns"],
            profile["active_use"],
            profile["age_range"],
            profile["pregnancy"],
        )
    # min-max normalise
    vals = list(scores.values())
    lo, hi = min(vals), max(vals)
    if hi == lo:
        return {k: 0.5 for k in scores}
    return {k: (v - lo) / (hi - lo) for k, v in scores.items()}


def _ml_scores(profile: dict, model, ingredient_ids: list[str]) -> dict[str, float]:
    """Per-ingredient ML probability from the trained Random Forest."""
    vec = np.array(encode_profile(profile)).reshape(1, -1)

    def get_prob(est):
        pr = est.predict_proba(vec)[0]
        return float(pr[1]) if len(pr) > 1 else 0.0

    probs = [get_prob(est) for est in model.estimators_]
    return dict(zip(ingredient_ids, probs))


def hybrid_recommend(
    profile: dict,
    model,
    ingredient_ids: list[str],
    n: int = 3,
    weights: tuple = (0.35, 0.35, 0.30),   # rule, ml, semantic
) -> dict:
    """
    Returns:
      top_n       — list of (ingredient_id, scores_dict)
      explanation — personalised text from Claude (empty string if unavailable)
      signals     — which engines were active
    """
    w_rule, w_ml, w_sem = weights

    rule  = _rule_scores(profile)
    ml    = _ml_scores(profile, model, ingredient_ids)

    # Semantic: use free_text if provided, else join concern keywords
    text_input = profile.get("free_text") or " ".join(profile["concerns"])
    sem = semantic_scores(text_input)

    # Ensemble
    all_ids = list({ing["id"] for ing in INGREDIENTS})
    combined = {}
    for ing_id in all_ids:
        combined[ing_id] = (
            w_rule * rule.get(ing_id, 0) +
            w_ml   * ml.get(ing_id, 0)  +
            w_sem  * sem.get(ing_id, 0)
        )

    # Top-N candidates (take top 6 before LLM reranks to top 3)
    candidates = sorted(combined, key=lambda x: -combined[x])[:6]

    # LLM re-ranking
    reranked = llm_rerank(profile, candidates)
    top_n_ids = reranked[:n] if reranked else candidates[:n]

    top_n = [
        {
            "id": ing_id,
            "scores": {
                "rule":     round(rule.get(ing_id, 0), 3),
                "ml":       round(ml.get(ing_id, 0), 3),
                "semantic": round(sem.get(ing_id, 0), 3),
                "final":    round(combined.get(ing_id, 0), 3),
            },
        }
        for ing_id in top_n_ids
    ]

    explanation = llm_explain(profile, top_n_ids)

    return {
        "recommendations": top_n,
        "explanation":     explanation,
        "signals_used":    {
            "rule_engine":     True,
            "ml_model":        True,
            "semantic_search": SEMANTIC_AVAILABLE,
            "llm_reranking":   LLM_AVAILABLE,
        },
    }

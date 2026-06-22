# Fiomio Skin Recommendation API
# Run:  uvicorn api:app --reload
# Docs: http://localhost:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, Optional
import numpy as np
import joblib

from fiomio_engine import run_diagnostic, INGREDIENT_IDS, INGREDIENTS, encode_profile
from hybrid_engine import hybrid_recommend
from llm_engine import LLM_AVAILABLE
from semantic_engine import SEMANTIC_AVAILABLE

# ── App ────────────────────────────────────────────────
app = FastAPI(title="Fiomio Skin Recommendation API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict to fiomio domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load ML model ──────────────────────────────────────
model          = joblib.load("fiomio_model.pkl")
ingredient_ids = joblib.load("ingredient_ids.pkl")


# ── Schemas ────────────────────────────────────────────
class SkinProfile(BaseModel):
    skin_type:  Literal["dry", "combination", "oily", "normal"]
    sensitive:  bool
    concerns:   list[str]
    active_use: Literal["none", "retinoid", "exfoliant", "vitc"]
    age_range:  Literal["u25", "a25_34", "a35_44", "a45p"]
    gender:     Literal["female", "male", "other"]
    pregnancy:  Literal["none", "pregnant", "trying"]
    free_text:  Optional[str] = None   # NEW: natural-language concern description

class IngredientScore(BaseModel):
    rule:     float
    ml:       float
    semantic: float
    final:    float

class IngredientRec(BaseModel):
    id:         str
    confidence: float           # for backward compat
    scores:     Optional[IngredientScore] = None

class SignalsUsed(BaseModel):
    rule_engine:     bool
    ml_model:        bool
    semantic_search: bool
    llm_reranking:   bool

class RecommendResponse(BaseModel):
    ml_recommendations:   list[IngredientRec]
    rule_recommendations: list[str]
    agreement:            bool

class HybridResponse(BaseModel):
    recommendations: list[dict]
    explanation:     str
    signals_used:    dict
    rule_baseline:   list[str]   # what the rule engine alone would give


# ── Endpoints ──────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status":           "ok",
        "service":          "Fiomio Skin Recommendation API v2",
        "engines_available": {
            "ml_model":        True,
            "semantic_search": SEMANTIC_AVAILABLE,
            "llm":             LLM_AVAILABLE,
        },
    }


@app.post("/recommend", response_model=RecommendResponse)
def recommend(profile: SkinProfile):
    """Original ML-only endpoint (v1, kept for backward compatibility)."""
    p   = profile.model_dump()
    vec = np.array(encode_profile(p)).reshape(1, -1)

    def get_proba(est):
        pr = est.predict_proba(vec)[0]
        return float(pr[1]) if len(pr) > 1 else 0.0

    proba       = np.array([get_proba(est) for est in model.estimators_])
    top_indices = np.argsort(proba)[::-1][:3]

    ml_recs   = [IngredientRec(id=ingredient_ids[i], confidence=round(proba[i], 3)) for i in top_indices]
    rule_recs = run_diagnostic(**{k: v for k, v in p.items() if k != "free_text"})

    return RecommendResponse(
        ml_recommendations=ml_recs,
        rule_recommendations=rule_recs,
        agreement={r.id for r in ml_recs} == set(rule_recs[:3]),
    )


@app.post("/recommend/hybrid", response_model=HybridResponse)
def recommend_hybrid(profile: SkinProfile):
    """
    Hybrid endpoint combining:
      Rule engine + ML model + Semantic search + LLM re-ranking + LLM explanation
    Accepts optional free_text for natural-language concern input.
    """
    p = profile.model_dump()

    result = hybrid_recommend(p, model, ingredient_ids)

    rule_baseline = run_diagnostic(**{k: v for k, v in p.items() if k != "free_text"})

    return HybridResponse(
        recommendations=result["recommendations"],
        explanation=result["explanation"],
        signals_used=result["signals_used"],
        rule_baseline=rule_baseline,
    )


@app.get("/ingredients")
def list_ingredients():
    return [{"id": ing["id"], "targets": ing["targets"]} for ing in INGREDIENTS]


@app.get("/health")
def health():
    return {
        "status":           "ok",
        "model_loaded":     model is not None,
        "semantic_search":  SEMANTIC_AVAILABLE,
        "llm":              LLM_AVAILABLE,
    }

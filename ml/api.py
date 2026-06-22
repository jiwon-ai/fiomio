# Fiomio Skin Recommendation API
# Run:  uvicorn api:app --reload
# Docs: http://localhost:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import numpy as np
import joblib

from fiomio_engine import run_diagnostic, INGREDIENT_IDS, INGREDIENTS, encode_profile

# ── App setup ──────────────────────────────────────────
app = FastAPI(title="Fiomio Skin Recommendation API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev only — restrict to fiomio domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model ─────────────────────────────────────────
model          = joblib.load("fiomio_model.pkl")
ingredient_ids = joblib.load("ingredient_ids.pkl")


# ── Schemas ────────────────────────────────────────────
class SkinProfile(BaseModel):
    skin_type:  Literal["dry", "combination", "oily", "normal"]
    sensitive:  bool
    concerns:   list[str]   # up to 3 from CONCERNS
    active_use: Literal["none", "retinoid", "exfoliant", "vitc"]
    age_range:  Literal["u25", "a25_34", "a35_44", "a45p"]
    gender:     Literal["female", "male", "other"]
    pregnancy:  Literal["none", "pregnant", "trying"]

class IngredientRec(BaseModel):
    id:         str
    confidence: float   # ML probability (0–1)

class RecommendResponse(BaseModel):
    ml_recommendations:   list[IngredientRec]
    rule_recommendations: list[str]   # rule engine output for comparison
    agreement:            bool        # True when both agree on top-3


# ── Endpoints ──────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "service": "Fiomio Skin Recommendation API"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(profile: SkinProfile):
    p   = profile.model_dump()
    vec = np.array(encode_profile(p)).reshape(1, -1)

    # single-class estimators return 1 column — guard against index error
    def get_proba(est):
        pr = est.predict_proba(vec)[0]
        return float(pr[1]) if len(pr) > 1 else 0.0

    proba       = np.array([get_proba(est) for est in model.estimators_])
    top_indices = np.argsort(proba)[::-1][:3]

    ml_recs = [
        IngredientRec(id=ingredient_ids[i], confidence=round(proba[i], 3))
        for i in top_indices
    ]

    rule_recs = run_diagnostic(**p)
    agreement = {r.id for r in ml_recs} == set(rule_recs[:3])

    return RecommendResponse(
        ml_recommendations=ml_recs,
        rule_recommendations=rule_recs,
        agreement=agreement,
    )


@app.get("/ingredients")
def list_ingredients():
    return [{"id": ing["id"], "targets": ing["targets"]} for ing in INGREDIENTS]


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

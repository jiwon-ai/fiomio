# Fiomio 추천 API
# 실행: uvicorn api:app --reload
# 테스트: http://localhost:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import numpy as np
import joblib

from fiomio_engine import run_diagnostic, INGREDIENT_IDS, INGREDIENTS, encode_profile

# ── 앱 설정 ────────────────────────────────────────────
app = FastAPI(title="Fiomio Skin API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 개발용 (프로덕션에선 Fiomio 도메인만)
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 모델 로드 ────────────────────────────────────────────
model          = joblib.load("fiomio_model.pkl")
ingredient_ids = joblib.load("ingredient_ids.pkl")

INGREDIENT_INFO = {ing["id"]: ing for ing in INGREDIENTS}


# ── 요청/응답 스키마 ──────────────────────────────────────
class SkinProfile(BaseModel):
    skin_type:  Literal["dry", "combination", "oily", "normal"]
    sensitive:  bool
    concerns:   list[str]           # 최대 3개
    active_use: Literal["none", "retinoid", "exfoliant", "vitc"]
    age_range:  Literal["u25", "a25_34", "a35_44", "a45p"]
    gender:     Literal["female", "male", "other"]
    pregnancy:  Literal["none", "pregnant", "trying"]

class IngredientRec(BaseModel):
    id:         str
    confidence: float   # ML 모델 확률

class RecommendResponse(BaseModel):
    ml_recommendations:   list[IngredientRec]
    rule_recommendations: list[str]      # 규칙 엔진 결과 (비교용)
    agreement:            bool           # 둘이 일치하는지


# ── 엔드포인트 ────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "service": "Fiomio Skin Recommendation API"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(profile: SkinProfile):
    p = profile.model_dump()

    # ML 예측
    vec   = np.array(encode_profile(p)).reshape(1, -1)
    # 단일 클래스 추정기는 열이 1개 → [1] 접근 불가, 0으로 처리
    def get_proba(est):
        p = est.predict_proba(vec)[0]
        return p[1] if len(p) > 1 else 0.0
    proba = np.array([get_proba(est) for est in model.estimators_])

    # 확률 높은 순으로 정렬 → top3
    top_indices = np.argsort(proba)[::-1][:3]
    ml_recs = [
        IngredientRec(id=ingredient_ids[i], confidence=round(float(proba[i]), 3))
        for i in top_indices
    ]

    # 규칙 엔진 결과 (비교용)
    rule_recs = run_diagnostic(**p)

    ml_ids  = {r.id for r in ml_recs}
    agreement = ml_ids == set(rule_recs[:3])

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

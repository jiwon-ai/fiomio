# ML Project 02 - Fiomio 피부 성분 추천 ML 모델
#
# 현재 Fiomio: TypeScript 규칙 엔진 (점수 계산 if-else)
# 목표:        규칙 엔진을 ML로 학습 → 나중에 실유저 피드백으로 개선 가능한 구조
#
# 전략:
#   1. 규칙 엔진으로 합성 학습 데이터 5000개 생성
#   2. 입력(피부 프로파일) → 출력(추천 성분 top3) 학습
#   3. 새 유저 입력 → ML이 즉시 추천

import numpy as np
import pandas as pd
import random
from itertools import combinations
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

from fiomio_engine import run_diagnostic, INGREDIENTS

# ══════════════════════════════════════════════════════
# 1. 합성 데이터 생성
# ══════════════════════════════════════════════════════
print("=" * 55)
print("1. 합성 학습 데이터 생성 (규칙 엔진 활용)")
print("=" * 55)

SKIN_TYPES  = ["dry", "combination", "oily", "normal"]
CONCERNS    = ["redness","dehydration","dullness","aging","acne","pores","barrier","pigmentation"]
ACTIVE_USES = ["none", "retinoid", "exfoliant", "vitc"]
AGE_RANGES  = ["u25", "a25_34", "a35_44", "a45p"]
GENDERS     = ["female", "male", "other"]
PREGNANCIES = ["none", "pregnant", "trying"]

INGREDIENT_IDS = list({ing["id"] for ing in INGREDIENTS})
INGREDIENT_IDS.sort()

random.seed(42)

def random_profile():
    n_concerns = random.randint(1, 3)
    concerns   = random.sample(CONCERNS, n_concerns)
    return {
        "skin_type":  random.choice(SKIN_TYPES),
        "sensitive":  random.choice([True, False]),
        "concerns":   concerns,
        "active_use": random.choice(ACTIVE_USES),
        "age_range":  random.choice(AGE_RANGES),
        "gender":     random.choice(GENDERS),
        "pregnancy":  random.choice(PREGNANCIES),
    }

def encode_profile(p):
    # 원-핫 + 멀티-핫 인코딩
    row = []
    row += [1 if p["skin_type"] == s else 0 for s in SKIN_TYPES]
    row += [1 if p["sensitive"] else 0]
    row += [1 if c in p["concerns"] else 0 for c in CONCERNS]
    row += [1 if p["active_use"] == a else 0 for a in ACTIVE_USES]
    row += [1 if p["age_range"]  == a else 0 for a in AGE_RANGES]
    row += [1 if p["gender"]     == g else 0 for g in GENDERS]
    row += [1 if p["pregnancy"]  == pr else 0 for pr in PREGNANCIES]
    return row

def encode_labels(top3):
    # 각 성분이 top3에 포함됐는지 (멀티-라벨)
    return [1 if ing_id in top3 else 0 for ing_id in INGREDIENT_IDS]

N = 5000
rows, labels = [], []
for _ in range(N):
    p    = random_profile()
    top3 = run_diagnostic(**p)
    rows.append(encode_profile(p))
    labels.append(encode_labels(top3))

X = np.array(rows)
y = np.array(labels)

print(f"생성된 샘플: {N}개")
print(f"입력 특성 수: {X.shape[1]}")
print(f"출력 성분 수: {y.shape[1]}")
print(f"성분별 추천 빈도 상위 5:")
freq = pd.Series(y.sum(axis=0), index=INGREDIENT_IDS).sort_values(ascending=False)
for ing, cnt in freq.head(5).items():
    bar = "█" * int(cnt / 50)
    print(f"  {cnt:5d} {bar:20s} {ing}")


# ══════════════════════════════════════════════════════
# 2. 학습
# ══════════════════════════════════════════════════════
print("\n" + "=" * 55)
print("2. Random Forest 학습")
print("=" * 55)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = MultiOutputClassifier(
    RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
)
model.fit(X_train, y_train)
print("학습 완료")


# ══════════════════════════════════════════════════════
# 3. 평가 - ML vs 규칙 엔진 비교
# ══════════════════════════════════════════════════════
print("\n" + "=" * 55)
print("3. 평가 — ML vs 규칙 엔진")
print("=" * 55)

y_pred = model.predict(X_test)

# 정확히 일치하는 top3 비율
exact_match = np.all(y_pred == y_test, axis=1).mean()

# 성분 단위 정확도
per_ingredient_acc = [accuracy_score(y_test[:, i], y_pred[:, i]) for i in range(y.shape[1])]
mean_acc = np.mean(per_ingredient_acc)

print(f"Top-3 완전 일치율:   {exact_match:.1%}")
print(f"성분별 평균 정확도:  {mean_acc:.1%}")

# 성분별 정확도 상세
print("\n[성분별 정확도]")
ing_acc = pd.Series(per_ingredient_acc, index=INGREDIENT_IDS).sort_values(ascending=False)
for ing, acc in ing_acc.items():
    bar = "█" * int(acc * 20)
    print(f"  {acc:.0%}  {bar:20s} {ing}")


# ══════════════════════════════════════════════════════
# 4. 실제 추천 시연
# ══════════════════════════════════════════════════════
print("\n" + "=" * 55)
print("4. 실제 유저 추천 시연")
print("=" * 55)

test_users = [
    {"skin_type":"dry",   "sensitive":True,  "concerns":["redness","barrier","dehydration"], "active_use":"retinoid","age_range":"a35_44","gender":"female","pregnancy":"none",     "label":"건성 민감 35세 여성, 레티놀 사용 중"},
    {"skin_type":"oily",  "sensitive":False, "concerns":["acne","pores"],                   "active_use":"none",    "age_range":"u25",    "gender":"male",  "pregnancy":"none",     "label":"지성 25세 미만 남성, 여드름 고민"},
    {"skin_type":"normal","sensitive":False, "concerns":["pigmentation","dullness","aging"], "active_use":"vitc",   "age_range":"a45p",   "gender":"female","pregnancy":"none",     "label":"일반 45세+ 여성, 비타민C 사용 중"},
    {"skin_type":"combination","sensitive":True,"concerns":["acne","redness"],              "active_use":"none",    "age_range":"a25_34", "gender":"female","pregnancy":"pregnant", "label":"복합성 민감 임신 중"},
]

for user in test_users:
    label = user.pop("label")
    vec   = np.array(encode_profile(user)).reshape(1, -1)
    pred  = model.predict(vec)[0]
    ml_recs  = [INGREDIENT_IDS[i] for i, v in enumerate(pred) if v == 1]
    rule_recs = run_diagnostic(**user)

    print(f"\n[{label}]")
    print(f"  규칙 엔진: {rule_recs}")
    print(f"  ML 모델:   {ml_recs}")
    match = set(ml_recs) == set(rule_recs[:len(ml_recs)])
    print(f"  일치:      {'✅' if match else '⚠️  차이 있음 (ML이 다른 패턴 학습)'}")


# ══════════════════════════════════════════════════════
# 5. 모델 저장
# ══════════════════════════════════════════════════════
print("\n" + "=" * 55)
print("5. 모델 저장")
print("=" * 55)

joblib.dump(model,          "fiomio_model.pkl")
joblib.dump(INGREDIENT_IDS, "ingredient_ids.pkl")
print("fiomio_model.pkl 저장 완료")
print("\n다음 단계:")
print("  실유저 피드백 수집 → 이 모델 재학습 → 개인화 추천 강화")
print("  FastAPI로 감싸면 → Fiomio 백엔드 API로 바로 연결 가능")

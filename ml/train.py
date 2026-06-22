# Fiomio skin ingredient recommendation — ML training script
#
# Current Fiomio: TypeScript rule engine (score-based if-else)
# Goal: learn from the rule engine → retrain later on real user feedback
#
# Strategy:
#   1. Generate 5,000 synthetic profiles using the rule engine as ground truth
#   2. Train a multi-label Random Forest (input: skin profile → output: top-3 ingredients)
#   3. Save model for use in api.py

import numpy as np
import pandas as pd
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

from fiomio_engine import (
    run_diagnostic, INGREDIENTS, INGREDIENT_IDS,
    SKIN_TYPES, CONCERNS, ACTIVE_USES, AGE_RANGES, GENDERS, PREGNANCIES,
    encode_profile,
)

# ── 1. Generate synthetic training data ────────────────
print("=" * 55)
print("1. Generating synthetic training data")
print("=" * 55)

random.seed(42)

def random_profile():
    return {
        "skin_type":  random.choice(SKIN_TYPES),
        "sensitive":  random.choice([True, False]),
        "concerns":   random.sample(CONCERNS, random.randint(1, 3)),
        "active_use": random.choice(ACTIVE_USES),
        "age_range":  random.choice(AGE_RANGES),
        "gender":     random.choice(GENDERS),
        "pregnancy":  random.choice(PREGNANCIES),
    }

def encode_labels(top3):
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

print(f"Samples generated : {N}")
print(f"Input features    : {X.shape[1]}")
print(f"Output ingredients: {y.shape[1]}")
print(f"\nTop-5 most recommended ingredients:")
freq = pd.Series(y.sum(axis=0), index=INGREDIENT_IDS).sort_values(ascending=False)
for ing, cnt in freq.head(5).items():
    bar = "█" * int(cnt / 50)
    print(f"  {cnt:5d}  {bar:20s}  {ing}")


# ── 2. Train ───────────────────────────────────────────
print("\n" + "=" * 55)
print("2. Training Random Forest")
print("=" * 55)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = MultiOutputClassifier(
    RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
)
model.fit(X_train, y_train)
print("Training complete.")


# ── 3. Evaluate ────────────────────────────────────────
print("\n" + "=" * 55)
print("3. Evaluation — ML vs rule engine")
print("=" * 55)

y_pred = model.predict(X_test)

exact_match = np.all(y_pred == y_test, axis=1).mean()
per_ing_acc = [accuracy_score(y_test[:, i], y_pred[:, i]) for i in range(y.shape[1])]
mean_acc    = np.mean(per_ing_acc)

print(f"Exact top-3 match : {exact_match:.1%}")
print(f"Mean per-ingredient accuracy: {mean_acc:.1%}")

print("\n[Per-ingredient accuracy]")
ing_acc = pd.Series(per_ing_acc, index=INGREDIENT_IDS).sort_values(ascending=False)
for ing, acc in ing_acc.items():
    bar = "█" * int(acc * 20)
    print(f"  {acc:.0%}  {bar:20s}  {ing}")


# ── 4. Demo predictions ────────────────────────────────
print("\n" + "=" * 55)
print("4. Sample predictions")
print("=" * 55)

test_users = [
    {"skin_type":"dry",         "sensitive":True,  "concerns":["redness","barrier","dehydration"], "active_use":"retinoid", "age_range":"a35_44", "gender":"female", "pregnancy":"none",     "label":"Dry sensitive 35F, using retinol"},
    {"skin_type":"oily",        "sensitive":False, "concerns":["acne","pores"],                   "active_use":"none",     "age_range":"u25",    "gender":"male",   "pregnancy":"none",     "label":"Oily 25M, acne-prone"},
    {"skin_type":"normal",      "sensitive":False, "concerns":["pigmentation","dullness","aging"], "active_use":"vitc",    "age_range":"a45p",   "gender":"female", "pregnancy":"none",     "label":"Normal 45F, using vitamin C"},
    {"skin_type":"combination", "sensitive":True,  "concerns":["acne","redness"],                 "active_use":"none",     "age_range":"a25_34", "gender":"female", "pregnancy":"pregnant", "label":"Combo sensitive, pregnant"},
]

for user in test_users:
    label = user.pop("label")
    vec   = np.array(encode_profile(user)).reshape(1, -1)
    pred  = model.predict(vec)[0]
    ml_recs   = [INGREDIENT_IDS[i] for i, v in enumerate(pred) if v == 1]
    rule_recs = run_diagnostic(**user)

    print(f"\n[{label}]")
    print(f"  Rule engine : {rule_recs}")
    print(f"  ML model    : {ml_recs}")
    match = set(ml_recs) == set(rule_recs[:len(ml_recs)])
    print(f"  Match       : {'✅' if match else '⚠️  divergence (ML learned a different pattern)'}")


# ── 5. Save ────────────────────────────────────────────
print("\n" + "=" * 55)
print("5. Saving model")
print("=" * 55)

joblib.dump(model,          "fiomio_model.pkl")
joblib.dump(INGREDIENT_IDS, "ingredient_ids.pkl")
print("Saved: fiomio_model.pkl, ingredient_ids.pkl")
print("\nNext steps:")
print("  Collect real user feedback → retrain → improve personalisation")
print("  Serve via api.py  →  POST /recommend")

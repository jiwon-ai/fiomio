# Fiomio recommendation engine (TypeScript → Python port)
# Source: Fiomio/src/lib/diagnostic.ts + ingredients.ts
# Purpose: generate synthetic training data and serve ML inference

INGREDIENTS = [
    {"id": "ceramides",    "targets": {"barrier":3,"dehydration":3,"redness":2,"aging":1},    "gentleness":3, "loves":["dry","combination","normal"],         "strong":False, "conflictsWith":[]},
    {"id": "hyaluronic",   "targets": {"dehydration":3,"dullness":1,"aging":1},               "gentleness":3, "loves":["dry","combination","oily","normal"],    "strong":False, "conflictsWith":[]},
    {"id": "niacinamide",  "targets": {"pores":3,"acne":2,"dullness":2,"redness":2,"barrier":2,"pigmentation":2,"dehydration":1}, "gentleness":3, "loves":["combination","oily","normal","dry"], "strong":False, "conflictsWith":[]},
    {"id": "centella",     "targets": {"redness":3,"barrier":2,"dehydration":1,"aging":1},    "gentleness":3, "loves":["dry","combination","normal","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "panthenol",    "targets": {"dehydration":2,"barrier":2,"redness":2},              "gentleness":3, "loves":["dry","combination","normal","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "snail",        "targets": {"dehydration":2,"barrier":2,"dullness":1,"redness":1,"acne":1}, "gentleness":3, "loves":["dry","combination","normal","oily"], "strong":False, "conflictsWith":[]},
    {"id": "vitaminc",     "targets": {"dullness":3,"pigmentation":3,"aging":2},              "gentleness":1, "loves":["combination","oily","normal","dry"],    "strong":True,  "conflictsWith":["exfoliant"]},
    {"id": "azelaic",      "targets": {"redness":3,"acne":2,"pigmentation":2,"pores":1},      "gentleness":2, "loves":["combination","oily","normal"],          "strong":False, "conflictsWith":[]},
    {"id": "salicylic",    "targets": {"acne":3,"pores":3,"dullness":1},                      "gentleness":1, "loves":["oily","combination"],                  "strong":True,  "conflictsWith":["retinoid","exfoliant"]},
    {"id": "retinol",      "targets": {"aging":3,"pores":2,"pigmentation":2,"acne":1},        "gentleness":0, "loves":["normal","combination","oily"],          "strong":True,  "conflictsWith":["retinoid","exfoliant","vitc"]},
    {"id": "peptides",     "targets": {"aging":3,"barrier":1,"dehydration":1},                "gentleness":3, "loves":["dry","normal","combination"],           "strong":False, "conflictsWith":[]},
    {"id": "allantoin",    "targets": {"redness":2,"barrier":2,"dehydration":1},              "gentleness":3, "loves":["dry","combination","normal","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "betaglucan",   "targets": {"dehydration":3,"barrier":2,"redness":2,"aging":1},    "gentleness":3, "loves":["dry","combination","normal","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "bakuchiol",    "targets": {"aging":3,"pigmentation":1,"redness":1,"barrier":1},   "gentleness":3, "loves":["dry","normal","combination","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "tranexamic",   "targets": {"pigmentation":3,"redness":2,"dullness":1},            "gentleness":3, "loves":["combination","normal","dry","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "arbutin",      "targets": {"pigmentation":3,"dullness":2},                        "gentleness":3, "loves":["combination","normal","dry","oily"],    "strong":False, "conflictsWith":[]},
    {"id": "galactomyces", "targets": {"dullness":2,"pores":2,"dehydration":1,"pigmentation":1}, "gentleness":3, "loves":["combination","normal","oily","dry"], "strong":False, "conflictsWith":[]},
    {"id": "greentea",     "targets": {"redness":2,"acne":1,"dullness":1,"pores":1},          "gentleness":3, "loves":["oily","combination","normal","dry"],    "strong":False, "conflictsWith":[]},
    {"id": "heartleaf",    "targets": {"redness":2,"acne":2,"barrier":1,"pores":1},           "gentleness":3, "loves":["oily","combination","normal"],          "strong":False, "conflictsWith":[]},
    {"id": "mandelic",     "targets": {"acne":2,"pigmentation":2,"dullness":2,"pores":1},     "gentleness":2, "loves":["oily","combination","normal"],          "strong":True,  "conflictsWith":["retinoid","exfoliant"]},
    {"id": "glycolic",     "targets": {"dullness":3,"pigmentation":2,"aging":2,"pores":2},    "gentleness":1, "loves":["normal","combination","oily"],          "strong":True,  "conflictsWith":["retinoid","exfoliant","vitc"]},
    {"id": "lactic",       "targets": {"dullness":2,"dehydration":2,"pigmentation":2,"pores":1}, "gentleness":2, "loves":["dry","normal","combination"],        "strong":True,  "conflictsWith":["retinoid","exfoliant"]},
]

PREGNANCY_UNSAFE = {"retinol", "salicylic", "arbutin"}
CONCERN_WEIGHTS  = [1.0, 0.78, 0.62]

SKIN_TYPES     = ["dry", "combination", "oily", "normal"]
CONCERNS       = ["redness", "dehydration", "dullness", "aging", "acne", "pores", "barrier", "pigmentation"]
ACTIVE_USES    = ["none", "retinoid", "exfoliant", "vitc"]
AGE_RANGES     = ["u25", "a25_34", "a35_44", "a45p"]
GENDERS        = ["female", "male", "other"]
PREGNANCIES    = ["none", "pregnant", "trying"]
INGREDIENT_IDS = sorted({ing["id"] for ing in INGREDIENTS})


def encode_profile(p: dict) -> list:
    """Encode a skin profile dict into a fixed-length feature vector."""
    row = []
    row += [1 if p["skin_type"]  == s  else 0 for s  in SKIN_TYPES]
    row += [1 if p["sensitive"] else 0]
    row += [1 if c in p["concerns"] else 0 for c in CONCERNS]
    row += [1 if p["active_use"] == a  else 0 for a  in ACTIVE_USES]
    row += [1 if p["age_range"]  == a  else 0 for a  in AGE_RANGES]
    row += [1 if p["gender"]     == g  else 0 for g  in GENDERS]
    row += [1 if p["pregnancy"]  == pr else 0 for pr in PREGNANCIES]
    return row


def _score_ingredient(ing, skin_type, sensitive, concerns, active_use, age_range, pregnancy) -> float:
    score = 0.0

    for i, concern in enumerate(concerns):
        score += ing["targets"].get(concern, 0) * CONCERN_WEIGHTS[i]

    if skin_type in ing["loves"]:
        score += 0.8

    if sensitive:
        score += (ing["gentleness"] - 1.5) * 0.7
        if ing["strong"]:
            score -= 1.6

    if active_use != "none" and active_use in ing["conflictsWith"]:
        score -= 3.2

    if age_range in ("a35_44", "a45p") and ing["id"] in ("retinol", "peptides", "bakuchiol", "vitaminc"):
        score += 0.6

    return score


def run_diagnostic(skin_type, sensitive, concerns, active_use, age_range, gender, pregnancy) -> list:
    """Rule engine: returns top-3 ingredient IDs for a given skin profile."""
    pool = [ing for ing in INGREDIENTS
            if pregnancy == "none" or ing["id"] not in PREGNANCY_UNSAFE]

    seen, unique_pool = set(), []
    for ing in pool:
        if ing["id"] not in seen:
            seen.add(ing["id"])
            unique_pool.append(ing)

    scored = sorted(
        [(ing["id"], _score_ingredient(ing, skin_type, sensitive, concerns, active_use, age_range, pregnancy))
         for ing in unique_pool],
        key=lambda x: -x[1]
    )

    return [ing_id for ing_id, s in scored[:3] if s > 0]

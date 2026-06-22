from semantic_engine import semantic_scores, SEMANTIC_AVAILABLE, SEMANTIC_MODE
from llm_engine import LLM_AVAILABLE
from hybrid_engine import hybrid_recommend
import joblib

print(f"Semantic: {SEMANTIC_MODE} (available={SEMANTIC_AVAILABLE})")
print(f"LLM:      {'yes' if LLM_AVAILABLE else 'no (set ANTHROPIC_API_KEY to enable)'}")

model          = joblib.load("fiomio_model.pkl")
ingredient_ids = joblib.load("ingredient_ids.pkl")

profiles = [
    {
        "skin_type": "dry", "sensitive": True,
        "concerns": ["redness", "barrier", "dehydration"],
        "active_use": "retinoid", "age_range": "a35_44",
        "gender": "female", "pregnancy": "none",
        "free_text": "My skin feels really tight and red after washing, especially in winter",
        "_label": "Dry sensitive 35F + retinol",
    },
    {
        "skin_type": "oily", "sensitive": False,
        "concerns": ["acne", "pores"],
        "active_use": "none", "age_range": "u25",
        "gender": "male", "pregnancy": "none",
        "free_text": "I keep breaking out on my chin and my pores look huge",
        "_label": "Oily acne-prone 25M",
    },
    {
        "skin_type": "combination", "sensitive": True,
        "concerns": ["acne", "redness"],
        "active_use": "none", "age_range": "a25_34",
        "gender": "female", "pregnancy": "pregnant",
        "free_text": "I am pregnant and have sensitive skin with breakouts",
        "_label": "Pregnant sensitive combo",
    },
]

for p in profiles:
    label = p.pop("_label")
    result = hybrid_recommend(p, model, ingredient_ids)
    print(f"\n{'='*58}")
    print(f"[{label}]")
    print(f"Input: \"{p['free_text']}\"")
    print(f"\nTop 3:")
    for r in result["recommendations"]:
        s = r["scores"]
        print(f"  {r['id']:16s}  rule={s['rule']:.2f}  ml={s['ml']:.2f}  sem={s['semantic']:.2f}  final={s['final']:.2f}")
    print(f"\nSignals: {result['signals_used']}")
    if result["explanation"]:
        print(f"\nExplanation:\n  {result['explanation']}")

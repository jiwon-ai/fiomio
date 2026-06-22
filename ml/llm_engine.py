# Fiomio — LLM layer (Claude API)
#
# Two roles:
#   1. Re-rank candidates with reasoning (catches nuance rules miss)
#   2. Generate a personalised explanation for the final top-3
#
# Requires ANTHROPIC_API_KEY in environment.
# Falls back gracefully if the key is absent.

import os
import json

try:
    import anthropic
    _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))
    LLM_AVAILABLE = bool(os.environ.get("ANTHROPIC_API_KEY"))
except ImportError:
    LLM_AVAILABLE = False


_SYSTEM = """You are Fiomio's expert K-beauty skin advisor.
You combine deep knowledge of cosmetic actives with a warm, approachable tone.
Always be concise, specific, and prioritise safety (especially for pregnancy or sensitive skin)."""


def llm_rerank(profile: dict, candidates: list[str]) -> list[str]:
    """
    Ask Claude to reorder the candidate ingredient list for this profile.
    Returns a reordered list of ingredient IDs.
    Falls back to the original order if unavailable.
    """
    if not LLM_AVAILABLE or not candidates:
        return candidates

    prompt = f"""Reorder these skin ingredients from most to least suitable for this user.
Return ONLY a JSON array of ingredient IDs — no explanation.

User profile:
- Skin type: {profile["skin_type"]}
- Sensitive: {profile["sensitive"]}
- Concerns: {", ".join(profile["concerns"])}
- Active use: {profile["active_use"]}
- Age range: {profile["age_range"]}
- Pregnancy: {profile["pregnancy"]}
{f'- User says: "{profile["free_text"]}"' if profile.get("free_text") else ""}

Candidates (already pre-screened): {candidates}

Rules:
- If pregnant, never include: retinol, salicylic, arbutin
- If sensitive, deprioritise strong actives (glycolic, retinol)
- Maximise benefit for the stated concerns
Return: ["id1", "id2", ...]"""

    try:
        response = _client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=100,
            system=_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return json.loads(response.content[0].text.strip())
    except Exception:
        return candidates


def llm_explain(profile: dict, top3: list[str]) -> str:
    """
    Generate a personalised 2–3 sentence explanation for the top-3 recommendations.
    """
    if not LLM_AVAILABLE:
        return ""

    concerns_str = ", ".join(profile["concerns"])
    pregnancy_note = " Safety is the priority given your pregnancy." if profile["pregnancy"] != "none" else ""
    free_text_note = f'\nUser also mentioned: "{profile["free_text"]}"' if profile.get("free_text") else ""

    prompt = f"""Write a warm, expert 2–3 sentence recommendation note for this Fiomio customer.

Profile: {profile["skin_type"]} skin, {"sensitive, " if profile["sensitive"] else ""}concerns: {concerns_str}.{pregnancy_note}
Recommended ingredients: {", ".join(top3)}.{free_text_note}

Be specific about WHY these three work together for this exact profile.
Mention any important usage order or caution in one sentence max.
Tone: knowledgeable friend, not clinical."""

    try:
        response = _client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=180,
            system=_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text.strip()
    except Exception:
        return ""

from typing import Optional

# Intended Level Ranges for the English Language
LEVEL_RANGES = {
    "Basic": (0, 6),
    "Intermediate": (6, 12),
    "Advanced": (12, 25),
}

WORDS_RANGES = {
    "Basic": "150-250",
    "Intermediate": "250-400",
    "Advanced": "400-600"

}


def build_english_prompt(
    topic: str,
    level: str,
    style: str,
    previous_score: Optional[float] = None,
    previous_text: Optional[str] = None,
) -> str:
    prompt = f"""
    Create a {level.lower()} level reading passage in English about "{topic}" with a {style.lower()} tone.
    Guidelines:
    - Important: Even if the topic is in another language the entire text MUST be in English.
    - Target Word Count: {WORDS_RANGES.get(level)} words.
    - Vocabulary/Complexity: Use vocabulary and sentence structures appropriate for the {level} level ({'simple sentences/common words' if level == 'Basic' else ('more complex sentences/some specialized terms' if level == 'Intermediate' else 'complex structures/domain-specific vocabulary')}).
    - Content: Ensure cohesive paragraphs with clear transitions. Develop the topic with appropriate depth for the level.
    - Style: Maintain a consistent {style.lower()} tone throughout.
    - Output: Provide ONLY the reading passage text, nothing else. No introductory phrases, explanations, or formatting beyond paragraphs.
    """
    if previous_score is not None:
        low, high = LEVEL_RANGES.get(level, (0, 20))
        if previous_score < low:
            prompt += f"\n- NOTE:  The previous attempt scored {previous_score:.2f} (Gunning Fog), which was too simple for the target range {low}-{high}. Please generate a significantly more complex text."
        elif previous_score > high:
            prompt += f"\n- NOTE: The previous attempt scored {previous_score:.2f} (Gunning Fog), which was too complex for the target range {low}-{high}. Please generate a significantly simpler text."
        else:
            prompt += f"\n- NOTE: The previous attempt scored {previous_score:.2f} (Gunning Fog). Aim closer to the middle of the target range {low}-{high}."
    if previous_text:
        prompt += f"\n\nHere is the previous generated text for reference:\n---\n{previous_text}\n---\nPlease use this as a reference and adjust the new passage accordingly."
    return prompt.strip()


def build_other_language_prompt(
    topic: str,
    level: str,
    language: str,
    style: str,
) -> str:
    prompt = f"""
    Create a {level.lower()} level reading passage strictly in the {language} language about "{topic}" with a {style.lower()} tone.
    Guidelines:
    - Important: Even if the topic is in another language the entire text MUST be in {language}.
    - Language: The entire text MUST be in {language}.
    - Target Word Count: Approximately {WORDS_RANGES.get(level)} words.
    - Vocabulary/Complexity: Use vocabulary and sentence structures appropriate for a {level} learner of {language}.
    - Content: Ensure cohesive paragraphs with clear transitions. Develop the topic with appropriate depth for the level.
    - Style: Maintain a consistent {style.lower()} tone throughout.
    - Output: Provide ONLY the reading passage text in {language}, nothing else. No introductory phrases, explanations, or formatting beyond paragraphs.
    """
    return prompt.strip()

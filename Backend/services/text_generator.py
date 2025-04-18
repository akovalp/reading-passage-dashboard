from typing import Dict, List, Any, Optional
import os
import json
import asyncio
import textstat
from functools import lru_cache
import aiohttp

from Backend.core.prompts import build_english_prompt, build_other_language_prompt, LEVEL_RANGES
from Backend.core.settings import settings
from Backend.models.schemas import GeneratedTextResponse
from . import llm_provider

import ollama
import requests

MAX_ITERATIONS = 10


async def get_available_models() -> List[str]:
    """
    Gets the list of available models from Ollama.

    Returns:
        List of available model names
    """
    try:
        loop = asyncio.get_running_loop()
        models_response = await loop.run_in_executor(None, ollama.list)
        available_models = [model['model']
                            for model in models_response.get('models', [])]
        if not available_models:
            # Fallback if list is empty but ollama responded
            available_models = [settings.OLLAMA_MODEL]
        return available_models
    except Exception as e:
        print(
            f"Warning: Could not fetch models from Ollama: {e}. Using default.")
        # Return a default list if Ollama isn't running or reachable
        return [settings.OLLAMA_MODEL]


class TextGenerator:
    """
    Service for generating text based on given parameters.
    Supports both English and other languages.
    """

    def __init__(self,
                 model: Optional[str] = None,
                 provider: str = settings.OLLAMA_PROVIDER):
        """
        Initialize the text generator.

        Args:
            model: The model name to use (defaults to settings.OLLAMA_MODEL)
            provider: The provider name (defaults to settings.OLLAMA_PROVIDER)
        """
        if model is None:
            model = (
                settings.GROQ_MODEL
                if provider.lower() == "groq"
                else settings.OLLAMA_MODEL
            )
        self.model = model
        self.provider = provider
        self.llm = llm_provider.LLMProvider(provider, model)

    async def check_model_availability(self) -> bool:
        """
        Check if the selected model is available.

        Returns:
            True if model is available, False otherwise
        """
        available_models = await get_available_models()
        return self.model in available_models

    async def generate_text(self,
                            topic: str,
                            language: str,
                            level: str,
                            style: str) -> Dict[str, Any]:
        """
        Generate text based on the given parameters.

        Args:
            topic: The topic for the generated text
            language: The language of the text
            level: The difficulty level (Basic, Intermediate, Advanced)
            style: The writing style (Formal, Casual, etc.)

        Returns:
            Dictionary containing the generated text and metadata

        Raises:
            ValueError: If topic is empty
            Exception: If text generation fails
        """
        if not topic.strip():
            raise ValueError("Topic cannot be empty")

        print(
            f"Generating text with model: {self.model} (provider: {self.provider}), on topic: {topic}, language: {language}, level: {level}, style: {style}")

        if language == "English":
            return await self._generate_text_english(topic, language, level, style)
        else:
            return await self._generate_text_other_languages(topic, language, level, style)

    async def _generate_text_english(self,
                                     topic: str,
                                     language: str,
                                     level: str,
                                     style: str) -> Dict[str, Any]:
        """
        Generate English text with difficulty level calibration.

        Args:
            topic: The topic for the generated text
            language: The language (should be "English")
            level: The difficulty level
            style: The writing style

        Returns:
            Dictionary containing the generated text and metadata
        """
        iterations = 0
        best_text = None
        best_score = None
        best_difference = None
        failed_texts = []
        previous_text = None
        prompts_used = []

        for _ in range(MAX_ITERATIONS):
            iterations += 1
            prompt = build_english_prompt(
                topic, level, style, best_score, previous_text)
            prompts_used.append(prompt)

            try:
                messages = [
                    {"role": "system", "content": "You are a professional language teacher tasked to create a reading passage. Do not give any output besides the text do not include things like 'ok here is your text' or 'here is the text'. Always make sure that generated text is in English event the topic is in another language."},
                    {"role": "user", "content": prompt}
                ]
                response = await self.llm.generate(messages)
                generated_text = response['content']
                previous_text = generated_text

                score = textstat.gunning_fog(generated_text)

                low, high = LEVEL_RANGES.get(level, (0, 25))
                range_center = (high + low) / 2
                score_difference = abs(score - range_center)

                if low <= score <= high:
                    best_text = generated_text
                    best_score = score
                    break
                else:
                    failed_texts.append(
                        f"Iteration {iterations} (score {score:.2f}): {generated_text}")
                    if best_difference is None or score_difference < best_difference:
                        best_text = generated_text
                        best_score = score
                        best_difference = score_difference
                previous_text = generated_text
            except Exception as e:
                print(
                    f"Error during text generation iteration {iterations}: {e}")
                if best_text:
                    break
                else:
                    raise Exception(
                        f"Failed to generate text using model {self.model}: {e}")

        if best_text is None:
            raise Exception(
                f"Could not generate suitable text after {iterations} iterations using model {self.model}.")

        result = GeneratedTextResponse(
            generated_text=best_text,
            score=best_score,
            level=level,
            language=language,
            style=style,
            iterations=iterations,
            failed_texts=failed_texts,
            prompts_used=prompts_used
        ).model_dump()

        return result

    async def _generate_text_other_languages(self,
                                             topic: str,
                                             language: str,
                                             level: str,
                                             style: str) -> Dict[str, Any]:
        """
        Generate text in non-English languages.

        Args:
            topic: The topic for the generated text
            language: The target language
            level: The difficulty level
            style: The writing style

        Returns:
            Dictionary containing the generated text and metadata
        """
        prompt = build_other_language_prompt(topic, level, language, style)
        try:
            messages = [
                {"role": "system", "content": f"You are a professional language teacher tasked to create a reading passage. Do not give any output besides the text do not include things like 'ok here is your text' or 'here is the text'. Always make sure that generated text is in {language} event the topic is in another language. Make sure that style is {style} and level is {level}."},
                {"role": "user", "content": prompt}
            ]
            response = await self.llm.generate(messages)
            generated_text = response['content']

            if not generated_text or len(generated_text) < 20:
                raise ValueError("Generated text is too short or empty.")

            result = GeneratedTextResponse(
                generated_text=generated_text,
                level=level,
                language=language,
                style=style,
                iterations=1,
                prompts_used=[prompt],
                failed_texts=[]
            ).model_dump()

            return result
        except Exception as e:
            raise Exception(
                f"Error generating non-English text with model {self.model}: {e}")

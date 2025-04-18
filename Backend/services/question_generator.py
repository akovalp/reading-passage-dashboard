from typing import Dict, List, Any, Optional
import os
import json
import asyncio
import aiohttp
from Backend.core.settings import settings
from Backend.models.schemas import GenerateQuestionsResponse, QuestionSchema
import ollama
import requests
from . import llm_provider


class QuestionGenerator:
    def __init__(self,
                 model: Optional[str] = None,
                 provider: str = settings.OLLAMA_PROVIDER):
        if model is None:
            model = (
                settings.GROQ_MODEL
                if provider.lower() == "groq"
                else settings.OLLAMA_MODEL
            )
        self.model = model
        self.provider = provider
        self.llm = llm_provider.LLMProvider(provider, model)

    async def generate_questions(self, generated_text: str, num_questions: int, language: str, choices_num: int) -> Dict[str, Any]:
        """Generate questions based on the given text."""
        if not generated_text.strip():
            raise ValueError("Generated text cannot be empty")

        prompt = f"""
        Reading Passage ({language}):
        ---
        {generated_text}
        ---

        Task: Based *only* on the reading passage above, generate exactly {num_questions} multiple-choice comprehension questions.
        For each question:
        1.  Provide the question itself.
        2.  Provide exactly {choices_num} plausible answer choices (options). One choice must be the correct answer based on the text.
        3.  Clearly indicate the correct answer.
        4.  All questions, choices, and the answer text MUST be in the same language as the reading passage ({language}).

        Format the output as a JSON object containing a single key "questions", which is a list of question objects.
        Each question object should have the keys "question" (string), "choices" (list of {choices_num} strings), and "answer" (string - the correct choice text).

        Example JSON structure:
        {{
          "questions": [
            {{
              "question": "Sample question in {language}?",
              "choices": ["Choice A in {language}", "Choice B in {language}", "Choice C in {language}"],
              "answer": "Choice B in {language}"
            }},
            // ... more question objects
          ]
        }}

        Generate the JSON output now based on the provided passage.
        """

        print(
            f"Generating questions with model: {self.model} (provider: {self.provider}), num_questions: {num_questions}, language: {language}, choices_num: {choices_num}")

        if self.provider == "ollama":
            return self._generate_questions_ollama(prompt, num_questions, language, choices_num)
        if self.provider == "groq":
            return await self._generate_questions_groq(prompt, num_questions, language, choices_num)
        else:
            raise ValueError(f"Unknown provider: {self.provider}")

    def _generate_questions_ollama(self, prompt, num_questions, language, choices_num):
        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {"role": "system",
                        "content": f"You are an AI assistant specialized in creating multiple-choice comprehension questions based on provided text. Respond ONLY with the requested JSON object containing the questions. Ensure all text content (questions, choices, answers) is in {language}."},
                    {"role": "user", "content": prompt}
                ],
                format='json',
                options={"temperature": 0.5}
            )

            json_response_str = response['message']['content']
            try:
                validated_data = GenerateQuestionsResponse.model_validate_json(
                    json_response_str)
                if len(validated_data.questions) != num_questions:
                    print(
                        f"Warning: Requested {num_questions} questions, but model generated {len(validated_data.questions)}. Using generated questions.")
                return validated_data.model_dump()
            except (json.JSONDecodeError, Exception) as json_error:
                print(
                    f"Error: Failed to parse or validate JSON response from model {self.model}.")
                print(f"Model Response String: {json_response_str}")
                raise Exception(
                    f"Could not parse valid JSON questions from the model: {json_error}")
        except Exception as e:
            raise Exception(
                f"Error generating questions with model {self.model}: {e}")

    async def _generate_questions_groq(self, prompt, num_questions, language, choices_num):
        try:
            messages = [
                {"role": "system",
                    "content": f"You are an AI assistant specialized in creating multiple-choice comprehension questions based on provided text. Respond ONLY with the requested JSON object containing the questions. Ensure all text content (questions, choices, answers) is in {language}. you need to make sure that there are exactly {num_questions} questions and {choices_num} choices for each question."},
                {"role": "user", "content": prompt}
            ]
            response = await self.llm.generate(
                messages=messages,
                temperature=0.5,
                response_format={"type": "json_object"}
            )
            json_response_str = response.get('content')
            try:
                validated_data = GenerateQuestionsResponse.model_validate_json(
                    json_response_str)
                if len(validated_data.questions) != num_questions:
                    print(
                        f"Warning: Requested {num_questions} questions, but model generated {len(validated_data.questions)}. Using generated questions.")
                return validated_data.model_dump()
            except (json.JSONDecodeError, Exception) as json_error:
                print(
                    f"Error: Failed to parse or validate JSON response from model {self.model}.")
                print(f"Model Response String: {json_response_str}")
                raise Exception(
                    f"Could not parse valid JSON questions from the model: {json_error}")
        except Exception as e:
            raise Exception(
                f"Error generating questions with model {self.model}: {e}")

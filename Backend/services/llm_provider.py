from typing import Dict, List, Any
import os
import asyncio
import aiohttp
import ollama
from Backend.core import settings


class LLMProvider:
    """
    Class for interacting with different LLM providers.
    Abstracts the generation process for different providers.
    Currently supports Ollama and Groq.
    """

    def __init__(self, provider: str, model: str):
        """
        Initialize the LLM provider.

        Args:
            provider: The provider name ("ollama" or "groq")
            model: The model name to use
        """
        self.provider = provider
        self.model = model

    async def generate(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, str]:
        """
        Generate text using the configured LLM provider.

        Args:
            messages: List of message dictionaries with role and content
            **kwargs: Additional provider-specific parameters

        Returns:
            Dictionary containing the generated content
        """
        if self.provider == "ollama":
            # Only the first user message is used as prompt for Ollama
            prompt = next((msg["content"]
                          for msg in messages if msg["role"] == "user"), "")
            system = next((msg["content"]
                          for msg in messages if msg["role"] == "system"), None)

            # Use run_in_executor to make the synchronous call non-blocking
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(
                None,
                lambda: ollama.generate(
                    model=self.model,
                    prompt=prompt,
                    system=system
                )
            )
            return {"content": response["response"]}

        elif self.provider == "groq":
            GROQ_API_KEY = os.getenv("GROQ_API_KEY", settings.GROQ_API_KEY)
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_API_KEY}"
            }
            data = {
                "model": self.model,
                "messages": messages,
                "temperature": kwargs.get("temperature", 1)
            }
            if "response_format" in kwargs:
                data["response_format"] = kwargs["response_format"]

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=data
                ) as response:
                    response.raise_for_status()
                    resp_json = await response.json()
                    return {"content": resp_json["choices"][0]["message"]["content"]}
        else:
            raise ValueError(f"Unknown provider: {self.provider}")

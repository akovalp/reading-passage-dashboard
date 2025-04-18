from fastapi import APIRouter, HTTPException
import os
import aiohttp
import ollama
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel
from Backend.core.settings import settings

router = APIRouter(
    prefix="/models",
    tags=["Models"],
)


class ModelInfo(BaseModel):
    id: str
    provider: str
    details: Dict[str, Any] = {}


class ModelsResponse(BaseModel):
    models: List[ModelInfo]


@router.get(
    "/",
    response_model=ModelsResponse,
    summary="Get available models",
    description="Returns a list of available models from Ollama and Groq providers"
)
async def get_models():
    """
    Fetches available models from both Ollama and Groq.

    Returns:
        A combined list of models from both providers.
    """
    models = []

    # Fetch Ollama models
    try:
        loop = asyncio.get_running_loop()
        ollama_models_response = await loop.run_in_executor(None, ollama.list)
        ollama_models = [
            ModelInfo(
                id=model['model'],
                provider="ollama",
                details={"tags": model.get(
                    'tags', []), "size": model.get('size', 0)}
            )
            for model in ollama_models_response.get('models', [])
            if "whisper" not in model['model'].lower() and "tts" not in model['model'].lower()
        ]
        models.extend(ollama_models)
    except Exception as e:
        # Don't fail if Ollama is not accessible
        print(f"Warning: Could not fetch models from Ollama: {e}")
        # Add default Ollama model as a fallback
        models.append(ModelInfo(id=settings.OLLAMA_MODEL, provider="ollama"))

    # Fetch Groq models
    try:
        GROQ_API_KEY = os.getenv("GROQ_API_KEY", settings.GROQ_API_KEY)
        if GROQ_API_KEY:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}"
            }
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://api.groq.com/openai/v1/models",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        groq_models = [
                            ModelInfo(
                                id=model['id'],
                                provider="groq",
                                details={
                                    "created": model.get('created'),
                                    "owned_by": model.get('owned_by'),
                                    "context_window": model.get('context_window')
                                }
                            )
                            for model in data.get('data', [])
                            if "whisper" not in model['id'].lower() and "tts" not in model['id'].lower()
                        ]
                        models.extend(groq_models)
                    else:
                        # If Groq API fails, add default model
                        models.append(
                            ModelInfo(id=settings.GROQ_MODEL, provider="groq"))
        else:
            # If no API key, just add the default model
            models.append(ModelInfo(id=settings.GROQ_MODEL, provider="groq"))
    except Exception as e:
        print(f"Warning: Could not fetch models from Groq: {e}")
        # Add default Groq model as a fallback
        models.append(ModelInfo(id=settings.GROQ_MODEL, provider="groq"))

    return ModelsResponse(models=models)

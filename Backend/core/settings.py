# app/core/settings.py

from pydantic_settings import BaseSettings, SettingsConfigDict
import os
print("Current working directory:", os.getcwd())
print("GROQ_API_KEY set in environment:", "GROQ_API_KEY" in os.environ)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


class Settings(BaseSettings):
    OLLAMA_PROVIDER: str = "ollama"
    OLLAMA_MODEL: str = "gemma3:12b"
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    GROQ_API_KEY: str = GROQ_API_KEY

    class Config:
        env_file = ".env"


settings = Settings()
print("GROQ_API_KEY from settings:", bool(settings.GROQ_API_KEY))

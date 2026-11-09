from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    INTERNAL_API_KEY: str
    AI_SERVICE_HOST: str = "127.0.0.1"
    AI_SERVICE_PORT: int = 8000
    QDRANT_URL: str = ""
    QDRANT_COLLECTION: str = "medimind_docs"
    LLM_PROVIDER: str = "gemini"
    LLM_MODEL: str = "gemini-2.5-flash"
    GEMINI_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"

    # API Keys are optional depending on which provider is active
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def AI_SERVICE_URL(self) -> str:
        return f"http://{self.AI_SERVICE_HOST}:{self.AI_SERVICE_PORT}"


settings = Settings()




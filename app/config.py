"""Runtime settings, loaded from environment / .env (see .env.example)."""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore", case_sensitive=False
    )

    # FLock inference
    flock_api_key: str | None = None
    flock_base_url: str = "https://api.flock.io/v1"
    flock_model: str = "qwen3-30b-a3b-instruct-2507"
    flock_temperature: float = 0.2
    flock_timeout: float = 60.0

    # Backends
    redactor: str = "auto"  # auto | presidio | regex
    retriever: str = "bm25"  # bm25 | embeddings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    retrieval_top_k: int = 4

    # Web: comma-separated allowlist of frontend origins ("*" is fine for local dev only)
    cors_origins: str = "*"

    # Voice (optional). Deepgram/ElevenLabs keys are read from the environment by their plugins.
    livekit_url: str | None = None
    livekit_api_key: str | None = None
    livekit_api_secret: str | None = None
    voice_id: str = "ODq5zmih8GrVes37Dizd"

    @property
    def flock_configured(self) -> bool:
        return bool(self.flock_api_key)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()] or ["*"]

    @property
    def voice_configured(self) -> bool:
        return bool(self.livekit_url and self.livekit_api_key and self.livekit_api_secret)


@lru_cache
def get_settings() -> Settings:
    return Settings()

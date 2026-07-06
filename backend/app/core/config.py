from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_private_key(value: str) -> str:
    expanded = value.strip().strip('"').strip("'").replace("\\n", "\n")
    lines = [line.strip() for line in expanded.splitlines() if line.strip()]
    return "\n".join(lines) + "\n"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")

    firebase_project_id: str = Field(alias="FIREBASE_PROJECT_ID")
    firebase_client_email: str = Field(alias="FIREBASE_CLIENT_EMAIL")
    firebase_private_key: str = Field(alias="FIREBASE_PRIVATE_KEY")
    firestore_database_id: str | None = Field(default=None, alias="FIRESTORE_DATABASE_ID")

    chroma_persist_dir: str = Field(default="./chroma_db", alias="CHROMA_PERSIST_DIR")
    embedding_model: str = Field(default="all-MiniLM-L6-v2", alias="EMBEDDING_MODEL")

    cortex_url: str = Field(alias="CORTEX_URL")
    cortex_api_key: str = Field(alias="CORTEX_API_KEY")
    cortex_model: str = Field(default="gemini-2.5-flash", alias="CORTEX_MODEL")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def firebase_private_key_value(self) -> str:
        return normalize_private_key(self.firebase_private_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

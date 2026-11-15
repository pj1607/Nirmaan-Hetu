from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    EMBEDDING_MODEL: str = "gemini-embedding-001"
    MAX_RETRIEVAL_DISTANCE: float = 0.75
    MAX_UPLOAD_SIZE_MB: int = 15
    INTERNAL_AI_API_KEY: str = ""

    APP_NAME: str = "Nirmaan Hetu AI Service"
    APP_ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

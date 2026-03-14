import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    
    API_VERSION: str = "v1"
    LLM_MODEL: str = "gemini-2.5-flash-lite"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

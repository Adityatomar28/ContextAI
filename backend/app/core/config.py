from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import EmailStr
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Context-AI"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY WARNING: don't use this in production!
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./context-ai.db"
    
    # Mistral AI / RAG
    MISTRAL_API_KEY: str = ""
    HF_TOKEN: str = ""
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    
    # SMTP Email configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""
    
    model_config = SettingsConfigDict(env_file=[".env", "../.env"], env_file_encoding="utf-8", extra="ignore")

settings = Settings()

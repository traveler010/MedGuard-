from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "MedGuard API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/medguard_db"
    FALLBACK_TO_SQLITE: bool = True
    SQLITE_URL: str = "sqlite:///./medguard_dev.db"
    
    # JWT Secrets & Expiration
    JWT_SECRET_KEY: str = "medguard-super-secret-jwt-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS Origins for frontend communication
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

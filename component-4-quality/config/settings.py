from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # ===== SHARED CONFIG =====
    DATABASE_URL: str = "sqlite:///./nextgen_qa.db"
    REDIS_URL: str = "redis://localhost:6379"
    SECRET_KEY: str = "your-secret-key-change-in-production"

    # ===== COMPONENT 4 – QUALITY =====
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    HF_HOME: str = "./hf_cache"  # Hugging Face cache
    C4_SERVICE_PORT: int = 8004

    # ML Model Paths
    QUALITY_MODEL_PATH: str = "saved_models/quality_scorer.pkl"
    SEMANTIC_MODEL_PATH: str = "saved_models/semantic_encoder"

    # RTM Configuration
    RTM_SIMILARITY_THRESHOLD: float = 0.75
    MIN_QUALITY_SCORE: int = 60

    # Report Generation
    REPORT_TEMPLATE_PATH: str = "reports/templates/rtm_template.xlsx"
    OUTPUT_DIR: str = "reports/output"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

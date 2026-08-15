import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "Fraud Intelligence API")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/fraud_intelligence",
    )
    ml_service_url: str = os.getenv("ML_SERVICE_URL", "http://localhost:8001")
    frontend_url: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000,http://127.0.0.1:3000",
    )


settings = Settings()

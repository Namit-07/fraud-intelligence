from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


def _create_engine(database_url: str) -> Engine:
    connect_args = {"connect_timeout": 2} if database_url.startswith("postgresql") else {}
    return create_engine(database_url, pool_pre_ping=True, connect_args=connect_args)


def _resolve_engine() -> Engine:
    try:
        engine = _create_engine(settings.database_url)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return engine
    except Exception:
        db_file = Path(__file__).resolve().parents[2] / "fraud_intelligence.db"
        fallback_url = f"sqlite+pysqlite:///{db_file.as_posix()}"
        return _create_engine(fallback_url)


engine = _resolve_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

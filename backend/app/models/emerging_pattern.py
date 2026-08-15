from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class EmergingPattern(Base):
    __tablename__ = "emerging_patterns"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    pattern_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(512))
    accounts_affected: Mapped[int] = mapped_column(Integer, default=0)
    fraud_association: Mapped[float] = mapped_column(Float, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

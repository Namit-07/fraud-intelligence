from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    transaction_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(ForeignKey("customers.id"), index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    transaction_type: Mapped[str] = mapped_column(String(64), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    status: Mapped[str] = mapped_column(String(32), default="PENDING")
    merchant: Mapped[str | None] = mapped_column(String(128), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    customer: Mapped["Customer"] = relationship(back_populates="transactions")
    risk_assessment: Mapped["RiskAssessment | None"] = relationship(back_populates="transaction", uselist=False, cascade="all, delete-orphan")
    behaviour_events: Mapped[list["BehaviourEvent"]] = relationship(back_populates="transaction", cascade="all, delete-orphan")
    alerts: Mapped[list["Alert"]] = relationship(back_populates="transaction", cascade="all, delete-orphan")

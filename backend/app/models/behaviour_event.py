from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class BehaviourEvent(Base):
    __tablename__ = "behaviour_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(ForeignKey("customers.id"), index=True)
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"), index=True)
    event_type: Mapped[str] = mapped_column(String(64), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    # SQLAlchemy reserves the attribute name "metadata" on declarative models.
    event_metadata: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    customer: Mapped["Customer"] = relationship(back_populates="behaviour_events")
    transaction: Mapped["Transaction"] = relationship(back_populates="behaviour_events")

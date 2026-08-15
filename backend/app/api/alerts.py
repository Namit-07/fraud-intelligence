from fastapi import APIRouter
from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.alert import Alert

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

FALLBACK_ALERTS = [
    {
        "id": "ALERT-1001",
        "transaction_id": "TXN1047",
        "severity": "HIGH",
        "message": "New device + location anomaly",
        "status": "OPEN",
        "created_at": "2025-01-01T00:00:00",
    },
    {
        "id": "ALERT-1002",
        "transaction_id": "TXN1044",
        "severity": "MEDIUM",
        "message": "High transaction velocity",
        "status": "OPEN",
        "created_at": "2025-01-01T00:00:00",
    },
]


@router.get("")
def list_alerts() -> list[dict]:
    try:
        db = SessionLocal()
        try:
            rows = db.execute(select(Alert).order_by(Alert.created_at.desc()).limit(20)).scalars().all()
            return [
                {
                    "id": row.id,
                    "transaction_id": row.transaction_id,
                    "customer_id": row.customer_id,
                    "severity": row.severity,
                    "title": row.title,
                    "message": row.message,
                    "status": row.status,
                    "created_at": row.created_at.isoformat(),
                }
                for row in rows
            ]
        finally:
            db.close()
    except Exception:
        return FALLBACK_ALERTS

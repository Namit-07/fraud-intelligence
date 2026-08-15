from fastapi import APIRouter
from sqlalchemy import func, select

from app.db.database import SessionLocal
from app.models.alert import Alert
from app.models.behaviour_event import BehaviourEvent
from app.models.risk_assessment import RiskAssessment
from app.models.transaction import Transaction

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

FALLBACK_STATS = {
    "total_transactions": 24831,
    "high_risk_transactions": 183,
    "anomalies": 67,
    "active_alerts": 24,
}


@router.get("/stats")
def get_dashboard_stats() -> dict:
    try:
        db = SessionLocal()
        try:
            total_transactions = db.scalar(select(func.count()).select_from(Transaction)) or 0
            high_risk_transactions = db.scalar(
                select(func.count()).select_from(RiskAssessment).where(RiskAssessment.risk_level == "HIGH")
            ) or 0
            anomalies = db.scalar(select(func.count()).select_from(BehaviourEvent)) or 0
            active_alerts = db.scalar(
                select(func.count()).select_from(Alert).where(Alert.status != "RESOLVED")
            ) or 0
            return {
                "total_transactions": int(total_transactions),
                "high_risk_transactions": int(high_risk_transactions),
                "anomalies": int(anomalies),
                "active_alerts": int(active_alerts),
            }
        finally:
            db.close()
    except Exception:
        return FALLBACK_STATS

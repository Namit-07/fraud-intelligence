from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, or_, select

from app.db.database import SessionLocal
from app.models.behaviour_event import BehaviourEvent
from app.models.customer import Customer
from app.models.risk_assessment import RiskAssessment
from app.models.transaction import Transaction

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


def serialize_transaction(row: Transaction) -> dict:
    assessment = row.risk_assessment
    return {
        "id": row.transaction_id,
        "customer_id": row.customer_id,
        "amount": float(row.amount),
        "transaction_type": row.transaction_type,
        "timestamp": row.timestamp.isoformat(),
        "status": row.status,
        "risk_score": assessment.risk_score if assessment else 0,
        "risk_level": assessment.risk_level if assessment else "LOW",
        "merchant": row.merchant,
    }


@router.get("")
def list_transactions(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    risk: str | None = Query(default=None, pattern="^(LOW|MEDIUM|HIGH)$"),
    status: str | None = None,
) -> dict:
    try:
        db = SessionLocal()
        try:
            query = select(Transaction).join(Customer, Transaction.customer_id == Customer.id)
            if search:
                term = f"%{search.lower()}%"
                query = query.where(
                    or_(
                        Transaction.transaction_id.ilike(term),
                        Customer.customer_code.ilike(term),
                    )
                )
            if risk:
                query = query.join(RiskAssessment, RiskAssessment.transaction_id == Transaction.id)
                query = query.where(RiskAssessment.risk_level == risk)
            if status:
                query = query.where(Transaction.status == status)

            total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
            rows = db.execute(query.order_by(Transaction.timestamp.desc()).offset((page - 1) * limit).limit(limit)).scalars().all()
            items = [serialize_transaction(row) for row in rows]
            return {"items": items, "page": page, "limit": limit, "total": total}
        finally:
            db.close()
    except Exception:
        return {"items": [], "page": page, "limit": limit, "total": 0}


@router.get("/{transaction_id}")
def get_transaction(transaction_id: str) -> dict:
    try:
        db = SessionLocal()
        try:
            row = db.execute(
                select(Transaction).where(Transaction.transaction_id == transaction_id)
            ).scalar_one_or_none()
            if row is None:
                raise HTTPException(status_code=404, detail="Transaction not found")

            assessment = row.risk_assessment
            return {
                "transaction": serialize_transaction(row),
                "customer": {"id": row.customer_id},
                "risk_assessment": {
                    "fraud_probability": assessment.fraud_probability if assessment else 0.0,
                    "anomaly_score": assessment.anomaly_score if assessment else 0.0,
                    "risk_score": assessment.risk_score if assessment else 0,
                    "risk_level": assessment.risk_level if assessment else "LOW",
                    "risk_factors": assessment.risk_factors if assessment else [],
                },
                "behaviour_events": [
                    {
                        "id": event.id,
                        "customer_id": event.customer_id,
                        "transaction_id": event.transaction_id,
                        "event_type": event.event_type,
                        "timestamp": event.timestamp.isoformat(),
                            "metadata": event.event_metadata,
                    }
                    for event in row.behaviour_events
                ],
                "alerts": [
                    {
                        "id": alert.id,
                        "transaction_id": alert.transaction_id,
                        "customer_id": alert.customer_id,
                        "severity": alert.severity,
                        "title": alert.title,
                        "message": alert.message,
                        "status": alert.status,
                        "created_at": alert.created_at.isoformat(),
                    }
                    for alert in row.alerts
                ],
            }
        finally:
            db.close()
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Transaction not found")

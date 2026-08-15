from collections.abc import AsyncGenerator
from datetime import UTC, datetime
import json
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api import alerts, dashboard, investigations, patterns, transactions
from app.config import settings
from app.db.database import SessionLocal
from app.models.alert import Alert
from app.models.behaviour_event import BehaviourEvent
from app.models.customer import Customer
from app.models.risk_assessment import RiskAssessment
from app.models.transaction import Transaction
from app.schemas.risk import MLPrediction
from app.services.ml_service import predict_risk
from app.services.risk_service import calculate_risk_score
from app.services.transaction_service import simulate_transaction


class WebSocketManager:
    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict) -> None:
        payload = json.dumps(message)
        stale: list[WebSocket] = []

        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                stale.append(connection)

        for connection in stale:
            self.disconnect(connection)


manager = WebSocketManager()
app = FastAPI(title=settings.app_name, version=settings.app_version)


def _utc_now_naive() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _to_naive_utc(value: str | None) -> datetime:
    if not value:
        return _utc_now_naive()
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        return parsed
    return parsed.astimezone(UTC).replace(tzinfo=None)

allowed_origins = [origin.strip() for origin in settings.frontend_url.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(transactions.router)
app.include_router(investigations.router)
app.include_router(patterns.router)
app.include_router(alerts.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.websocket("/ws/transactions")
async def transactions_websocket(websocket: WebSocket) -> AsyncGenerator[None, None]:
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/api/demo/simulate")
async def simulate_demo(mode: str = "normal") -> dict:
    event = simulate_transaction(mode)
    persistence_status = {"persisted": False, "error": None}

    try:
        transaction_data = event.get("transaction", {})
        transaction_id = str(transaction_data.get("id") or f"TXN_SIM_{uuid4().hex[:8].upper()}")
        customer_id = str(transaction_data.get("customer_id") or f"CUST-SIM-{uuid4().hex[:6].upper()}")
        amount = float(transaction_data.get("amount") or 0)
        transaction_type = str(transaction_data.get("transaction_type") or "TRANSFER")
        timestamp = _to_naive_utc(transaction_data.get("timestamp"))
        sequence = event.get("sequence", [])

        prediction_raw = await predict_risk(
            {
                "transaction_id": transaction_id,
                "customer_id": customer_id,
                "amount": amount,
                "transaction_type": transaction_type,
                "behaviour_events": sequence,
            }
        )
        prediction = MLPrediction(**prediction_raw)
        risk_score, risk_level = calculate_risk_score(prediction)

        db = SessionLocal()
        try:
            customer = db.get(Customer, customer_id)
            if customer is None:
                customer = Customer(
                    id=customer_id,
                    customer_code=customer_id,
                    status="ACTIVE",
                    created_at=_utc_now_naive(),
                )
                db.add(customer)

            existing_txn = db.get(Transaction, transaction_id)
            if existing_txn is None:
                db.add(
                    Transaction(
                        id=transaction_id,
                        transaction_id=transaction_id,
                        customer_id=customer_id,
                        amount=amount,
                        transaction_type=transaction_type,
                        timestamp=timestamp,
                        status="FLAGGED" if risk_level == "HIGH" else "REVIEW" if risk_level == "MEDIUM" else "COMPLETED",
                        merchant="Simulated Merchant",
                        created_at=_utc_now_naive(),
                    )
                )

            for index, event_type in enumerate(sequence):
                db.add(
                    BehaviourEvent(
                        id=f"EV-SIM-{transaction_id}-{index}",
                        customer_id=customer_id,
                        transaction_id=transaction_id,
                        event_type=str(event_type),
                        timestamp=timestamp,
                        event_metadata={"source": "simulation", "position": index, "mode": mode},
                    )
                )

            existing_assessment = db.get(RiskAssessment, f"RA-{transaction_id}")
            if existing_assessment is None:
                db.add(
                    RiskAssessment(
                        id=f"RA-{transaction_id}",
                        transaction_id=transaction_id,
                        fraud_probability=prediction.fraud_probability,
                        anomaly_score=prediction.anomaly_score,
                        risk_score=risk_score,
                        risk_level=risk_level,
                        risk_factors=[factor.model_dump() for factor in prediction.risk_factors],
                        model_version="mock-v1",
                        created_at=_utc_now_naive(),
                    )
                )

            if risk_level in {"HIGH", "MEDIUM"}:
                alert_id = f"ALERT-SIM-{transaction_id}"
                if db.get(Alert, alert_id) is None:
                    db.add(
                        Alert(
                            id=alert_id,
                            transaction_id=transaction_id,
                            customer_id=customer_id,
                            severity=risk_level,
                            title="Simulated suspicious transaction",
                            message=f"Simulation generated {risk_level.lower()} risk score {risk_score}.",
                            status="OPEN",
                            created_at=_utc_now_naive(),
                        )
                    )

            db.commit()
            persistence_status["persisted"] = True
            event["risk"] = {
                "fraud_probability": prediction.fraud_probability,
                "anomaly_score": prediction.anomaly_score,
                "risk_score": risk_score,
                "risk_level": risk_level,
            }
        finally:
            db.close()
    except Exception as exc:
        persistence_status["error"] = str(exc)

    await manager.broadcast({"event": "transaction_processed", "payload": event})
    return {"status": "simulated", "mode": mode, "data": event, "persistence": persistence_status}

from __future__ import annotations

import random
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path

from sqlalchemy import select

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.db.database import SessionLocal
from app.db.init_db import init_db
from app.models.alert import Alert
from app.models.behaviour_event import BehaviourEvent
from app.models.customer import Customer
from app.models.emerging_pattern import EmergingPattern
from app.models.risk_assessment import RiskAssessment
from app.models.transaction import Transaction

random.seed(42)


def utc_now() -> datetime:
    return datetime.now(UTC)


def generate_customer_code(index: int) -> str:
    return f"CUST-{1000 + index:04d}"


def generate_transaction_code(index: int) -> str:
    return f"TXN-{10000 + index:06d}"


def build_risk_factors(event_types: list[str], amount: float) -> list[dict]:
    factors: list[dict] = []
    if "DEVICE_CHANGE" in event_types:
        factors.append({"feature": "device_change", "impact": 19, "severity": "HIGH"})
    if "LOCATION_CHANGE" in event_types:
        factors.append({"feature": "location_change", "impact": 16, "severity": "HIGH"})
    if "BENEFICIARY_ADDED" in event_types:
        factors.append({"feature": "beneficiary_added", "impact": 12, "severity": "MEDIUM"})
    if amount >= 75000:
        factors.append({"feature": "high_value_transfer", "impact": 23, "severity": "HIGH"})
    if "PASSWORD_CHANGE" in event_types:
        factors.append({"feature": "password_change", "impact": 9, "severity": "MEDIUM"})
    if not factors:
        factors.append({"feature": "normal_behavior", "impact": 4, "severity": "LOW"})
    return factors


def create_demo_customers(db) -> None:
    demo_customers = [
        ("CUST-DEMO-001", "ACTIVE"),
        ("CUST-DEMO-002", "ACTIVE"),
        ("CUST-DEMO-003", "ACTIVE"),
    ]

    for customer_code, status in demo_customers:
        customer = db.scalar(select(Customer).where(Customer.id == customer_code))
        if customer is None:
            db.add(Customer(id=customer_code, customer_code=customer_code, status=status))

    db.commit()

    normal_customer = db.get(Customer, "CUST-DEMO-001")
    medium_customer = db.get(Customer, "CUST-DEMO-002")
    suspicious_customer = db.get(Customer, "CUST-DEMO-003")

    if normal_customer is not None:
        tx = db.get(Transaction, "TXN-DEMO-001")
        if tx is None:
            tx = Transaction(
                id="TXN-DEMO-001",
                transaction_id="TXN-DEMO-001",
                customer_id=normal_customer.id,
                amount=2500.00,
                transaction_type="PAYMENT",
                timestamp=utc_now() - timedelta(days=1),
                status="COMPLETED",
                merchant="Aurora Market",
                created_at=utc_now(),
            )
            db.add(tx)
            db.add(BehaviourEvent(
                id="EV-DEMO-001",
                customer_id=normal_customer.id,
                transaction_id=tx.id,
                event_type="LOGIN",
                timestamp=tx.timestamp,
                event_metadata={"device": "desktop"},
            ))
            db.add(BehaviourEvent(
                id="EV-DEMO-002",
                customer_id=normal_customer.id,
                transaction_id=tx.id,
                event_type="TRANSACTION",
                timestamp=tx.timestamp + timedelta(minutes=2),
                event_metadata={"channel": "mobile_app"},
            ))
            db.add(RiskAssessment(
                id="RA-DEMO-001",
                transaction_id=tx.id,
                fraud_probability=0.08,
                anomaly_score=0.12,
                risk_score=18,
                risk_level="LOW",
                risk_factors=[{"feature": "normal_behavior", "impact": 4, "severity": "LOW"}],
                model_version="mock-v1",
                created_at=utc_now(),
            ))

    if medium_customer is not None:
        tx = db.get(Transaction, "TXN-DEMO-002")
        if tx is None:
            tx = Transaction(
                id="TXN-DEMO-002",
                transaction_id="TXN-DEMO-002",
                customer_id=medium_customer.id,
                amount=42000.00,
                transaction_type="TRANSFER",
                timestamp=utc_now() - timedelta(hours=4),
                status="REVIEW",
                merchant="Northwind Capital",
                created_at=utc_now(),
            )
            db.add(tx)
            for event_type, offset in [("LOGIN", 0), ("DEVICE_CHANGE", 5), ("TRANSACTION", 9)]:
                db.add(BehaviourEvent(
                    id=f"EV-DEMO-{10 + offset}",
                    customer_id=medium_customer.id,
                    transaction_id=tx.id,
                    event_type=event_type,
                    timestamp=tx.timestamp + timedelta(minutes=offset),
                    event_metadata={"source": "mobile"},
                ))
            db.add(RiskAssessment(
                id="RA-DEMO-002",
                transaction_id=tx.id,
                fraud_probability=0.34,
                anomaly_score=0.41,
                risk_score=52,
                risk_level="MEDIUM",
                risk_factors=[{"feature": "device_change", "impact": 11, "severity": "MEDIUM"}],
                model_version="mock-v1",
                created_at=utc_now(),
            ))
            db.add(Alert(
                id="ALERT-DEMO-002",
                transaction_id=tx.id,
                customer_id=medium_customer.id,
                severity="MEDIUM",
                title="Unusual device pattern",
                message="Customer logged in from a new device during a transfer burst.",
                status="INVESTIGATING",
                created_at=utc_now(),
            ))

    if suspicious_customer is not None:
        tx = db.get(Transaction, "TXN-DEMO-003")
        if tx is None:
            tx = Transaction(
                id="TXN-DEMO-003",
                transaction_id="TXN-DEMO-003",
                customer_id=suspicious_customer.id,
                amount=85000.00,
                transaction_type="TRANSFER",
                timestamp=utc_now() - timedelta(hours=1),
                status="FLAGGED",
                merchant="QuickPay FX",
                created_at=utc_now(),
            )
            db.add(tx)
            suspicious_events = [
                ("LOGIN", 0),
                ("DEVICE_CHANGE", 3),
                ("LOCATION_CHANGE", 8),
                ("BENEFICIARY_ADDED", 11),
                ("TRANSACTION", 16),
            ]
            for event_type, offset in suspicious_events:
                db.add(BehaviourEvent(
                    id=f"EV-DEMO-{20 + offset}",
                    customer_id=suspicious_customer.id,
                    transaction_id=tx.id,
                    event_type=event_type,
                    timestamp=tx.timestamp + timedelta(minutes=offset),
                    event_metadata={"location": "abroad", "device": "new_phone"},
                ))
            risk_factors = build_risk_factors([event for event, _ in suspicious_events], tx.amount)
            db.add(RiskAssessment(
                id="RA-DEMO-003",
                transaction_id=tx.id,
                fraud_probability=0.89,
                anomaly_score=0.93,
                risk_score=91,
                risk_level="HIGH",
                risk_factors=risk_factors,
                model_version="mock-v1",
                created_at=utc_now(),
            ))
            db.add(Alert(
                id="ALERT-DEMO-003",
                transaction_id=tx.id,
                customer_id=suspicious_customer.id,
                severity="HIGH",
                title="High risk transfer pattern",
                message="Risk model detected rapid device and location changes followed by high-value transfer.",
                status="OPEN",
                created_at=utc_now(),
            ))

    db.commit()


def seed_database() -> None:
    init_db()
    db = SessionLocal()
    try:
        customer_count = db.query(Customer).count()
        if customer_count == 0:
            for index in range(1, 1001):
                customer_code = generate_customer_code(index)
                customer = Customer(
                    id=customer_code,
                    customer_code=customer_code,
                    status="ACTIVE",
                    created_at=utc_now() - timedelta(days=random.randint(1, 365)),
                )
                db.add(customer)

            db.flush()

            for index in range(1, 10001):
                customer = db.get(Customer, generate_customer_code(random.randint(1, 1000)))
                if customer is None:
                    continue
                event_types = ["LOGIN", "TRANSACTION", "LOGOUT"]
                if index % 7 == 0:
                    event_types = ["LOGIN", "DEVICE_CHANGE", "LOCATION_CHANGE", "BENEFICIARY_ADDED", "TRANSACTION"]
                amount = round(random.uniform(20, 75000), 2)
                if index % 11 == 0:
                    amount = round(random.uniform(120000, 500000), 2)
                transaction = Transaction(
                    id=f"TXN-{100000 + index:06d}",
                    transaction_id=f"TXN-{100000 + index:06d}",
                    customer_id=customer.id,
                    amount=amount,
                    transaction_type=random.choice(["PAYMENT", "TRANSFER", "WITHDRAWAL", "DEPOSIT"]),
                    timestamp=utc_now() - timedelta(minutes=random.randint(1, 100000)),
                    status=random.choice(["COMPLETED", "PENDING", "FLAGGED", "REVIEW"]),
                    merchant=random.choice(["Northwind", "Aurora Market", "SwiftPay", "Local Bank", "Vertex Travel"]),
                    created_at=utc_now() - timedelta(minutes=random.randint(1, 100000)),
                )
                db.add(transaction)
                db.flush()

                suspicious_sequence = ["LOGIN", "DEVICE_CHANGE", "LOCATION_CHANGE", "BENEFICIARY_ADDED", "TRANSACTION"]
                for event_index, event_type in enumerate(random.choice([suspicious_sequence, ["LOGIN", "TRANSACTION", "LOGOUT"]])):
                    db.add(BehaviourEvent(
                        id=f"EV-{index}-{event_index}",
                        customer_id=customer.id,
                        transaction_id=transaction.id,
                        event_type=event_type,
                        timestamp=transaction.timestamp + timedelta(minutes=event_index * 2),
                        event_metadata={"source": "web" if event_index % 2 == 0 else "app", "step": event_index},
                    ))

                risk_score = random.randint(8, 97)
                risk_level = "LOW" if risk_score < 31 else "MEDIUM" if risk_score < 71 else "HIGH"
                fraud_probability = round(random.uniform(0.05, 0.95), 3)
                anomaly_score = round(random.uniform(0.06, 0.98), 3)
                risk_factors = build_risk_factors(["LOGIN", "TRANSACTION"], amount)
                if risk_level == "HIGH":
                    risk_factors = build_risk_factors(["DEVICE_CHANGE", "LOCATION_CHANGE", "BENEFICIARY_ADDED", "TRANSACTION"], amount)
                db.add(RiskAssessment(
                    id=f"RA-{index}",
                    transaction_id=transaction.id,
                    fraud_probability=fraud_probability,
                    anomaly_score=anomaly_score,
                    risk_score=risk_score,
                    risk_level=risk_level,
                    risk_factors=risk_factors,
                    model_version="mock-v1",
                    created_at=transaction.created_at,
                ))

                if risk_level in {"HIGH", "MEDIUM"} and index % 18 == 0:
                    db.add(Alert(
                        id=f"ALERT-{index}",
                        transaction_id=transaction.id,
                        customer_id=customer.id,
                        severity=risk_level,
                        title="Behavioural anomaly flagged",
                        message="Unusual transaction behaviour matched defined fraud heuristics.",
                        status=random.choice(["OPEN", "INVESTIGATING", "RESOLVED"]),
                        created_at=transaction.created_at,
                    ))

            for pattern_index in range(1, 11):
                db.add(EmergingPattern(
                    id=f"PAT-{pattern_index:03d}",
                    pattern_code=f"PAT-{pattern_index:03d}",
                    description="New device followed by location shift and beneficiary change before high-value transfer.",
                    accounts_affected=random.randint(12, 90),
                    fraud_association=round(random.uniform(0.55, 0.92), 2),
                    confidence=round(random.uniform(0.78, 0.97), 2),
                    status="ACTIVE",
                    created_at=utc_now() - timedelta(days=random.randint(1, 30)),
                ))

        create_demo_customers(db)
        db.commit()
        print("Seed data created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

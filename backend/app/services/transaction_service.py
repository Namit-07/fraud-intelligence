from datetime import UTC, datetime, timedelta
from random import choice, randint, uniform


def get_mock_transactions() -> list[dict]:
    now = datetime.now(UTC)
    rows = []
    risk_levels = ["LOW", "MEDIUM", "HIGH"]

    for i in range(1, 51):
        risk = choice(risk_levels)
        rows.append(
            {
                "id": f"TXN{1000 + i}",
                "customer_id": f"C{100 + i}",
                "amount": round(uniform(500, 120000), 2),
                "transaction_type": choice(["UPI", "NEFT", "IMPS", "CARD"]),
                "timestamp": (now - timedelta(minutes=i * 5)).isoformat(),
                "status": choice(["COMPLETED", "FLAGGED", "REVIEW"]),
                "risk_score": randint(10, 98),
                "risk_level": risk,
            }
        )

    return rows


def simulate_transaction(mode: str) -> dict:
    base = {
        "transaction": {
            "id": f"TXN_SIM_{randint(10000, 99999)}",
            "customer_id": f"C{randint(1000, 9999)}",
            "amount": round(uniform(800, 150000), 2),
            "transaction_type": choice(["UPI", "NEFT", "IMPS"]),
            "timestamp": datetime.now(UTC).isoformat(),
        },
        "sequence": ["LOGIN", "KYC_COMPLETE", "TRANSACTION"],
    }

    if mode == "suspicious":
        base["sequence"] = [
            "LOGIN",
            "DEVICE_CHANGE",
            "LOCATION_CHANGE",
            "BENEFICIARY_ADDED",
            "HIGH_VALUE_TRANSACTION",
        ]

    return base

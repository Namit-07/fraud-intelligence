from fastapi import APIRouter, HTTPException

from app.schemas.risk import MLPrediction, RiskAssessmentRequest, RiskAssessmentResponse
from app.services.ml_service import predict_risk
from app.services.risk_service import calculate_risk_score
from app.services.transaction_service import get_mock_transactions

router = APIRouter(tags=["investigations", "risk"])


@router.get("/api/investigations/{transaction_id}")
def get_investigation(transaction_id: str) -> dict:
    transaction = next((row for row in get_mock_transactions() if row["id"] == transaction_id), None)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Investigation not found")

    return {
        "transaction": transaction,
        "risk_assessment": {
            "fraud_probability": 0.82,
            "anomaly_score": 0.91,
            "risk_score": 87,
            "risk_level": "HIGH",
            "risk_factors": [
                {"feature": "transaction_velocity", "impact": 24, "severity": "HIGH"},
                {"feature": "device_change", "impact": 19, "severity": "HIGH"},
                {"feature": "location_anomaly", "impact": 16, "severity": "HIGH"},
                {"feature": "new_beneficiary", "impact": 12, "severity": "MEDIUM"},
            ],
        },
        "behaviour_events": [
            {
                "id": "EV-1",
                "customer_id": transaction["customer_id"],
                "transaction_id": transaction["id"],
                "event_type": "LOGIN",
                "timestamp": transaction["timestamp"],
            },
            {
                "id": "EV-2",
                "customer_id": transaction["customer_id"],
                "transaction_id": transaction["id"],
                "event_type": "COUNTRY_CHANGE",
                "timestamp": transaction["timestamp"],
            },
            {
                "id": "EV-3",
                "customer_id": transaction["customer_id"],
                "transaction_id": transaction["id"],
                "event_type": "BENEFICIARY_ADDED",
                "timestamp": transaction["timestamp"],
            },
        ],
    }


@router.post("/api/risk/assess", response_model=RiskAssessmentResponse)
async def assess_risk(payload: RiskAssessmentRequest) -> RiskAssessmentResponse:
    prediction_payload = payload.model_dump()
    ml_raw = await predict_risk(prediction_payload)
    prediction = MLPrediction(**ml_raw)

    risk_score, risk_level = calculate_risk_score(prediction)

    return RiskAssessmentResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        fraud_probability=prediction.fraud_probability,
        anomaly_score=prediction.anomaly_score,
        risk_factors=prediction.risk_factors,
    )

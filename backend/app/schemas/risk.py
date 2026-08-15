from pydantic import BaseModel, Field


class RiskFactor(BaseModel):
    feature: str
    impact: int
    severity: str


class MLPrediction(BaseModel):
    fraud_probability: float = Field(..., ge=0, le=1)
    anomaly_score: float = Field(..., ge=0, le=1)
    risk_factors: list[RiskFactor]


class RiskAssessmentRequest(BaseModel):
    transaction_id: str
    customer_id: str
    amount: float
    transaction_type: str
    behaviour_events: list[dict] = []


class RiskAssessmentResponse(BaseModel):
    risk_score: int
    risk_level: str
    fraud_probability: float
    anomaly_score: float
    risk_factors: list[RiskFactor]

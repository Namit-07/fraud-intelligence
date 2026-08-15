# AI/ML Handoff

This document is for the teammate implementing the fraud model service.

## What Is Already Done

- Frontend and backend integration path is working.
- Backend persists transactions, behaviour events, risk assessments, and alerts.
- A fallback mock model exists, so app remains stable if model service is unavailable.
- Simulation endpoint already calls model inference through backend abstraction.

## What You Need To Build

Build an inference API service with one endpoint:

- POST /predict

Host it at a base URL that backend can access via ML_SERVICE_URL.

## Hard Contract

### Request

```json
{
  "transaction_id": "TXN_SIM_60770",
  "customer_id": "C3323",
  "amount": 28534.09,
  "transaction_type": "NEFT",
  "behaviour_events": ["LOGIN", "DEVICE_CHANGE", "LOCATION_CHANGE"]
}
```

### Response

```json
{
  "fraud_probability": 0.71,
  "anomaly_score": 0.63,
  "risk_factors": [
    {"feature": "device_change", "impact": 19, "severity": "HIGH"},
    {"feature": "location_anomaly", "impact": 16, "severity": "HIGH"}
  ]
}
```

### Response Rules

- fraud_probability must be in range [0, 1].
- anomaly_score must be in range [0, 1].
- risk_factors must be a JSON array.
- each risk_factors item needs feature (string), impact (int), severity (string).

## Backend Behavior You Should Know

- Backend timeout to ML endpoint is 10s.
- Any timeout, non-2xx, or invalid JSON triggers fallback scoring.
- This keeps demo alive even during model failures.

## Integration Location in Backend

- ML call: backend/app/services/ml_service.py
- Risk normalization: backend/app/services/risk_service.py
- Simulate and persistence flow: backend/app/main.py

## Local Wiring

In backend/.env:

```env
ML_SERVICE_URL=http://localhost:8001
```

Then backend calls:

- http://localhost:8001/predict

## Quick End-to-End Test

1. Start your ML service.
2. Start backend.
3. Trigger simulation:

```bash
curl -X POST "http://127.0.0.1:8000/api/demo/simulate?mode=suspicious"
```

4. Confirm model path is active by checking returned risk values and persistence status.

## Non-Goals For ML Teammate

- Do not change frontend.
- Do not change backend API routes.
- Do not redesign data models.

You only need to provide the model endpoint contract above.

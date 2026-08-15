# ML Folder

This directory is reserved for the ML/AI team.

## Goal

Provide a model inference service that the backend can call for fraud scoring.

## Required HTTP Contract

- Method: POST
- Path: /predict
- Content-Type: application/json
- Base URL: comes from backend env variable ML_SERVICE_URL

## Request Payload

The backend currently sends JSON like:

```json
{
	"transaction_id": "TXN_SIM_60770",
	"customer_id": "C3323",
	"amount": 28534.09,
	"transaction_type": "NEFT",
	"behaviour_events": [
		"LOGIN",
		"DEVICE_CHANGE",
		"LOCATION_CHANGE",
		"BENEFICIARY_ADDED",
		"HIGH_VALUE_TRANSACTION"
	]
}
```

## Response Payload (must match)

Return HTTP 200 with JSON:

```json
{
	"fraud_probability": 0.71,
	"anomaly_score": 0.63,
	"risk_factors": [
		{
			"feature": "device_change",
			"impact": 19,
			"severity": "HIGH"
		},
		{
			"feature": "location_anomaly",
			"impact": 16,
			"severity": "HIGH"
		}
	]
}
```

Constraints:

- fraud_probability: float between 0 and 1
- anomaly_score: float between 0 and 1
- risk_factors: array of objects with:
	- feature: string
	- impact: integer
	- severity: string (recommended LOW, MEDIUM, HIGH)

## Important Integration Notes

- Backend timeout for ML call is 10 seconds.
- If the ML service is down, times out, returns non-2xx, or invalid JSON, backend automatically falls back to mock logic.
- Keep endpoint stable at /predict to avoid backend changes.

## Local Test Target

Run ML service at:

- http://localhost:8001/predict

Then set backend .env:

- ML_SERVICE_URL=http://localhost:8001

## Quick Verification

Use this request to test your service manually:

```bash
curl -X POST http://localhost:8001/predict \
	-H "Content-Type: application/json" \
	-d '{
		"transaction_id":"TXN_TEST_001",
		"customer_id":"CUST_TEST_001",
		"amount":75000,
		"transaction_type":"TRANSFER",
		"behaviour_events":["LOGIN","DEVICE_CHANGE","LOCATION_CHANGE","TRANSACTION"]
	}'
```

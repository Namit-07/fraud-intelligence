from app.schemas.risk import MLPrediction


def calculate_risk_score(prediction: MLPrediction) -> tuple[int, str]:
    fraud_weight = prediction.fraud_probability * 100 * 0.5
    anomaly_weight = prediction.anomaly_score * 100 * 0.3
    factor_weight = min(sum(max(f.impact, 0) for f in prediction.risk_factors), 100) * 0.2

    score = round(fraud_weight + anomaly_weight + factor_weight)
    score = max(0, min(score, 100))

    if score >= 75:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return score, level

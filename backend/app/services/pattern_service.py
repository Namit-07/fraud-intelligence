from app.schemas.pattern import EmergingPattern


def get_mock_patterns() -> list[EmergingPattern]:
    return [
        EmergingPattern(
            id="PATTERN-17",
            pattern_name="New Device",
            sequence=[
                "NEW_DEVICE",
                "LOCATION_CHANGE",
                "BENEFICIARY_ADDED",
                "HIGH_VALUE_TRANSACTION",
            ],
            accounts_affected=47,
            fraud_association=0.73,
            confidence=0.91,
        ),
        EmergingPattern(
            id="PATTERN-21",
            pattern_name="Fast Repeated Transfers",
            sequence=[
                "LOGIN",
                "KYC_COMPLETE",
                "MANY_TRANSFERS",
                "DEVICE_SUSPICION",
            ],
            accounts_affected=22,
            fraud_association=0.58,
            confidence=0.84,
        ),
    ]

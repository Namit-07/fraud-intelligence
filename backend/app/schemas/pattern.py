from pydantic import BaseModel


class EmergingPattern(BaseModel):
    id: str
    pattern_name: str | None = None
    sequence: list[str]
    accounts_affected: int
    fraud_association: float
    confidence: float

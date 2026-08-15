from datetime import datetime
from pydantic import BaseModel


class BehaviourEventOut(BaseModel):
    id: str
    customer_id: str
    transaction_id: str
    event_type: str
    timestamp: datetime
    metadata: dict

    class Config:
        from_attributes = True

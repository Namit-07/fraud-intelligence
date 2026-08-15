from datetime import datetime

from pydantic import BaseModel


class TransactionBase(BaseModel):
    customer_id: str
    amount: float
    transaction_type: str
    status: str = "PENDING"


class TransactionCreate(TransactionBase):
    id: str


class TransactionOut(TransactionBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

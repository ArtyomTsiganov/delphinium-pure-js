import datetime

from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional

from app.models import OrderTypes


class OrderItemsCreate(BaseModel):
    order_id: int
    card_id: str

    price: Decimal
    count: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    order_id: int

    name: str
    email: str
    phone_number: str
    creation_date: datetime.datetime
    closing_date: datetime.datetime
    postal_code: str
    order_type: OrderTypes
    address: str
    comment: str

    status: str # нужно енамом сделать
    class Config:
        from_attributes = True
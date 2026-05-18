from datetime import datetime

from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional

from app.models import OrderTypes, OrderStatus


###################################### BASE
class OrderItemBase(BaseModel):
    card_id: int
    count: int

class OrderBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None

    order_type: Optional[OrderTypes] = None

    postal_code: Optional[str] = None
    address: Optional[str] = None
    comment: Optional[str] = None

###################################### CREATE

class OrderItemCreate(OrderItemBase):
    pass

class OrderCreate(OrderBase):
    name: str
    email: str
    phone_number: str

    order_type: OrderTypes

    postal_code: Optional[str] = None
    address: Optional[str] = None
    comment: Optional[str] = None

###################################### RESPONSE
class OrderItemResponse(OrderItemBase):
    order_id: int
    price: Decimal

    class Config:
        from_attributes = True

class OrderResponse(OrderBase):
    order_id: int

    status: OrderStatus

    creation_date: datetime
    closing_date: Optional[datetime] = None

    class Config:
        from_attributes = True
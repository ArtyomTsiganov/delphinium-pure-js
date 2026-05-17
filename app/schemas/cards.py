from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional


class CardCreate(BaseModel):
    card_id: int
    name: str
    short_name: Optional[str] = None
    price: Decimal
    category_id: int
    count: int
    description: str
    image_url: str
    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    category_id: int
    name: str

    class Config:
        from_attributes = True
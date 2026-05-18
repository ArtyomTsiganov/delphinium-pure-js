from pydantic import BaseModel

from decimal import Decimal
from typing import List, Optional


###################################### BASE
class CardBase(BaseModel):
    name: str
    short_name: Optional[str] = None
    price: Decimal
    category_id: int
    count: int
    description: str
    image_url: str


class CategoryBase(BaseModel):
    name: str


###################################### CREATE
class CardCreate(CardBase):
    pass


class CategoryCreate(CategoryBase):
    pass

###################################### RESPONSE

class CategoryResponse(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True


class CardResponse(CardBase):
    card_id: int

    class Config:
        from_attributes = True

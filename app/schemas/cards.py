from pydantic import BaseModel, field_serializer, computed_field

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

    @field_serializer('price')
    def serialize_price(self, price: Decimal) -> str:
        return str(price.normalize())

    @computed_field
    @property
    def image(self) -> str:
        return self.image_url

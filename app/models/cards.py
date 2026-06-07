from datetime import datetime
from decimal import Decimal
from typing import List, Optional, TYPE_CHECKING

from sqlalchemy import Column, Integer, String, BIGINT, VARCHAR, DECIMAL, TEXT, ARRAY, TIMESTAMP, BigInteger, \
    ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models.orders import OrderItems

from app.database import Base

# https://drawsql.app/teams/artyomtsiganov/diagrams/shop-datebase

class Categories(Base):
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)

    cards: Mapped[List["Cards"]] = relationship(back_populates="category")


class Cards(Base):
    __tablename__ = "cards"

    card_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.category_id"))
    short_name: Mapped[Optional[str]] = mapped_column(String)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    count: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(String)
    image_url: Mapped[str] = mapped_column(String)

    category: Mapped["Categories"] = relationship(back_populates="cards")

    order_associations: Mapped[List["OrderItems"]] = relationship(
        back_populates="card"
    )
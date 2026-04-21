from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import Column, Integer, String, BIGINT, VARCHAR, DECIMAL, TEXT, ARRAY, TIMESTAMP, BigInteger, \
    ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base

# https://drawsql.app/teams/artyomtsiganov/diagrams/shop-datebase

class Categories(Base):
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String)

    cards: Mapped[List["Cards"]] = relationship(back_populates="category")


class Cards(Base):
    __tablename__ = "cards"

    card_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.category_id"))
    short_name: Mapped[Optional[str]] = mapped_column(String)

    price: Mapped[Decimal] = mapped_column(Numeric)
    count: Mapped[int] = mapped_column(BigInteger)
    description: Mapped[str] = mapped_column(String)
    image_url: Mapped[str] = mapped_column(String)

    category: Mapped["Categories"] = relationship(back_populates="cards")


class BlogPosts(Base):
    __tablename__ = "blog_posts"

    post_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    text: Mapped[str] = mapped_column(String)

    creation_date: Mapped[datetime] = mapped_column(TIMESTAMP)

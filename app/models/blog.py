from datetime import datetime

from sqlalchemy import Column, Integer, String, BIGINT, VARCHAR, DECIMAL, TEXT, ARRAY, TIMESTAMP, BigInteger, \
    ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, func

from app.database import Base


class BlogPosts(Base):
    __tablename__ = "blog_posts"

    post_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    text: Mapped[str] = mapped_column(String)

    creation_date: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
        server_default=func.now()
    )

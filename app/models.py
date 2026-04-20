from sqlalchemy import Column, Integer, String, BIGINT, VARCHAR, DECIMAL, TEXT, ARRAY

from .database import Base

class Cards(Base):
    __tablename__ = "cards"

    card_id = Column(BIGINT, primary_key=True)
    name = Column(String)
    short_name = Column(String, nullable=True)
    price = Column(DECIMAL)
    count = Column(BIGINT)
    description = Column(String)
    image_url = Column(String)


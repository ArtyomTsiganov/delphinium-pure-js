from datetime import datetime
from decimal import Decimal
from typing import List, Optional, TYPE_CHECKING
from enum import Enum

from app.database import Base

from sqlalchemy import Column, Integer, String, BIGINT, VARCHAR, DECIMAL, TEXT, ARRAY, TIMESTAMP, BigInteger, \
    ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, func


if TYPE_CHECKING:
    from app.models.cards import Cards

class OrderStatus(str, Enum):
    PENDING = "pending"       # Создан, ожидает проверки
    RESERVED = "reserved"     # Товар зарезервирован
    COMPLETED = "completed"   # Данные клиента заполнены, заказ оформлен
    PAID = "paid"             # Заказ оплачен
    SHIPPING = "shipping"     # Заказ отправлен
    DELIVERED = "delivered"   # Заказ доставлен
    CLOSED = "closed"         # Заказ завершён
    CANCELLED = "cancelled"   # Отменен/не прошел проверку

class OrderTypes(str, Enum):
    PICKUP = "pickup" # самовывоз
    MAIL = "mail"
    EMAIL = "email"
    ANOTHER = "another"


class OrderItems(Base):
    __tablename__ = "orders"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("order_infos.order_id"), primary_key=True
    )
    card_id: Mapped[int] = mapped_column(
        ForeignKey("cards.card_id"), primary_key=True
    )

    price: Mapped[Decimal] = mapped_column(Numeric)
    count: Mapped[int] = mapped_column(Integer)

    order: Mapped["Orders"] = relationship(back_populates="card_associations")
    card: Mapped["Cards"] = relationship(back_populates="order_associations")



class Orders(Base):
    __tablename__ = "order_infos"

    order_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    status: Mapped[OrderStatus] = mapped_column(
        String, default=OrderStatus.PENDING
    )

    name: Mapped[str] = mapped_column(String, nullable=True)
    email:  Mapped[str] = mapped_column(String, nullable=True)
    phone_number:  Mapped[str] = mapped_column(String, nullable=True)

    creation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    closing_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    order_type: Mapped[OrderTypes] = mapped_column(String, nullable=True)
    postal_code:  Mapped[str] = mapped_column(String, nullable=True)
    address:  Mapped[str] = mapped_column(String, nullable=True)
    comment:  Mapped[str] = mapped_column(String, nullable=True)


    card_associations: Mapped[List["OrderItems"]] = relationship(back_populates="order")
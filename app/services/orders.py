import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Cards, OrderItems, Orders, OrderStatus
from app.schemas.orders import OrderCreate, OrderItemCreate

class OrderServiceError(Exception):
    """Базовое исключение для сервиса заказов"""
    pass


class OrderNotFoundError(OrderServiceError):
    def __init__(self, public_id: uuid.UUID):
        super().__init__(f"Заказ #{public_id} не найден")


class ProductNotFoundError(OrderServiceError):
    def __init__(self, card_id: int):
        super().__init__(f"Товара с ID {card_id} не существует")


class OutOfStockError(OrderServiceError):
    def __init__(self, product_name: str):
        super().__init__(f"Недостаточно товара '{product_name}' на складе")


class InvalidOrderStatusError(OrderServiceError):
    def __init__(self, message: str = "Заказ не найден или не зарезервирован"):
        super().__init__(message)

class OrderService:

    @staticmethod
    async def get_all_orders(db: AsyncSession) -> list[Orders]:
        query = select(Orders)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_items_by_public_id(db: AsyncSession, public_id: uuid.UUID) -> list[OrderItems]:
        order = await OrderService.get_order_by_public_id(db, public_id)
        return await OrderService._get_items_by_order_id(db, order.order_id)

    @staticmethod
    async def _get_items_by_order_id(db: AsyncSession, order_id: int) -> list[OrderItems]:
        query = select(OrderItems).where(OrderItems.order_id == order_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_all_items(db: AsyncSession) -> list[OrderItems]:
        query = select(OrderItems)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_order_by_public_id(db: AsyncSession, public_id: uuid.UUID) -> Orders:
        query = (
            select(Orders)
            .where(Orders.public_id == public_id)
            .options(selectinload(Orders.card_associations))
        )
        result = await db.execute(query)
        order = result.scalar_one_or_none()
        if not order:
            raise OrderNotFoundError(public_id)
        return order

    @staticmethod
    async def create_order(db: AsyncSession, order_items_in: list[OrderItemCreate]) -> Orders:
        new_order = Orders(status=OrderStatus.PENDING)
        db.add(new_order)
        await db.flush()  # Получаем ID нового заказа внутри транзакции

        for item in order_items_in:
            # Блокируем строку товара до конца транзакции (with_for_update)
            query = select(Cards).where(Cards.card_id == item.card_id).with_for_update()
            result = await db.execute(query)
            product_card = result.scalar_one_or_none()

            if product_card is None:
                raise ProductNotFoundError(item.card_id)

            if product_card.count < item.count:
                raise OutOfStockError(product_card.name)

            product_card.count -= item.count

            order_item = OrderItems(
                order_id=new_order.order_id,
                card_id=item.card_id,
                price=product_card.price,
                count=item.count
            )
            db.add(order_item)

        new_order.status = OrderStatus.RESERVED
        await db.commit()
        await db.refresh(new_order, attribute_names=["card_associations"])
        return new_order

    @staticmethod
    async def checkout_order(db: AsyncSession, public_id: uuid.UUID, user_info: OrderCreate) -> Orders:
        order = await OrderService.get_order_by_public_id(db, public_id)

        if order.status != OrderStatus.RESERVED:
            raise InvalidOrderStatusError("Заказ не найден или не зарезервирован")

        # Наполнение данными клиента без регистрации
        order.name = user_info.name
        order.email = user_info.email
        order.phone_number = user_info.phone_number
        order.address = user_info.address
        order.postal_code = user_info.postal_code
        order.order_type = user_info.order_type

        order.status = OrderStatus.COMPLETED

        await db.commit()
        await db.refresh(order, attribute_names=["card_associations"])
        return order

    @staticmethod
    async def change_status(db: AsyncSession, public_id: uuid.UUID, new_status: OrderStatus) -> Orders:
        order = await OrderService.get_order_by_public_id(db, public_id)
        order.status = new_status

        await db.commit()
        await db.refresh(order, attribute_names=["card_associations"])
        return order

    @staticmethod
    async def delete_order(db: AsyncSession, public_id: uuid.UUID) -> None:
        order = await OrderService.get_order_by_public_id(db, public_id)
        items = await OrderService._get_items_by_order_id(db, order.order_id)

        card_ids = [item.card_id for item in items]
        query = select(Cards).where(Cards.card_id.in_(card_ids)).with_for_update()
        result = await db.execute(query)
        cards_dict = {c.card_id: c for c in result.scalars().all()}

        for item in items:
            product_card = cards_dict.get(item.card_id)
            if product_card is None:
                raise ProductNotFoundError(item.card_id)
            product_card.count += item.count

        await db.delete(order)
        await db.commit()
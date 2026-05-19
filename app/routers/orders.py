from fastapi import APIRouter, Depends, Query, HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Cards, OrderItems, Orders, OrderStatus
from app.schemas.orders import OrderCreate, OrderItemCreate, OrderResponse, OrderItemResponse
from app.database import get_db


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# TODO написать тесты для этого

@router.get(
    "/",
    response_model=list[OrderResponse]
)
async def get_orders(db: AsyncSession = Depends(get_db)):
    query = select(Orders)
    result = await db.execute(query)
    return result.scalars().all()

@router.get(
    "/items",
    response_model=list[OrderItemResponse]
)
async def get_order_items(db: AsyncSession = Depends(get_db)):
    query = select(OrderItems)
    result = await db.execute(query)
    return result.scalars().all()


@router.post(
    "/",
    response_model=OrderResponse
)
async def create_order(
    order_items_in: list[OrderItemCreate],
    db: AsyncSession = Depends(get_db)
):
    new_order = Orders(status=OrderStatus.PENDING)
    db.add(new_order)
    await db.flush()  # Получаем new_order.order_id без фиксации транзакции

    for item in order_items_in:
        query = (
            select(Cards)
            .where(Cards.card_id == item.card_id)
            .with_for_update()
        )

        result = await db.execute(query)

        product_card = result.scalar_one_or_none()

        if product_card is None:
            raise HTTPException(status_code=400, detail=f"Товара { item.card_id} не существует")

        if product_card.count < item.count:
            raise HTTPException(status_code=400, detail=f"Недостаточно товара {product_card.name}")

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


@router.put(
    "/{order_id}/checkout",
    response_model = OrderResponse
)
async def checkout_order(
        order_id: int,
        user_info: OrderCreate,
        db: AsyncSession = Depends(get_db)
):
    order = await db.get(
        Orders,
        order_id,
        options=[selectinload(Orders.card_associations)]
    )
    if not order or order.status != OrderStatus.RESERVED:
        raise HTTPException(status_code=400, detail="Заказ не найден или не зарезервирован")

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

@router.put(
    "/{order_id}/change",
    response_model = OrderResponse
)
async def checkout_order(
        order_id: int,
        new_status: OrderStatus,
        db: AsyncSession = Depends(get_db)
):
    order = await db.get(
        Orders,
        order_id,
        options=[selectinload(Orders.card_associations)]
    )
    if not order:
        raise HTTPException(status_code=400, detail="Заказ не найден или не зарезервирован")

    order.status = new_status

    await db.commit()
    await db.refresh(order, attribute_names=["card_associations"])
    return order

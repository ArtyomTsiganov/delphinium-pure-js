from fastapi import APIRouter, Depends, Query, HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Cards, OrderItems, Orders, OrderStatus
from app.schemas.orders import OrderCreate, OrderItemsCreate
from app.database import get_db

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# TODO написать тесты для этого

@router.get("/")
async def get_orders(db: AsyncSession = Depends(get_db)):
    query = select(Orders)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/info")
async def get_order_items(db: AsyncSession = Depends(get_db)):
    query = select(OrderItems)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/")
async def create_order(
    order_items_in: list[OrderItemsCreate],
    db: AsyncSession = Depends(get_db)
):
    new_order = Orders(status=OrderStatus.PENDING)
    db.add(new_order)
    await db.flush()  # Получаем new_order.order_id без фиксации транзакции

    for item in order_items_in:
        product_card = await db.get(Cards, item.card_id)
        if product_card is None:
            raise HTTPException(status_code=400, detail=f"Товара { item.card_id} не существует")

        if product_card.count < item.count:
            raise HTTPException(status_code=400, detail=f"Недостаточно товара {product_card.name}")

        product_card.count -= item.count

        order_item = OrderItems(
            card_id=item.card_id,
            price=product_card.price,
            count=item.count
        )
        new_order.card_associations.append(order_item)

    new_order.status = OrderStatus.RESERVED

    await db.commit()
    await db.refresh(new_order)
    return new_order


@router.put("/{order_id}/checkout")
async def checkout_order(
        order_id: int,
        user_info: OrderCreate,
        db: AsyncSession = Depends(get_db)
):
    order = await db.get(Orders, order_id)
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
    return {"status": "success", "message": "Заказ успешно оформлен"}


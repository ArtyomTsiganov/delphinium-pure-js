import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import OrderStatus
from app.schemas.orders import OrderCreate, OrderItemCreate, OrderResponse, OrderItemResponse, OrderOnlyItemResponse
from app.schemas.schemas import SuccessResponse
from app.services.orders import (
    OrderService,
    OrderNotFoundError,
    ProductNotFoundError,
    OutOfStockError,
    InvalidOrderStatusError
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.get("/", response_model=list[OrderResponse])
async def get_orders(db: AsyncSession = Depends(get_db)):
    return await OrderService.get_all_orders(db)


@router.get("/items", response_model=list[OrderItemResponse])
async def get_order_items(db: AsyncSession = Depends(get_db)):
    return await OrderService.get_all_items(db)


@router.post("/", response_model=OrderResponse)
async def create_order(
    order_items_in: list[OrderItemCreate],
    db: AsyncSession = Depends(get_db)
):
    try:
        return await OrderService.create_order(db, order_items_in)
    except (ProductNotFoundError, OutOfStockError) as e:
        await db.rollback()  # Важно откатить транзакцию и снять блокировки строк
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/{public_id}/checkout", response_model=OrderResponse)
async def checkout_order(
    public_id: uuid.UUID,
    user_info: OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        return await OrderService.checkout_order(db, public_id, user_info)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except InvalidOrderStatusError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{public_id}/change", response_model=OrderResponse)
async def change_order_status(
    public_id: uuid.UUID,
    new_status: OrderStatus,
    db: AsyncSession = Depends(get_db)
):
    try:
        return await OrderService.change_status(db, public_id, new_status)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{public_id}/items", response_model=list[OrderOnlyItemResponse])
async def get_order_items_by_id(
    public_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    try:
        return await OrderService.get_items_by_public_id(db, public_id)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{public_id}/", response_model=OrderResponse)
async def get_order_by_id(
    public_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    try:
        return await OrderService.get_order_by_public_id(db, public_id)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{public_id}/", response_model=SuccessResponse)
async def delete_order(
    public_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    try:
        await OrderService.delete_order(db, public_id)
        return {"status": "Item successfully deleted", "added_count": -1}
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
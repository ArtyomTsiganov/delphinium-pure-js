from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.cards import CategoryResponse, CardResponse, CategoryCreate, CardCreate
from app.schemas.schemas import SuccessResponse
from app.services.cards import CardService

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/category", response_model=list[CategoryResponse])
async def get_category(db: AsyncSession = Depends(get_db)):
    return await CardService.get_all_categories(db)


@router.get("", response_model=list[CardResponse])
async def get_cards(
    card_id: list[int] = Query(None),
    count: int = 1,
    order_by: str = "name",  # id, name, price, count, random
    name_filter: str | None = None,
    category_filter: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    return await CardService.get_filtered_cards(
        db=db,
        card_ids=card_id,
        count=count,
        order_by=order_by,
        name_filter=name_filter,
        category_filter=category_filter
    )


@router.post("/category", status_code=201, response_model=SuccessResponse)
async def add_category(
    category_in: list[CategoryCreate],
    db: AsyncSession = Depends(get_db)
):
    try:
        created = await CardService.create_categories(db, category_in)
        return {"status": "success", "added_count": len(created)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")


@router.post("", status_code=201, response_model=SuccessResponse)
async def add_cards(
    cards_in: list[CardCreate],
    db: AsyncSession = Depends(get_db)
):
    try:
        created = await CardService.create_cards(db, cards_in)
        return {"status": "success", "added_count": len(created)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")
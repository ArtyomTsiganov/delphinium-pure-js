from random import shuffle

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Cards, Categories
from app.schemas.cards import CardCreate, CategoryCreate, CategoryResponse, CardResponse
from app.database import get_db
from app.schemas.schemas import SuccessResponse

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

# получить категории товаров
@router.get(
    "/category",
    response_model=list[CategoryResponse]
)
async def get_category(db: AsyncSession = Depends(get_db)):
    query = select(Categories)
    result = await db.execute(query)
    return result.scalars().all()

# получить карточки товара
@router.get(
    "",
    response_model=list[CardResponse]
)
async def get_cards(
        card_id: list[int] = Query(None),
        count: int = 1,
        order_by: str = "name", # id, name, price, count, random
        name_filter: str | None = None,
        category_filter: str| None = None,
        db: AsyncSession = Depends(get_db)):

    query = select(Cards).join(Categories)

    # ordering by id
    if card_id is not None:
        query = query.where(
            Cards.card_id.in_(card_id)
        )

    if category_filter is not None:
        query = query.where(
            Categories.name.ilike(f'%{category_filter}%')
        )

    if name_filter is not None:
        query = query.where(
            Cards.name.ilike(f'%{name_filter}%')
        )

    if order_by == 'random':
        result = await db.execute(query)
        result = result.scalars().all()
        shuffle(result)
        return result[:count]

    elif order_by == 'id':
        query = query.order_by(Cards.card_id)
    elif order_by == 'name':
        query = query.order_by(Cards.name)
    elif order_by == 'price':
        query = query.order_by(Cards.price)
    elif order_by == 'count':
        query = query.order_by(Cards.count)
    query = query.limit(count)

    result = await db.execute(query)
    return result.scalars().all()


@router.post(
    "/category",
    status_code=201,
    response_model=SuccessResponse
)
async def add_category(
        category_in: list[CategoryCreate],
        db: AsyncSession = Depends(get_db)
):
    try:
        new_categories = []
        for category in category_in:
            db_category = Categories(
                name = category.name
            )
            db.add(db_category)
            new_categories.append(db_category)

        await db.commit()  # Сохраняем все сразу

        for cat in new_categories:
            await db.refresh(cat)

        return {"status": "success", "added_count": len(new_categories)}

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")


# todo: сделать верификацию по secret key
@router.post(
    "",
    status_code=201,
    response_model=SuccessResponse
)
async def add_cards(
        cards_in: list[CardCreate],
        db: AsyncSession = Depends(get_db)
):
    try:
        new_cards = []
        for card_data in cards_in:
            db_card = Cards(
                name=card_data.name,
                category_id=card_data.category_id,
                short_name=card_data.short_name,
                price=card_data.price,
                count=card_data.count,
                description=card_data.description,
                image_url = card_data.image_url
            )
            db.add(db_card)
            new_cards.append(db_card)

        await db.commit()  # Сохраняем все сразу
        for card in new_cards:
            await db.refresh(card)
        return {"status": "success", "added_count": len(new_cards)}

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")





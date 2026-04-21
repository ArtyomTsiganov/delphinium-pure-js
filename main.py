from decimal import Decimal
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session, aliased
from fastapi.staticfiles import StaticFiles
from random import shuffle


from .app.database import engine, Base, get_db
from .app.models import *

Base.metadata.create_all(bind=engine)
app = FastAPI()


# получить карточки товара
@app.get("/cards")
def get_cards(
        card_id: list[int] = Query(None),
        count: int = 1,
        order_by: str = "name", # id, name, price, count, random
        name_filter: str | None = None,
        category_filter: str| None = None,
        db: Session = Depends(get_db)):

    query = db.query(Cards).join(Categories)
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
        result = query.all()
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
    return query.limit(count).all()



# получить карточки товара
@app.get("/cards/category")
def get_category(db: Session = Depends(get_db)):
    return db.query(Categories).all()

# Забронировать товар на n минут
@app.post("/cards/book")
def read_item(card_id: list[int] = Query(None), db: Session = Depends(get_db)):
    raise NotImplementedError()


# Такс что ещё нужно:
# Функционал для админки, добавить удалить изменить товар
# Добавить изображения для товара
# Сделать функционал блога
# Сделать функционал заказов
# БД: https://drawsql.app/teams/artyomtsiganov/diagrams/shop-datebase


class CardCreate(BaseModel):
    card_id: int
    name: str
    short_name: Optional[str] = None
    price: Decimal
    category_id: int
    count: int
    description: str
    image_url: str
    class Config:
        from_attributes = True


# todo: сделать верификацию по secret key
@app.post("/cards", status_code=201)
def add_cards(cards_in: list[CardCreate], db: Session = Depends(get_db)):
    try:
        new_cards = []
        for card_data in cards_in:
            db_card = Cards(
                card_id=card_data.card_id,
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

        db.commit()  # Сохраняем все сразу
        return {"status": "success", "added_count": len(new_cards)}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

class CategoryCreate(BaseModel):
    category_id: int
    name: str

    class Config:
        from_attributes = True


@app.post("/cards/category", status_code=201)
def add_category(category_in: list[CategoryCreate], db: Session = Depends(get_db)):
    try:
        new_categories = []
        for category in category_in:
            db_category = Categories(
                category_id = category.category_id,
                name = category.name
            )
            db.add(db_category)
            new_categories.append(db_category)

        db.commit()  # Сохраняем все сразу
        return {"status": "success", "added_count": len(new_categories)}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

app.mount("", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/")
def read_index():
    return FileResponse('frontend/index.html')

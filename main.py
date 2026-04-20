from decimal import Decimal
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .app.database import engine, Base, get_db
from .app.models import Cards

from random import shuffle

Base.metadata.create_all(bind=engine)
app = FastAPI()


# получить карточки товара
@app.get("/cards")
def get_cards(
        card_id: list[int] = Query(None),
        count: int = 1,
        order_by: str = "name", # id, name, price, count, random
        name_filter: str | None = None,
        db: Session = Depends(get_db)):

    query = db.query(Cards)
    # ordering by id
    if card_id is not None:
        query = query.where(
            Cards.card_id.in_(card_id)
        )

    if name_filter is not None:
        query = query.where(
            Cards.name.ilike(f'%{name_filter}%')
        )

    count = min(db.query(Cards).count(), count)

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








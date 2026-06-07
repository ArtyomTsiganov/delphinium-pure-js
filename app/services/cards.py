from random import shuffle
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Cards, Categories
from app.schemas.cards import CardCreate, CategoryCreate


class CardService:
    @staticmethod
    async def get_all_categories(db: AsyncSession):
        query = select(Categories)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def create_categories(db: AsyncSession, categories_in: list[CategoryCreate]):
        new_categories = [Categories(name=cat.name) for cat in categories_in]
        db.add_all(new_categories)  # add_all быстрее, чем цикл с db.add
        await db.commit()
        for cat in new_categories:
            await db.refresh(cat)
        return new_categories

    @staticmethod
    async def get_filtered_cards(
            db: AsyncSession,
            card_ids: list[int] | None = None,
            count: int = 1,
            order_by: str = "name",
            name_filter: str | None = None,
            category_filter: str | None = None
    ):
        query = select(Cards).join(Categories)

        if card_ids:
            query = query.where(Cards.card_id.in_(card_ids))

        if category_filter:
            query = query.where(Categories.name.ilike(f'%{category_filter}%'))

        if name_filter:
            query = query.where(Cards.name.ilike(f'%{name_filter}%'))

        # Логика рандома
        if order_by == 'random':
            result = await db.execute(query)
            cards = list(result.scalars().all())
            shuffle(cards)
            return cards[:count]

        # Стандартная сортировка
        sort_fields = {
            'id': Cards.card_id,
            'name': Cards.name,
            'price': Cards.price,
            'count': Cards.count
        }
        if order_by in sort_fields:
            query = query.order_by(sort_fields[order_by])

        query = query.limit(count)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def create_cards(db: AsyncSession, cards_in: list[CardCreate]):
        new_cards = [
            Cards(
                name=card.name,
                category_id=card.category_id,
                short_name=card.short_name,
                price=card.price,
                count=card.count,
                description=card.description,
                image_url=card.image_url
            ) for card in cards_in
        ]
        db.add_all(new_cards)
        await db.commit()
        for card in new_cards:
            await db.refresh(card)
        return new_cards
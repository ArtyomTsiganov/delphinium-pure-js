from sqlalchemy import select, func

from app.database import AsyncSessionLocal
from app.models import Cards, Categories


CATEGORIES = [
    Categories(category_id=1, name="flowers"),
    Categories(category_id=2, name="books"),
]


CARDS = [
    # --- Цветы (category_id=1) ---
    Cards(
        name="Дельфиниум «Cobalt Dreams»", short_name="Cobalt",
        price="450.00", count=30, category_id=1,
        description="Сеянец новозеландского гибрида 1-го поколения, насыщенный "
                    "кобальтово-синий цвет. Цветение наступает в год посадки.",
        image_url="/assets/delphinium-cobalt.jpg",
    ),
    Cards(
        name="Дельфиниум «Голубое кружево»", short_name="Голубое кружево",
        price="390.00", count=45, category_id=1,
        description="Нежно-голубые махровые соцветия. Устойчив к уральскому климату, "
                    "высота куста до 1.8 м.",
        image_url="/assets/delphinium-blue.jpg",
    ),
    Cards(
        name="Дельфиниум «Пурпурный король»", short_name="Пурпур",
        price="420.00", count=25, category_id=1,
        description="Глубокий фиолетово-пурпурный оттенок с тёмным глазком. "
                    "Эффектная вертикаль для заднего плана цветника.",
        image_url="/assets/delphinium-purple.jpg",
    ),
    Cards(
        name="Дельфиниум «Белоснежка»", short_name="Белоснежка",
        price="410.00", count=20, category_id=1,
        description="Чисто-белые крупные соцветия. Прекрасно сочетается с синими "
                    "и розовыми сортами в групповых посадках.",
        image_url="/assets/delphinium-white.jpg",
    ),
    Cards(
        name="Пион «Сара Бернар»", short_name="Пион",
        price="650.00", count=15, category_id=1,
        description="Классический махровый пион нежно-розового цвета с тонким "
                    "ароматом. Корневище с 3-5 почками.",
        image_url="/assets/peony.jpg",
    ),
    Cards(
        name="Роза чайно-гибридная «Аква»", short_name="Роза Аква",
        price="590.00", count=18, category_id=1,
        description="Сиренево-розовые бутоны идеальной формы. Саженец с закрытой "
                    "корневой системой, готов к высадке.",
        image_url="/assets/rose.jpg",
    ),
    Cards(
        name="Тюльпан «Триумф», микс луковиц", short_name="Тюльпан",
        price="180.00", count=120, category_id=1,
        description="Набор из 10 крупных луковиц разных расцветок. Раннее обильное "
                    "цветение весной.",
        image_url="/assets/tulip.jpg",
    ),
    Cards(
        name="Лаванда узколистная", short_name="Лаванда",
        price="350.00", count=60, category_id=1,
        description="Ароматный многолетник для бордюров и сухих букетов. "
                    "Зимостойкий сорт, выращенный в открытом грунте.",
        image_url="/assets/lavender.jpg",
    ),
    # --- Книги (category_id=2) ---
    Cards(
        name="Сад и огород: полный справочник", short_name="Справочник",
        price="990.00", count=40, category_id=2,
        description="Настольная книга садовода: посадка, уход, календарь работ "
                    "и борьба с вредителями. Твёрдый переплёт, 512 страниц.",
        image_url="/assets/book-garden.jpg",
    ),
    Cards(
        name="Дельфиниумы: выращивание и уход", short_name="Дельфиниумы",
        price="740.00", count=35, category_id=2,
        description="Подробное руководство по агротехнике дельфиниумов от семени "
                    "до цветения. С авторскими фотографиями сортов.",
        image_url="/assets/book-delphinium.jpg",
    ),
    Cards(
        name="Цветы вашего сада", short_name="Цветы сада",
        price="560.00", count=50, category_id=2,
        description="Иллюстрированный определитель садовых цветов с советами по "
                    "сочетанию и оформлению клумб.",
        image_url="/assets/book-flowers.jpg",
    ),
]


async def seed_data():
    """Наполняет БД тестовыми данными при старте приложения.
    Идемпотентна
    """
    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(func.count()).select_from(Categories))
        if existing:
            print("Сидер: данные уже есть, пропускаем.")
            return

        db.add_all(CATEGORIES)
        db.add_all(CARDS)
        await db.commit()
        print(f"Сидер: добавлено {len(CATEGORIES)} категорий и {len(CARDS)} товаров.")

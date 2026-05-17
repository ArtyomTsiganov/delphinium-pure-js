from app.database import Base, engine
from app.models import Base


async def init_database():
    print("Создаем таблицы...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Таблицы успешно созданы!")


if __name__ == "__main__":
    init_database()
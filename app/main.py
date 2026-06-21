from contextlib import asynccontextmanager

from fastapi.responses import FileResponse

from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app.routers import cards, orders
from app.seeder import seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Создаем таблицы...")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Таблицы успешно созданы!")

    await seed_data()

    yield


app = FastAPI(
    title="very beautiful site",
    lifespan=lifespan
)
api_router = APIRouter(prefix="/api")

api_router.include_router(cards.router)
api_router.include_router(orders.router)

app.include_router(api_router)

# БД: https://drawsql.app/teams/artyomtsiganov/diagrams/shop-datebase

app.mount("/source", StaticFiles(directory="frontend/source"), name="source")
app.mount("/assets", StaticFiles(directory="frontend/assets"), name="assets")

@app.get("/")
def read_index():
    return FileResponse('frontend/index.html')


@app.get("/{catchall:path}")
def read_other_paths(catchall: str):
    return FileResponse('frontend/index.html')
    

app.mount("/", StaticFiles(directory="frontend"), name="frontend")


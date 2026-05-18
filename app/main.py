from fastapi.responses import FileResponse

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import cards, orders

app = FastAPI(title="very beautiful site")

# Подключение роутеров
app.include_router(cards.router)
app.include_router(orders.router)

# Такс что ещё нужно:
# Функционал для админки, добавить удалить изменить товар
# Добавить изображения для товара
# Сделать функционал блога
# Сделать функционал заказов
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
from fastapi.responses import FileResponse

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import cards



app = FastAPI(title="very beautiful site")

# Подключение роутеров
app.include_router(cards.router)

# Такс что ещё нужно:
# Функционал для админки, добавить удалить изменить товар
# Добавить изображения для товара
# Сделать функционал блога
# Сделать функционал заказов
# БД: https://drawsql.app/teams/artyomtsiganov/diagrams/shop-datebase


app.mount("", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/")
def read_index():
    return FileResponse('../frontend/index.html')

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


app.mount("", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/catalog")
def read_catalog():
    return FileResponse('../frontend/catalog.html')

app.mount("", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/blog")
def read_blog():
    return FileResponse('../frontend/blog.html')

app.mount("", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/")
def read_index():
    return FileResponse('../frontend/index.html')
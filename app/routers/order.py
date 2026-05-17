from fastapi import APIRouter

router = APIRouter(
    prefix="/order",
    tags=["Orders"]
)

@router.get("/")
def get_orders() -> list[dict]:
    return [{"username": "Rick"}, {"username": "Morty"}]

# status: pending, details_provided, paid, shipping, delivered, closed
@router.post("/")
def create_order():
    # создание заказов
    raise NotImplementedError()
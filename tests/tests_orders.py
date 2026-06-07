import uuid

import pytest

async def create_category(client):
    response = await client.post(
        "/cards/category",
        json=[
            {
                "name": "Phones"
            }
        ]
    )

    assert response.status_code == 201


async def create_card(client):
    response = await client.post(
        "/cards",
        json=[
            {
                "name": "iPhone 15",
                "short_name": "iphone",
                "price": 1000,
                "category_id": 1,
                "count": 10,
                "description": "phone",
                "image_url": "iphone.jpg"
            }
        ]
    )

    assert response.status_code == 201


async def prepare_card(client):
    await create_category(client)
    await create_card(client)


async def test_get_orders_empty(client):

    response = await client.get("/orders/")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 0



async def test_get_order_items_empty(client):

    response = await client.get("/orders/items")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 0



async def test_create_order_success(client):

    await prepare_card(client)

    response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 2
            }
        ]
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "reserved"
    assert "public_id" in data



async def test_create_order_invalid_card(client):

    response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 999,
                "count": 1
            }
        ]
    )

    assert response.status_code == 400

    data = response.json()

    assert "не существует" in data["detail"]



async def test_create_order_not_enough_products(client):

    await prepare_card(client)

    response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 999
            }
        ]
    )

    assert response.status_code == 400

    data = response.json()

    assert "Недостаточно товара" in data["detail"]



async def test_product_count_reduction(client):

    await prepare_card(client)

    await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 3
            }
        ]
    )

    response = await client.get("/cards")

    cards = response.json()

    assert cards[0]["count"] == 7



async def test_checkout_order_success(client):

    await prepare_card(client)

    create_response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 1
            }
        ]
    )

    public_id = create_response.json()["public_id"]
    assert "order_id" not in create_response.json()
    response = await client.put(
        f"/orders/{public_id}/checkout",
        json={
            "name": "Alex",
            "email": "alex@test.com",
            "phone_number": "+123456789",

            "order_type": "pickup",

            "postal_code": "12345",
            "address": "Test street",
            "comment": "Test comment"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "completed"
    assert data["name"] == "Alex"
    assert data["email"] == "alex@test.com"



async def test_checkout_invalid_order(client):

    response = await client.put(
        f"/orders/{uuid.uuid4()}/checkout",
        json={
            "name": "Alex",
            "email": "alex@test.com",
            "phone_number": "+123456789",

            "order_type": "pickup",

            "postal_code": "12345",
            "address": "Test street",
            "comment": "Test comment"
        }
    )

    assert response.status_code == 404

    data = response.json()

    assert "не найден" in data["detail"]



async def test_checkout_completed_order(client):

    await prepare_card(client)

    create_response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 1
            }
        ]
    )

    public_id = create_response.json()["public_id"]

    checkout_payload = {
        "name": "Alex",
        "email": "alex@test.com",
        "phone_number": "+123456789",

        "order_type": "pickup",

        "postal_code": "12345",
        "address": "Test street",
        "comment": "Test comment"
    }

    first_checkout = await client.put(
        f"/orders/{public_id}/checkout",
        json=checkout_payload
    )

    assert first_checkout.status_code == 200

    second_checkout = await client.put(
        f"/orders/{public_id}/checkout",
        json=checkout_payload
    )

    assert second_checkout.status_code == 400

    data = second_checkout.json()

    assert "не найден" in data["detail"]



async def test_get_order_items_after_creation(client):

    await prepare_card(client)

    await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 2
            }
        ]
    )

    response = await client.get("/orders/items")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1

    item = data[0]

    assert item["card_id"] == 1
    assert item["count"] == 2
    assert float(item["price"]) == 1000.0


async def test_change_order_status(client):

    await prepare_card(client)

    # создаём заказ
    create_response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 1
            }
        ]
    )

    assert create_response.status_code == 200

    public_id = create_response.json()["public_id"]

    # меняем статус
    response = await client.put(
        f"/orders/{public_id}/change",
        params={
            "new_status": "completed"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["public_id"] == public_id
    assert data["status"] == "completed"



async def test_change_order_status_multiple_times(client):

    await prepare_card(client)

    # создаём заказ
    create_response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 1
            }
        ]
    )

    public_id = create_response.json()["public_id"]

    # RESERVED -> COMPLETED
    response1 = await client.put(
        f"/orders/{public_id}/change",
        params={
            "new_status": "completed"
        }
    )

    assert response1.status_code == 200

    assert response1.json()["status"] == "completed"

    # COMPLETED -> SHIPPING
    response2 = await client.put(
        f"/orders/{public_id}/change",
        params={
            "new_status": "shipping"
        }
    )

    assert response2.status_code == 200

    assert response2.json()["status"] == "shipping"

    # SHIPPING -> DELIVERED
    response3 = await client.put(
        f"/orders/{public_id}/change",
        params={
            "new_status": "delivered"
        }
    )

    assert response3.status_code == 200

    assert response3.json()["status"] == "delivered"


async def test_change_order_status_invalid_enum(client):

    await prepare_card(client)

    create_response = await client.post(
        "/orders/",
        json=[
            {
                "card_id": 1,
                "count": 1
            }
        ]
    )

    public_id = create_response.json()["public_id"]

    response = await client.put(
        f"/orders/{public_id}/change",
        params={
            "new_status": "some_weird_status"
        }
    )

    # FastAPI validation error
    assert response.status_code == 422


async def test_change_order_status_invalid_order(client):

    response = await client.put(
        f"/orders/{uuid.uuid4()}/change",
        params={
            "new_status": "completed"
        }
    )

    assert response.status_code == 404

    data = response.json()

    assert "не найден" in data["detail"]
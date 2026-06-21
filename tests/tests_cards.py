import pytest

async def test_add_category(client):

    response = await client.post(
        "/cards/category",
        json=[
            {
                "name": "Phones"
            }
        ]
    )

    assert response.status_code == 201

    data = response.json()

    assert data["status"] == "success"
    assert data["added_count"] == 1

async def test_get_categories(client):

    await client.post(
        "/cards/category",
        json=[
            {
                "name": "Laptops"
            }
        ]
    )

    response = await client.get("/cards/category")

    assert response.status_code == 200

    data = response.json()

    assert len(data) > 0
    assert data[-1]["name"] == "Laptops"

async def test_add_cards(client):

    # сначала создаём категорию
    await client.post(
        "/cards/category",
        json=[
            {
                "name": "Phones"
            }
        ]
    )

    response = await client.post(
        "/cards",
        json=[
            {
                "name": "iPhone 15",
                "category_id": 1,
                "short_name": "iphone",
                "price": 1000,
                "count": 5,
                "description": "Apple phone",
                "image_url": "test.jpg"
            }
        ]
    )

    assert response.status_code == 201

    data = response.json()

    assert data["status"] == "success"

async def test_get_cards_with_filter(client):
    await client.post(
        "/cards/category",
        json=[
            {
                "name": "Phones"
            }
        ]
    )

    response = await client.post(
        "/cards",
        json=[
            {
                "name": "iPhone 15",
                "category_id": 1,
                "short_name": "iphone",
                "price": 1000,
                "count": 5,
                "description": "Apple phone",
                "image_url": "test.jpg"
            }
        ]
    )

    response = await client.get(
        "/cards",
        params={
            "name_filter": "iphone"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) > 0


async def test_get_cards_with_cyrillic_case_insensitive_filter(client):
    await client.post(
        "/cards/category",
        json=[
            {
                "name": "Цветы"
            }
        ]
    )

    await client.post(
        "/cards",
        json=[
            {
                "name": "Дельфиниум синий",
                "category_id": 1,
                "short_name": "delphinium",
                "price": 650,
                "count": 5,
                "description": "Синий дельфиниум",
                "image_url": "test.jpg"
            }
        ]
    )

    response = await client.get(
        "/cards",
        params={
            "name_filter": "дельфиниум"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Дельфиниум синий"

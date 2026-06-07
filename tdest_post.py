
#оформить как тесты
import requests

cards = [
  {
    "card_id": 13,
    "name": "Mystic Mage",
    "short_name": "MM",
    "price": "45.50",
    "count": 25,
    "description": "Master of arcane elements",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1

  },
  {
    "card_id": 14,
    "name": "Shadow Assassin",
    "short_name": "SA",
    "price": "30.00",
    "count": 15,
    "description": "Strikes from the darkness",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1

  },
  {
    "card_id": 15,
    "name": "Forest Healer",
    "price": "12.99",
    "count": 50,
    "description": "Restores health to allies",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1
  },
  {
    "card_id": 16,
    "name": "Iron Golem",
    "short_name": "IG",
    "price": "20.00",
    "count": 40,
    "description": "High defense, low speed",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1
  },
  {
    "card_id": 17,
    "name": "Phoenix Reborn",
    "short_name": "PR",
    "price": "150.00",
    "count": 5,
    "description": "Rises from the ashes",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 18,
    "name": "Goblin Thief",
    "price": "2.50",
    "count": 200,
    "description": "Steals gold every turn",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 19,
    "name": "Thunder Griffin",
    "short_name": "TG",
    "price": "75.00",
    "count": 12,
    "description": "Deals electric damage",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 20,
    "name": "Cursed Totem",
    "price": "18.75",
    "count": 30,
    "description": "Debuffs all nearby enemies",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1
  }
]
response = requests.post('http://127.0.0.1:8000/cards', json=cards)
print(response.status_code)
print(response.json())

categories = [
  {
    "category_id": 1,
    "name": "flowers"
  },
  {
    "category_id": 2,
    "name": "books"
  },
  {
    "category_id": 3,
    "name": "dirt"
  }
]

response = requests.post('http://127.0.0.1:8000/cards/category', json=categories)
print(response.status_code)
print(response.json())

import requests

BASE_URL = "http://127.0.0.1:8000"

cards = [
    {
        "name": "MacBook Pro 16 M3",
        "short_name": "MBP16",
        "price": 249999.99,
        "category_id": 1,
        "count": 5,
        "description": "Мощный ноутбук Apple для разработки и монтажа видео",
        "image_url": "https://example.com/images/macbook-pro.jpg"
    },
    {
        "name": "iPhone 15 Pro",
        "short_name": "IPH15PRO",
        "price": 129999.50,
        "category_id": 2,
        "count": 12,
        "description": "Флагманский смартфон Apple с титановым корпусом",
        "image_url": "https://example.com/images/iphone15pro.jpg"
    },
    {
        "name": "Samsung Galaxy S25",
        "short_name": "SGS25",
        "price": 99999.99,
        "category_id": 2,
        "count": 8,
        "description": "Android смартфон с AMOLED дисплеем и мощной камерой",
        "image_url": "https://example.com/images/galaxy-s25.jpg"
    },
    {
        "name": "ASUS ROG Strix G18",
        "short_name": "ROGG18",
        "price": 189999.00,
        "category_id": 1,
        "count": 3,
        "description": "Игровой ноутбук с RTX 4090 и экраном 240Hz",
        "image_url": "https://example.com/images/rog-g18.jpg"
    },
    {
        "name": "AirPods Pro 2",
        "short_name": "AIRPODS2",
        "price": 24999.90,
        "category_id": 3,
        "count": 20,
        "description": "Беспроводные наушники с активным шумоподавлением",
        "image_url": "https://example.com/images/airpods-pro2.jpg"
    }
]

response = requests.post(
    f"{BASE_URL}/cards",
    json=cards,
    headers={
        "Content-Type": "application/json"
    }
)

print("STATUS:", response.status_code)

try:
    print("RESPONSE:", response.json())
except Exception:
    print("TEXT:", response.text)
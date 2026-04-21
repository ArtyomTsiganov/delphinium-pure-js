
#оформить как тесты
import requests

cards = [
  {
    "card_id": 3,
    "name": "Mystic Mage",
    "short_name": "MM",
    "price": "45.50",
    "count": 25,
    "description": "Master of arcane elements",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1

  },
  {
    "card_id": 4,
    "name": "Shadow Assassin",
    "short_name": "SA",
    "price": "30.00",
    "count": 15,
    "description": "Strikes from the darkness",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1

  },
  {
    "card_id": 5,
    "name": "Forest Healer",
    "price": "12.99",
    "count": 50,
    "description": "Restores health to allies",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1
  },
  {
    "card_id": 6,
    "name": "Iron Golem",
    "short_name": "IG",
    "price": "20.00",
    "count": 40,
    "description": "High defense, low speed",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 1
  },
  {
    "card_id": 7,
    "name": "Phoenix Reborn",
    "short_name": "PR",
    "price": "150.00",
    "count": 5,
    "description": "Rises from the ashes",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 8,
    "name": "Goblin Thief",
    "price": "2.50",
    "count": 200,
    "description": "Steals gold every turn",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 9,
    "name": "Thunder Griffin",
    "short_name": "TG",
    "price": "75.00",
    "count": 12,
    "description": "Deals electric damage",
    "image_url" : "assets/product-card-img-demo.png",
    "category_id": 2
  },
  {
    "card_id": 10,
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

# response = requests.post('http://127.0.0.1:8000/cards/category', json=categories)
print(response.status_code)
print(response.json())
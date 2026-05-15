"""
Sample Inventory Data Generator
Generates product data similar to saucedemo.com inventory
"""

SAMPLE_INVENTORY_DATA = [
    {
        "id": 1,
        "name": "Sauce Labs Backpack",
        "description": "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
        "price": 29.99,
        "image": "https://www.saucedemo.com/static/media/sl-400.16f990a7.jpg",
        "stock": 50,
        "category": "accessories"
    },
    {
        "id": 2,
        "name": "Sauce Labs Bike Light",
        "description": "A red light isn't the desired state in testing but it will help you keep your ride safe at night 100% of the time.",
        "price": 9.99,
        "image": "https://www.saucedemo.com/static/media/sl-051.857fec83.jpg",
        "stock": 75,
        "category": "accessories"
    },
    {
        "id": 3,
        "name": "Sauce Labs Bolt T-Shirt",
        "description": "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.",
        "price": 15.99,
        "image": "https://www.saucedemo.com/static/media/sl-002.2b9e7574.jpg",
        "stock": 100,
        "category": "clothing"
    },
    {
        "id": 4,
        "name": "Sauce Labs Fleece Jacket",
        "description": "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
        "price": 49.99,
        "image": "https://www.saucedemo.com/static/media/sl-041.8c9601f9.jpg",
        "stock": 30,
        "category": "clothing"
    },
    {
        "id": 5,
        "name": "Sauce Labs Onesie",
        "description": "Rib snap infant onesie. This one is made from 100% organic cotton and is available in heather gray, neon yellow, green or aqua with a screen printed logo.",
        "price": 7.99,
        "image": "https://www.saucedemo.com/static/media/sl-011.c4ffdab5.jpg",
        "stock": 120,
        "category": "clothing"
    },
    {
        "id": 6,
        "name": "Test.allTheThings() T-Shirt",
        "description": "This classic Sauce Labs t-shirt is 100% ringspun combed cotton. The logo is screen printed with love in Oakland, CA.",
        "price": 15.99,
        "image": "https://www.saucedemo.com/static/media/sl-001.62e3cf1a.jpg",
        "stock": 200,
        "category": "clothing"
    },
    {
        "id": 7,
        "name": "Sauce Labs Water Bottle",
        "description": "Keep yourself hydrated with this 20oz Sauce Labs water bottle. Made from BPA-free Tritan plastic, it's dishwasher safe and leak-proof.",
        "price": 11.99,
        "image": "https://www.saucedemo.com/static/media/sl-052.2f01d267.jpg",
        "stock": 60,
        "category": "accessories"
    },
    {
        "id": 8,
        "name": "Sauce Labs Laptop Bag",
        "description": "Protect your laptop with style with this padded laptop bag. Features multiple compartments and adjustable shoulder strap.",
        "price": 39.99,
        "image": "https://www.saucedemo.com/static/media/sl-401.9bda63cd.jpg",
        "stock": 25,
        "category": "accessories"
    }
]

def get_inventory():
    """Get all inventory items"""
    return SAMPLE_INVENTORY_DATA

def get_item_by_id(item_id):
    """Get a specific item by ID"""
    for item in SAMPLE_INVENTORY_DATA:
        if item["id"] == item_id:
            return item
    return None

def filter_by_category(category):
    """Filter items by category"""
    return [item for item in SAMPLE_INVENTORY_DATA if item["category"] == category]

def get_low_stock_items(threshold=30):
    """Get items with low stock"""
    return [item for item in SAMPLE_INVENTORY_DATA if item["stock"] < threshold]

if __name__ == "__main__":
    print("Sample Inventory Data")
    print("=" * 50)
    for item in SAMPLE_INVENTORY_DATA:
        print(f"{item['name']}: ${item['price']} (Stock: {item['stock']})")

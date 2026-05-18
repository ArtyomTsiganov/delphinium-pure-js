const loadedCart = localStorage.getItem("cart");
let cart = loadedCart ? new Map(JSON.parse(loadedCart)) : new Map();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify([...cart.entries()]));
}

export function addToCartOne(goodsItemId) {
    if (!cart.has(goodsItemId))
        cart.set(goodsItemId, 1);
    cart.set(goodsItemId, cart.get(goodsItemId) + 1);
    saveCart();
}

export function removeFromCartOne(goodsItemId) {
    if (cart.has(goodsItemId)) {
        const countItem = cart.get(goodsItemId);
        if (countItem === 1)
            cart.delete(goodsItemId);
        else
            cart.set(goodsItemId, countItem - 1);
        saveCart();
    }
}

export function removeFromCartAll(goodsItemId) {
    if (cart.has(goodsItemId)) {
        cart.delete(goodsItemId);
        saveCart();
    }
}
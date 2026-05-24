const loadedCart = localStorage.getItem("cart");
const cart = loadedCart ? new Map(JSON.parse(loadedCart)) : new Map();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify([...cart.entries()]));
}

export function getCartItemCount(goodsItemId) {
    return cart.get(goodsItemId);
}

export function setCartItemCount(goodsItemId, count) {
    cart.set(goodsItemId, count);
}

export function getCartItemsIds() {
    return cart.keys().toArray();
}

export function addToCartOne(goodsItemId) {
    if (!cart.has(goodsItemId))
        cart.set(goodsItemId, 0);
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
    console.log(cart, goodsItemId);
    if (cart.delete(goodsItemId)) {
        saveCart();
    }
}
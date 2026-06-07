import {api} from "./api.js";

const loadedCart = localStorage.getItem("cart");
const cart = loadedCart ? new Map(JSON.parse(loadedCart)) : new Map();
cart.orderId = undefined;

window.addEventListener('pagehide', () => {
    
});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify([...cart.entries()]));
}

export function getCartItemCount(goodsItemId) {
    return cart.get(goodsItemId);
}

export function setCartItemCount(goodsItemId, count) {
    cart.set(goodsItemId, count);
    saveCart();
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
    if (cart.delete(goodsItemId)) {
        saveCart();
    }
}

export function clearCart() {
    cart.clear();
    saveCart();
}

export async function validateCartOrder() {
    return api.post(
        "/orders/",
        cart.entries().map(([card_id, count]) => ({card_id: card_id, count: count})).toArray()
    ).then(response => {
        cart.orderId = response.order_id;
        return true;
    }).catch(error => {
        if (error.message === '422') {
            return false;
        }
        throw error;
    });
}
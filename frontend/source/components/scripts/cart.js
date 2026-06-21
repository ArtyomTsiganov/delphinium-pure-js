import {api} from "./api.js";
import {getUserData} from "./userDataManager.js";

const loadedCart = localStorage.getItem("cart");
const cart = loadedCart ? new Map(JSON.parse(loadedCart)) : new Map();
cart.orderId = undefined;
clearOrderId();

window.addEventListener('pagehide', async () => {
    await revokeOrderId();
});

function saveCart() {
    localStorage.setItem("cart", JSON.stringify([...cart.entries()]));
}

function setOrderId(id) {
    cart.orderId = id;
    localStorage.setItem("cart.orderId", id);
}

function clearOrderId() {
    cart.orderId = undefined;
    localStorage.removeItem("cart.orderId");
}

export async function revokeOrderId() {
    await api.delete(`/orders/${cart.orderId}`);
    clearOrderId();
}

export function getCartItemCount(goodsItemId) {
    return parseInt(cart.get(goodsItemId), 10) || 0;
}

export function setCartItemCount(goodsItemId, count) {
    const normalizedCount = parseInt(count, 10) || 0;
    if (normalizedCount > 0)
        cart.set(goodsItemId, normalizedCount);
    else
        cart.delete(goodsItemId);
    saveCart();
}

export function getCartItemsIds() {
    return cart.keys().toArray();
}

export function addToCartOne(goodsItemId) {
    if (!cart.has(goodsItemId))
        cart.set(goodsItemId, 0);
    cart.set(goodsItemId, (parseInt(cart.get(goodsItemId), 10) || 0) + 1);
    saveCart();
}

export function removeFromCartOne(goodsItemId) {
    if (cart.has(goodsItemId)) {
        const countItem = parseInt(cart.get(goodsItemId), 10) || 0;
        if (countItem <= 1)
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
        setOrderId(response.public_id);
        return true;
    }).catch(error => {
        if (error.message === '400') {
            return false;
        }
        throw error;
    });
}

export async function submitCartOrder(orderType) {
    return api.put(
        `/orders/${cart.orderId}/checkout`,
        {
            "name": getUserData('fio'),
            "email": getUserData('email'),
            "phone_number": getUserData('phone'),
            "order_type": orderType,
            "postal_code": getUserData('zipcode'),
            "address": getUserData('address'),
            "comment": getUserData('comment'),
        }
    ).then(response => {
        return response.public_id;
    }).catch(error => {
        if (error.message === '400') {
            return false;
        }
        throw error;
    });
}

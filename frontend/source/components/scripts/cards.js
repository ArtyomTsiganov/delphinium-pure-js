import { api, parseHTML, toMoney } from "./api.js";
import {
    addToCartOne,
    getCartItemCount,
    removeFromCartAll,
    removeFromCartOne,
    setCartItemCount
} from "./cart.js";
import { navigateTo } from "./navigation.js";
import {showToastAddToCart} from "./toastAlert.js";

const cardTemplate = parseHTML(`
    <div class="product-card">
        <img src="" alt="">
        <a>
            <p class="product-card-title"></p>
        </a>
        <div class="product-card-bottom">
            <p class="product-card-price"></p>
            <button class="product-card-cart-btn">В Корзину</button>
            <div class="product-card-quantity quantity-control">
                <div class="quantity-picker">
                    <button class="qty-btn qty-btn-add">+</button>
                    <input class="qty-input" type="text" inputmode="numeric" placeholder="count">
                    <button class="qty-btn qty-btn-rem">-</button>
                </div>
            </div>
        </div>
    </div>
`);

function normalizeCount(value) {
    return parseInt(String(value).replace(/[^0-9]/g, '').replace(/^0+/, ''), 10) || 0;
}

function setupProductCardCartControls(clone, card) {
    const cartButton = clone.querySelector('.product-card-cart-btn');
    const quantityControl = clone.querySelector('.product-card-quantity');
    const countInput = clone.querySelector('.qty-input');

    function updateCardQuantity() {
        const count = getCartItemCount(card.card_id) || 0;
        countInput.value = count;
        cartButton.hidden = count > 0;
        quantityControl.hidden = count === 0;
    }

    cartButton.addEventListener('click', e => {
        e.preventDefault();
        addToCartOne(card.card_id);
        showToastAddToCart(card.short_name ?? card.name);
        updateCardQuantity();
    });

    clone.querySelector('.qty-btn-add').addEventListener('click', e => {
        e.preventDefault();
        addToCartOne(card.card_id);
        updateCardQuantity();
    });

    clone.querySelector('.qty-btn-rem').addEventListener('click', e => {
        e.preventDefault();
        removeFromCartOne(card.card_id);
        updateCardQuantity();
    });

    countInput.addEventListener('input', e => {
        const count = normalizeCount(e.target.value);
        if (count > 0) {
            setCartItemCount(card.card_id, count);
        } else {
            removeFromCartAll(card.card_id);
        }
        updateCardQuantity();
    });

    updateCardQuantity();
}

export async function loadCards(container, params) {
    container.querySelectorAll('.product-card, .message-not-found').forEach(card => card.remove());
    try {
        const cards = await api.get('/cards', params);
        if (cards?.length === 0)
            container.appendChild(parseHTML(`
            <p class="message-not-found">Товары отсутствуют</p>
            `));
        cards.forEach(card => {
            const clone = cardTemplate.cloneNode(true);
            clone.id = card.card_id;
            clone.querySelector('a').href = card.href;
            if (!card.image) {
                clone.querySelector('img').setAttribute('src', "/assets/product-card-img-demo.png");
            } else {
                clone.querySelector('img').setAttribute('src', card.image);
            }
            clone.querySelector('img').setAttribute('alt', '0');
            clone.querySelector('.product-card-title').textContent = card.name;
            clone.querySelector('.product-card-price').textContent = toMoney(card.price);
            setupProductCardCartControls(clone, card);
            clone.querySelector('a').addEventListener('click', e => {
                e.preventDefault();
                navigateTo(`/product`, card);        //?id=${card.id}`, card);
            });
            container.appendChild(clone);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

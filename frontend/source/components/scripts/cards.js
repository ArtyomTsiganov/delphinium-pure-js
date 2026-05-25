import { api, parseHTML, toMoney } from "./api.js";
import { addToCartOne } from "./cart.js";
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
            <button>В Корзину</button>
        </div>
    </div>
`);

export async function loadCards(container, params) {
    container.querySelectorAll('.product-card').forEach(card => card.remove());
    try {
        const cards = await api.get('/cards', params);
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
            clone.querySelector('button').addEventListener('click', e => {
                e.preventDefault();
                addToCartOne(card.card_id);
                showToastAddToCart(card.short_name ?? card.name);
            });
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
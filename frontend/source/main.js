import { headerTemplate } from './components/header/header.js';
document.body.insertAdjacentHTML('afterbegin', headerTemplate());

// for (const rollingArea of document.getElementsByClassName("rolling-list")) {
//     rollingArea.addEventListener("mousewheel", (e) => {
//         if (e.deltaY !== 0) {
//             e.preventDefault();
//             rollingArea.scrollBy(e.deltaY, 0);
//         }
//     });
// }

const api = {
    async get(endpoint, params = {}) {
        const url = new URL(`http://127.0.0.1:8000${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        return response.json();
    }
};
async function loadCards(elementId, count=1, order_by="id") {
    const container = document.querySelector(elementId);
    const cardTemplate = document.querySelector('#product-card-template');
    try {
        const cards = await api.get('/cards', { count: count, order_by: order_by });
        cards.forEach(card => {
            const clone = cardTemplate.content.cloneNode(true);
            clone.id = card.id;
            clone.querySelector('a').href = card.href;
            clone.querySelector('img').setAttribute('src', card.image);
            clone.querySelector('img').setAttribute('alt', '📷');
            clone.querySelector('.product-card-title').textContent(card.name);
            clone.querySelector('.product-card-price').textContent(card.price);
            clone.querySelector('button').setAttribute();
            container.appendChild(clone);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function loadBlock() {
    await loadCards('#recommended-rolling', 7, 'random');
    await loadCards('#books-rolling', 3, 'random');
}

document.addEventListener('DOMContentLoaded', loadBlock);
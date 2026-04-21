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
async function loadCards(elementId, params) {
    const container = document.querySelector(elementId);
    const cardTemplate = document.querySelector('#product-card-template');
    container.querySelectorAll('.product-card').forEach(card => card.remove());
    try {
        const cards = await api.get('/cards', params);
        cards.forEach(card => {
            const clone = cardTemplate.content.cloneNode(true);
            clone.id = card.id;
            clone.querySelector('a').href = card.href;
            if (!card.image) {
                clone.querySelector('img').setAttribute('src', "assets/product-card-img-demo.png");
            } else {
                clone.querySelector('img').setAttribute('src', card.image);
            }
            clone.querySelector('img').setAttribute('alt', '0');
            clone.querySelector('.product-card-title').textContent = card.name;
            clone.querySelector('.product-card-price').textContent = card.price;
            clone.querySelector('button');
            container.appendChild(clone);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export async function loadBlock() {
    await loadCards('#recommended-rolling', { count: 9, orderBy: 'random'});
    await loadCards('#books-rolling', { count: 3, orderBy: 'random'});
}

export async function loadBlockCatalog() {
    await loadCards('#recommended-products', { count: 1000, orderBy: 'name' });
}

export async function loadSearch() {
    const searchInput = document.getElementById('searcher-line');
    loadCards('#recommended-products', { count: 1000, orderBy: 'name', name_filter:  searchInput.value});
}
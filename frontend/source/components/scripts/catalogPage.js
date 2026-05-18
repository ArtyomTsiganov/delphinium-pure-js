import { loadCards } from "./cards.js";
import { parseHTML } from "./api.js";
import { renderMainWith } from "./mainRender.js";

export async function loadBlockCatalog() {
    await loadCards('#flowers-block', { count: 1000, orderBy: 'name', category_filter: 'flowers' });
    await loadCards('#books-block', { count: 1000, orderBy: 'name', category_filter: 'books' });
}

export async function loadSearch() {
    const searchInput = document.getElementById('searcher-line');
    await loadCards('#flowers-block', { count: 1000, orderBy: 'name', name_filter:  searchInput.value});
    await loadCards('#books-block', { count: 1000, orderBy: 'name', name_filter:  searchInput.value});
}

export async function renderCatalogPage() {
    renderMainWith(catalogPage);
    await loadBlockCatalog();
}

const catalogPage = parseHTML(`
    <div class="searcher-zone">
        <input id="searcher-line" class="searcher-line" placeholder="Search flowers...">
        <button id="searcher-btn" class="searcher-btn">🔍</button>
    </div>
    
    <div class="catalog-zone">
        <div class="catalog-header">
            <p>Цветы</p>
        </div>
        <div id="flowers-block" class="catalog-list">
            <!-- сюда рекомендации вставятся автоматом -->
        </div>
    
        <div class="catalog-header">
            <p>Книги</p>
        </div>
        <div id="books-block" class="catalog-list">
            <!-- Сюда книжки вставяться автоматом-->
        </div>
    </div>
`);

catalogPage.querySelector('#searcher-btn').addEventListener('click', async event => {
    await loadSearch();
});

catalogPage.querySelector("#searcher-line").addEventListener("keydown", async event => {
    if (event.key === "Enter") {
        await loadSearch();
    }
});
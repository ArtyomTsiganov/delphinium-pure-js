import { loadCards } from "./cards.js";
import { parseHTML } from "./api.js";
import { renderMainWith } from "./mainRender.js";
import { navigateTo } from "./navigation.js";
import { makeSearcher } from "./searcher.js";


const catalogPage = parseHTML(`
<div class="catalogPage">
    <div class="searcher-zone"></div>
    
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
</div>
`);

const { searcherBtn, searcherLine } = makeSearcher();
const searchingZone = catalogPage.querySelector(".searcher-zone");
searchingZone.appendChild(searcherLine);
searchingZone.appendChild(searcherBtn);

const flowersCatalog = catalogPage.querySelector('#flowers-block');
const booksCatalog = catalogPage.querySelector('#books-block');

async function loadBlockCatalog() {
    const state = history.state;
    if (state?.name_filter) {
        searcherLine.value = state?.name_filter;
        await loadCards(flowersCatalog, { count: 1000, orderBy: 'name', category_filter: 'flowers', name_filter:  state.name_filter});
        await loadCards(booksCatalog, { count: 1000, orderBy: 'name', category_filter: 'books' , name_filter:  state.name_filter});
    } else {
        await loadCards(flowersCatalog, { count: 1000, orderBy: 'name', category_filter: 'flowers' });
        await loadCards(booksCatalog, { count: 1000, orderBy: 'name', category_filter: 'books' });
    }
}

export async function renderCatalogPage() {
    renderMainWith(catalogPage);
    await loadBlockCatalog();
}
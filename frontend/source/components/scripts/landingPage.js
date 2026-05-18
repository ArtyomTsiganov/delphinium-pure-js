import { loadCards } from "./cards.js";
import { parseHTML } from "./api.js";
import { renderMainWith } from "./mainRender.js";
import { navigateTo } from "./navigation.js";
import { makeSearcher } from "./searcher.js";


const landingPage = parseHTML(`
<div class="landingPage">
    <section class="hero">
        <div class="container">
            <div class="hero-inner">

                <div class="hero-text">
                    <h1 class="hero-title">Цветочная ферма "Дельфиниум.рф"</h1>
                    <p class="hero-description">
                        Наша цветочная ферма занимается разведением дельфиниумов с 2013 года.
                        Мы предлагаем семена, выращенные в условиях Уральского климата и показавшие достойные результаты.
                    </p>
                    <div class="hero-controls">
                        <a href="/catalog" class="btn-primary">К каталогу</a>
                        <a href="#" class="btn-secondary">
                            <span>К статьям</span>
                            <span class="arrow">→</span>
                        </a>
                    </div>
                </div>

                <div class="hero-visual">
                    <div class="gallery-grid">
                        <div class="gallery-column">
                            <div class="card card-sm">
                                <span class="badge">Новое</span>
                                <img src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=500&auto=format&fit=crop" alt="Delphinium">
                            </div>
                            <div class="card card-sm">
                                <span class="badge">Популярное</span>
                                <img src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=500&auto=format&fit=crop" alt="Delphinium">
                                <div class="card-overlay-text">ТАКИЕ РАЗНЫЕ ДЕЛЬФИНИУМЫ!</div>
                            </div>
                        </div>

                        <div class="gallery-column">
                            <div class="card card-lg">
                                <span class="badge">Избранные</span>
                                <img src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=500&auto=format&fit=crop" alt="Delphinium Cobalt Dreams">
                                <div class="card-content">
                                    <h3>Cobalt Dreams</h3>
                                    <p>Сеянец новозеландского гибрида 1-го поколения готовый к высадке в мае, цветение наступает в год посадки...</p>
                                    <a href="#" class="btn-card">К карточке товара</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dots-decoration"></div>
                </div>

            </div>
        </div>
    </section>

    <div class="searcher-zone"></div>

    <div class="rolling-zone">
        <div class="rolling-header">
            <p>Рекомендуемые товары</p>
            <button class="rolling-view-all-btn">посмотреть все</button>
        </div>

        <button class="rolling-btn rolling-left-btn">←</button>
        <button class="rolling-btn rolling-right-btn">→</button>
        
        <div id="recommended-rolling" class="rolling-list">
            <!-- сюда рекомендации вставятся автоматом -->
        </div>
    </div>

    <div class="rolling-zone">
        <div class="rolling-header">
            <p>Наши книги</p>
            <button class="rolling-view-all-btn">посмотреть все</button>
        </div>

        <button class="rolling-btn rolling-left-btn">←</button>
        <button class="rolling-btn rolling-right-btn">→</button>
        
        <div id="books-rolling" class="rolling-list">
            <!-- Сюда книжки вставяться автоматом-->
        </div>
    </div>
</div>
`);

for (const roll of landingPage.querySelectorAll(".rolling-zone")) {
    const rollingList = roll.querySelector(".rolling-list");
    roll.querySelector(".rolling-left-btn").addEventListener("click", e => {
        rollingList.scrollBy({left: -580, behavior: "smooth"});
    });
    roll.querySelector(".rolling-right-btn").addEventListener("click", e => {
        rollingList.scrollBy({left: 580, behavior: "smooth"});
    })
}
const { searcherBtn, searcherLine } = makeSearcher();
const searchingZone = landingPage.querySelector(".searcher-zone");
searchingZone.appendChild(searcherLine);
searchingZone.appendChild(searcherBtn);

const recommendedCatalog = landingPage.querySelector('#recommended-rolling');
const booksCatalog = landingPage.querySelector('#books-rolling');

async function renderCardsBlocks() {
    await loadCards(recommendedCatalog, { count: 9, orderBy: 'random', category_filter: 'flowers'});
    await loadCards(booksCatalog, { count: 3, orderBy: 'random', category_filter: 'books'});
}

export async function renderLandingPage() {
    renderMainWith(landingPage);
    console.log(landingPage);
    await renderCardsBlocks();
}
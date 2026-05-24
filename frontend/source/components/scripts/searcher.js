import { navigateTo } from "./navigation.js";
import { parseHTML } from "./api.js";


export function makeSearcher() {
    const searcherLine = parseHTML(`
        <input id="searcher-line" class="searcher-line" placeholder="Search flowers...">
    `);

    const searcherBtn = parseHTML(`
        <button id="searcher-btn" class="searcher-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="25" y1="25" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
    `);

    function goSearchCatalog() {
        navigateTo("/catalog", {name_filter: searcherLine.value});
    }

    searcherLine.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            goSearchCatalog();
        }
    });

    searcherBtn.addEventListener("click", goSearchCatalog);

    return { searcherLine, searcherBtn };
}
import { navigateTo } from "./navigation.js";
import { parseHTML } from "./api.js";


export function makeSearcher() {
    const searcherLine = parseHTML(`
        <input id="searcher-line" class="searcher-line" placeholder="Search flowers...">
    `);

    const searcherBtn = parseHTML(`
        <button id="searcher-btn" class="searcher-btn">🔍</button>
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
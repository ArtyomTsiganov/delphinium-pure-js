import {parseHTML} from "./api.js";

const mainLoadingBlock = parseHTML(`
<div class="loading-page">
    <div class="loading-circle"></div>
</div>
`);

const collector = document.querySelector("#collector");

export function renderMainLoading() {
    collector.replaceChildren(mainLoadingBlock);
}

export function renderMainWith(container) {
    collector.replaceChildren(container);
}
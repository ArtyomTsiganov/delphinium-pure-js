export function renderMainWith(container) {
    const collector = document.querySelector("#collector");
    collector.replaceChildren(container);
}
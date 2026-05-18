export function renderMainWith(node) {
    const collector = document.querySelector("#collector");
    // const newCollector = collector.cloneNode(false);
    // newCollector.appendChild(node);
    // collector.replaceWith(newCollector);
    collector.replaceChildren(node);
}
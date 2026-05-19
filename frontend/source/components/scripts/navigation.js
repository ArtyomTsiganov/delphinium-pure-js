import { renderMainWith } from "./mainRender.js";

let routes = {};

function render404() {
    const h404 = document.createElement('h1');
    h404.innerHTML = "404"
    renderMainWith(h404);
}

function router(url=null) {
    (routes[url || window.location.pathname] || render404)();
}

export function setRoutes(newRoutes) {
    routes = newRoutes;
    router();
}

export function navigateTo(url, state=null) {
    history.pushState(state, null, url);
    router(url);
}

window.addEventListener('popstate', e => {
    router(e.target.location.pathname);
});

// document.addEventListener('click', (e) => {
//     const link = e.target.closest('[data-link]');
//     if (link) {
//         // e.preventDefault();
//         const url = link.getAttribute('href');
//         navigateTo(url);
//     }
// });
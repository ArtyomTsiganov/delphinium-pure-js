import { renderMainWith } from "./mainRender.js";

let routes = {};

function render404() {
    const h404 = document.createElement('h1');
    h404.innerHTML = "404"
    renderMainWith(h404);
}

function routeTo(url=null) {
    (routes[url || window.location.pathname] || render404)();
}

export function setRoutes(newRoutes) {
    routes = newRoutes;
    routeTo(window.location.pathname);
}

export function navigateTo(url, state=null) {
    history.pushState(state, null, url);
    routeTo(url);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

export function navigateBack() {
    history.back();
}

window.addEventListener('popstate', e => {
    routeTo(e.target.location.pathname);
});

// document.addEventListener('click', (e) => {
//     const link = e.target.closest('[data-link]');
//     if (link) {
//         // e.preventDefault();
//         const url = link.getAttribute('href');
//         navigateTo(url);
//     }
// });
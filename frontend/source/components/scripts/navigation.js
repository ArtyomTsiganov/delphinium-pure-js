let routes = {};

function render404() {
}

function router() {
    (routes[window.location.pathname] || render404)();
}

export function setRoutes(newRoutes) {
    routes = newRoutes;
    router();
}

export function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

window.addEventListener('popstate', () => {
    router();
});

// document.addEventListener('click', (e) => {
//     const link = e.target.closest('[data-link]');
//     if (link) {
//         // e.preventDefault();
//         const url = link.getAttribute('href');
//         navigateTo(url);
//     }
// });
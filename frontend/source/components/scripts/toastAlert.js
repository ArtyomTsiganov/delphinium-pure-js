import {parseHTML} from "./api.js";


function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = parseHTML(`
            <div class="toast-container"><button class="toast-clear-all">✕</button></div>
        `);
        container.querySelector('.toast-clear-all').addEventListener('click', () => {
            const toasts = container.querySelectorAll('.toast-notification');
            toasts.forEach(t => t.classList.add('fade-out'));
            setTimeout(() => {
                container.remove();
            }, 300);
        });
        document.body.appendChild(container);
    }
    return container;
}

function showToast(innerBlock, extraClasses=[]) {
    const container = getToastContainer();
    const toast = parseHTML(`<div class="toast-notification"></div>`);
    extraClasses.forEach(c => toast.classList.add(c));
    toast.appendChild(innerBlock);
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');

        setTimeout(() => {
            toast.remove();

            if (container.children.length === 1) {
                container.remove();
            }
        }, 300);
    }, 2500);
}

export function showToastAddToCart(productName) {
    showToast(parseHTML(`<span>🌸 <strong>${productName}</strong> добавлен в корзину</span>`));
}

export function showToastSuccess(message) {
    showToast(parseHTML(`<span>${message}</span>`));
}

export function showToastAlert(message) {
    showToast(parseHTML(`<span>${message}</span>`), ['alert']);
}

export function showToastError(message) {
    showToast(parseHTML(`<span>${message}</span>`), ['error']);
}
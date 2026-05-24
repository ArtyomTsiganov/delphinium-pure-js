import {parseHTML} from "./api.js";

export function showToast(productName) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = parseHTML(`
            <div class="toast-container"></div>
        `);
        document.body.appendChild(container);
    }

    const toast = parseHTML(`
        <div class="toast-notification">
            <span>🌸</span><strong>${productName}</strong>добавлен в корзину
        </div>
    `);
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');

        toast.addEventListener('transitionend', () => {
            toast.remove();

            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 2500);
}
import {parseHTML} from "./api.js";
import {renderMainLoading, renderMainWith} from "./mainRender.js";


const ordersListItem = parseHTML(`
<div class="cart-item">
    <div class="cart-col col-order-code item-info">
        <a class="cart-item-title">123-456-789</a>
    </div>
    
    <div class="cart-col col-time">0:0:0</div>
    
    <div class="cart-col col-quantity quantity-control">67</div>
    
    <div class="cart-col col-total item-total-price">300000₽</div>
    
    <div class="cart-col col-delete">
        <button class="delete-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        </button>
    </div>
</div>
`);

const ordersListPage = parseHTML(`
<div class="cart-page" xmlns="http://www.w3.org/1999/html">
    <div class="searcher-zone">
        <input id="searcher-line" class="searcher-line" placeholder="Search flowers...">
        <button id="searcher-btn" class="searcher-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="25" y1="25" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
    </div>
    
    <div class="cart-table-header">
        <div class="col-order-code">Код заказа</div>
        <div class="col-time">Время заказа</div>
        <div class="col-quantity">Товаров</div>
        <div class="col-total">Стоимость</div>
        <div class="col-delete"></div>
    </div>

    <div class="cart-items-list"></div>

    <div class="step-actions right-align">
        <button class="next-step-btn action-btn">Продолжить</button>
    </div>
</div>
`);

async function loadOrdersList() {
    
}

export async function renderOrderListPage() {
    renderMainLoading();
    
    renderMainWith(ordersListPage);
}
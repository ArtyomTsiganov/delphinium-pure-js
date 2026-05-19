import { api, parseHTML} from "./api.js";
import { renderMainWith } from "./mainRender.js";
import { cart } from "./cart.js";


const cartListItem = parseHTML(`
<div class="cart-item">
    <div class="col-product item-info">
        <img src="flower.jpg" alt="Товар" class="cart-item-img">
        <span class="cart-item-title">Полное название товара название товара Полное название товара</span>
    </div>
    <div class="col-price">3000₽</div>
    <div class="col-quantity quantity-control">
        <button class="qty-btn">—</button>
        <span class="qty-val">1000</span>
        <button class="qty-btn">+</button>
    </div>
    <div class="col-total item-total-price">300000₽</div>
    <button class="delete-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
</div>
`);

const cartPage = parseHTML(`
<div class="cart-page">
    
    <nav class="checkout-tabs">
        <div class="tab-item active">
            <span class="tab-num">1.</span>
            <span class="tab-text">Товары</span>
        </div>
        <div class="tab-item">
            <span class="tab-num">2.</span>
            <span class="tab-text">Контакты</span>
        </div>
    </nav>

    <div class="checkout-steps">
        
        <div class="checkout-step-content active" id="step-1">
            <div class="cart-table-header">
                <div class="col-product">Товар</div>
                <div class="col-price">Цена</div>
                <div class="col-quantity">Количество</div>
                <div class="col-total">Стоимость</div>
            </div>

            <div class="cart-items-list"></div>

            <div class="cart-summary-line">
                <span>Итого:</span>
                <span class="summary-val">3000000₽</span>
            </div>

            <div class="delivery-options">
                <div class="delivery-row active">
                    <button class="delivery-btn-badge">Самовывоз</button>
                    <div class="delivery-desc">рассада, корни, срезака с середины апреля</div>
                    <div class="delivery-price">0₽</div>
                </div>
                <div class="delivery-row">
                    <button class="delivery-btn-badge dark">Почта России</button>
                    <div class="delivery-desc">Посылка 1-го класса обыкновенная - по тарифам "Почта России"</div>
                    <div class="delivery-price">400₽</div>
                </div>
            </div>

            <div class="cart-summary-line total-with-delivery">
                <span>Итого (с доставкой):</span>
                <span class="summary-val">3000400₽</span>
            </div>

            <div class="step-actions right-align">
                <button class="action-btn">Продолжить</button>
            </div>
        </div>

        <div class="checkout-step-content" id="step-2">
            <form id="user-data-form" class="checkout-form">
                <div class="form-group">
                    <label>ФИО</label>
                    <input type="text" placeholder="Иванов Иван Иванович">
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" placeholder="example@mail.ru">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" placeholder="--">
                </div>
                <div class="form-group">
                    <label>Почтовый индекс</label>
                    <input type="text" placeholder="+7 000 000-00-00">
                </div>
                <div class="form-group">
                    <label>Адрес доставки</label>
                    <input type="text" placeholder="--">
                </div>
                <div class="form-group">
                    <label>Комментарий</label>
                    <textarea rows="4" placeholder="Комментарий к заказу"></textarea>
                </div>

                <div class="form-checkbox">
                    <input type="checkbox" id="agreement" checked>
                    <label for="agreement">
                        Я ознакомлен и согласен с условиями пользовательского соглашения
                        <span>и настоящим подтверждаю, что даю согласие на обработку представленных мной персональных данных.</span>
                    </label>
                </div>
            </form>

            <div class="cart-summary-line total-with-delivery center-mobile">
                <span>Итого (с доставкой):</span>
                <span class="summary-val">3000400₽</span>
            </div>

            <div class="step-actions split-align">
                <button class="action-btn outline">Назад</button>
                <button class="action-btn">Отправить заказ</button>
            </div>
        </div>

    </div>
</div>
`);

const cartList = cartPage.querySelector('.cart-items-list');

async function loadCart() {
    const cards = await api.get('/cards', { card_id: cart.entries().map(item => item[1]) });
    cards.forEach(card => {
        const clone = cartListItem.cloneNode(true);
        clone.id = cart.id;
        clone.querySelector('.cart-item-title').innerText = cart.name;
        if (!card.image) {
            clone.querySelector('.cart-item-img').setAttribute('src', "/assets/product-card-img-demo.png");
        } else {
            clone.querySelector('.cart-item-img').setAttribute('src', card.image);
        }
        clone.querySelector('.col-price').innerText = cart.price;
    })
}

export async function renderBucketPage() {
    renderMainWith(cartPage);
    await loadCart();
}
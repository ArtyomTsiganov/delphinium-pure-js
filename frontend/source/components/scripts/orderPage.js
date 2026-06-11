import {api, parseHTML, toMoney} from "./api.js";
import {renderMainLoading, renderMainWith} from "./mainRender.js";
import {navigateTo} from "./navigation.js";


const orderListItem = parseHTML(`
<div class="order-item">
    <div class="cart-col col-product item-info">
        <img src="flower.jpg" alt="Товар" class="order-item-img">
        <a class="order-item-title">Полное название товара</a>
    </div>
    
    <div class="cart-col col-price">3000₽</div>
    
    <div class="cart-col col-quantity quantity-control">0</div>
    
    <div class="cart-col col-total item-total-price">300000₽</div>
</div>
`);

const orderPage = parseHTML(`
<div class="order-page" xmlns="http://www.w3.org/1999/html">
    
<!--    <nav class="checkout-tabs">-->
<!--        <div class="tab-item active">-->
<!--            &lt;!&ndash;<span class="tab-num">1.</span>&ndash;&gt;-->
<!--            <span class="tab-text">Товары</span>-->
<!--        </div>-->
<!--        <div class="tab-item">-->
<!--            &lt;!&ndash;<span class="tab-num">2.</span>&ndash;&gt;-->
<!--            <span class="tab-text">Контакты</span>-->
<!--        </div>-->
<!--    </nav>-->

    <label class="order-status-block">
        <span>Статус заказа:</span>
        <span class="order-status"></span>
    </label>

    <div class="checkout-steps">
        
        <div class="checkout-step-content active" id="step-1">
            <div class="order-table-header">
                <div class="col-product">Товар</div>
                <div class="col-price">Цена</div>
                <div class="col-quantity">Количество</div>
                <div class="col-total">Стоимость</div>
            </div>

            <div class="order-items-list"></div>

            <div class="order-summary-line">
                <span>Сумма:</span>
                <span id="summary-without" class="summary-val">3000000₽</span>
            </div>

            <div class="delivery-options">
                <div class="delivery-row">
                    <label class="delivery-btn-badge">
                        Самовывоз
                        <input type="radio" name="delivery_method" value="pickup" class="delivery-radio">
                    </label>
                    <span class="delivery-desc">Из магазина по адресу: ${api.getShopAddress()}</span>
                    <span class="delivery-price">${toMoney(0)}</span>
                </div>
                <div class="delivery-row">
                    <label class="delivery-btn-badge">
                        Почта России
                        <input type="radio" name="delivery_method" value="post" class="delivery-radio">
                    </label>
                    <span class="delivery-desc">${api.getDeliveryWay()}</span>
                    <span class="delivery-price">${toMoney(api.getDeliveryPrice())}</span>
                </div>
            </div>

            <div class="order-summary-line total-with-delivery">
                <span>Итого:</span>
                <span class="summary-val">3000400₽</span>
            </div>

            <div class="step-actions right-align">
                <button class="next-step-btn action-btn">Данные получателя</button>
            </div>
        </div>

        <div class="checkout-step-content" id="step-2">
            <form id="user-data-form" class="checkout-form">
                <div class="form-group">
                    <label>ФИО</label>
                    <input disabled type="text" name="fio" placeholder="Иванов Иван Иванович">
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input disabled type="email" name="email" placeholder="example@mail.ru">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input disabled type="tel" name="phone" placeholder="+79876543210">
                </div>
                <div class="form-group">
                    <label>Почтовый индекс</label>
                    <input disabled type="text" name="zipcode" placeholder="000000">
                </div>
                <div class="form-group">
                    <label>Адрес доставки</label>
                    <input disabled type="text" name="address">
                </div>
                <div class="form-group">
                    <label>Комментарий</label>
                    <textarea disabled rows="4" name="comment" placeholder="Комментарий к заказу"></textarea>
                </div>

                <div class="form-checkbox">
                    <input disabled checked type="checkbox" id="agreement" name="agreement">
                    <label for="agreement">
                        Я ознакомлен и согласен с условиями пользовательского соглашения
                        <span>и настоящим подтверждаю, что даю согласие на обработку представленных мной персональных данных.</span>
                    </label>
                </div>
            </form>

            <div class="cart-summary-line total-with-delivery center-mobile">
                <span>Итого:</span>
                <span class="summary-val">3000400₽</span>
            </div>

            <div class="step-actions split-align">
                <button class="prev-step-btn action-btn outline">Содержимое заказа</button>
            </div>
        </div>

    </div>
</div>
`);

const orderList = orderPage.querySelector('.order-items-list');
const tabsTags = orderPage.querySelectorAll('.tab-item');
const tabs = orderPage.querySelectorAll('.checkout-step-content');

function changeStep(stepNumber) {
    const activeStepChanger = t => t.forEach((tab, index) => {
        if (index + 1 === stepNumber) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    //activeStepChanger(tabsTags);
    activeStepChanger(tabs);
}

orderPage.querySelector('.next-step-btn').addEventListener('click', () => changeStep(2));
orderPage.querySelector('.prev-step-btn').addEventListener('click', () => changeStep(1));

async function loadOrdersList() {
    const orderId = new URLSearchParams(window.location.search).get('public_id');
    const orderItems = await api.get(`/orders/${orderId}/items`);
    const cards = new Map(
        await api.get(`/cards`, {
            count: 1000,
            order_by: 'name',
            card_id: orderItems.map(item => item.card_id)
        }).then(
            items => items.map(card => [card.card_id, card])
        )
    );
    
    let totalPrice = 0;
    orderItems.forEach(item => {
        const clone = orderListItem.cloneNode(true);
        clone.id = item.card_id;
        totalPrice += parseFloat(item.price);
        clone.querySelector('.col-price').textContent = toMoney(item.price);
        clone.querySelector('.col-quantity').textContent = item.count;
        const card = cards.get(item.card_id);
        const cartItemTitle = clone.querySelector('.order-item-title');
        if (card) {
            cartItemTitle.textContent = card.name;
            cartItemTitle.addEventListener('click', e => {
                e.preventDefault();
                navigateTo('/product', card);
            });
            clone.querySelector('.order-item-img').setAttribute('src', card.image ?? "/assets/product-card-img-demo.png");
        } else {
            cartItemTitle.textContent = '-';
        }
        orderList.appendChild(clone);
    });
    
    const orderInfo = await api.get(`/orders/${orderId}/`);
    orderPage.querySelectorAll('.summary-val').forEach(item => {
        if (item?.id !== 'summary-without' && orderInfo.order_type === 'post')
            item.textContent = toMoney(totalPrice + api.getDeliveryPrice());
        else
            item.textContent = toMoney(totalPrice);
    });
    orderPage.querySelectorAll('.delivery-row').forEach(row => {
        if (row.querySelector('input').value === orderInfo.order_type) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
    orderPage.querySelector('input[name="fio"]').value = orderInfo.name;
    orderPage.querySelector('input[name="email"]').value = orderInfo.email;
    orderPage.querySelector('input[name="phone"]').value = orderInfo.phone_number;
    orderPage.querySelector('input[name="zipcode"]').value = orderInfo.postal_code;
    orderPage.querySelector('input[name="address"]').value = orderInfo.address;
    orderPage.querySelector('textarea[name="comment"]').value = orderInfo.comment;
    orderPage.querySelector('.order-status').textContent = orderInfo.status;
}

export async function renderOrderListPage() {
    renderMainLoading();
    await loadOrdersList();
    renderMainWith(orderPage);
}
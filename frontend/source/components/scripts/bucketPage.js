import {api, parseHTML, toMoney} from "./api.js";
import {renderMainLoading, renderMainWith} from "./mainRender.js";
import {
    addToCartOne,
    clearCart,
    getCartItemCount,
    getCartItemsIds,
    removeFromCartAll,
    removeFromCartOne, revokeOrderId,
    setCartItemCount, submitCartOrder, validateCartOrder
} from "./cart.js";
import {navigateTo} from "./navigation.js";
import {showToastAlert, showToastError, showToastSuccess} from "./toastAlert.js";
import {checkDataValid, getUserData, setUserData} from "./userDataManager.js";


const deliveryPrice = api.getDeliveryPrice();
let currentDeliveryOptionStatus = undefined;

const cartListItem = parseHTML(`
<div class="cart-item">
    <div class="cart-col col-product item-info">
        <img src="flower.jpg" alt="Товар" class="cart-item-img">
        <a class="cart-item-title">Полное название товара</a>
    </div>
    
    <div class="cart-col col-price">3000₽</div>
    
    <div class="cart-col col-quantity quantity-control">
        <div class="quantity-picker">
            <button class="qty-btn qty-btn-add">+</button>
            <input class="qty-input" type="text" inputmode="numeric" placeholder="count">
            <button class="qty-btn qty-btn-rem">-</button>
        </div>
    </div>
    
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

const cartPage = parseHTML(`
<div class="cart-page" xmlns="http://www.w3.org/1999/html">
    
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

    <div class="checkout-steps">
        
        <div class="checkout-step-content active" id="step-1">
            <div class="cart-table-header">
                <div class="col-product">Товар</div>
                <div class="col-price">Цена</div>
                <div class="col-quantity">Количество</div>
                <div class="col-total">Стоимость</div>
                <div class="col-delete"></div>
            </div>

            <div class="cart-items-list"></div>

            <div class="cart-summary-line">
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
                    <span class="delivery-price">${toMoney(deliveryPrice)}</span>
                </div>
            </div>

            <div class="cart-summary-line total-with-delivery">
                <span>Итого:</span>
                <span class="summary-val">3000400₽</span>
            </div>

            <div class="step-actions right-align">
                <button class="next-step-btn action-btn">Продолжить</button>
            </div>
        </div>

        <div class="checkout-step-content" id="step-2">
            <form id="user-data-form" class="checkout-form">
                <div class="form-group">
                    <label>ФИО</label>
                    <input type="text" name="fio" placeholder="Иванов Иван Иванович">
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" name="email" placeholder="example@mail.ru">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" name="phone" placeholder="+79876543210">
                </div>
                <div class="form-group">
                    <label>Почтовый индекс</label>
                    <input type="text" name="zipcode" placeholder="000000">
                </div>
                <div class="form-group">
                    <label>Адрес доставки</label>
                    <input type="text" name="address">
                </div>
                <div class="form-group">
                    <label>Комментарий</label>
                    <textarea rows="4" name="comment" placeholder="Комментарий к заказу"></textarea>
                </div>

                <div class="form-checkbox">
                    <input type="checkbox" id="agreement" name="agreement">
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
                <button class="prev-step-btn action-btn outline">Назад</button>
                <button class="validate-order action-btn">Отправить заказ</button>
            </div>
        </div>

    </div>

    <div class="cart-remove-modal" hidden>
        <div class="cart-remove-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-remove-title">
            <p id="cart-remove-title" class="cart-remove-title">Удалить товар из корзины?</p>
            <p class="cart-remove-text"></p>
            <div class="cart-remove-actions">
                <button class="cart-remove-cancel action-btn outline">Оставить</button>
                <button class="cart-remove-confirm action-btn">Удалить</button>
            </div>
        </div>
    </div>
</div>
`);

const cartList = cartPage.querySelector('.cart-items-list');
const tabsTags = cartPage.querySelectorAll('.tab-item');
const tabs = cartPage.querySelectorAll('.checkout-step-content');
const form = cartPage.querySelector('#user-data-form');
const submitBtn = cartPage.querySelector('.validate-order');
const cards = new Map();
const removeModal = cartPage.querySelector('.cart-remove-modal');
const removeModalText = cartPage.querySelector('.cart-remove-text');
const removeModalConfirm = cartPage.querySelector('.cart-remove-confirm');
const removeModalCancel = cartPage.querySelector('.cart-remove-cancel');
let removeModalState = null;

cartPage.querySelector('.delivery-options').addEventListener('change', (e) => {
    currentDeliveryOptionStatus = e.target.value;
    updateTotal();
});

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

cartPage.querySelector('.next-step-btn').addEventListener('click', e => {
    if (currentDeliveryOptionStatus) {
        e.target.textContent = 'Подождите...';
        e.target.disabled = true;
        validateCartOrder().then(value => {
            if (value)
                changeStep(2);
            else
                showToastAlert(`Какого-то из товаров в наличии недостаточно`);
        }).catch(reason => {
            showToastError(`Ошибка сервера: ${reason}`);
        }).finally(() => {
            e.target.textContent = 'Продолжить';
            e.target.disabled = false;
        });
    } else
        showToastAlert('Выберите способ получения');
});
cartPage.querySelector('.prev-step-btn').addEventListener('click', async () => {
    changeStep(1);
    await revokeOrderId();
});

function hideRemoveModal() {
    removeModal.hidden = true;
    removeModalState = null;
}

function showRemoveModal(card, row) {
    removeModalState = { card, row };
    removeModalText.textContent = `Позиция "${card.name}" будет удалена из заказа.`;
    removeModal.hidden = false;
    removeModalCancel.focus();
}

removeModalCancel.addEventListener('click', hideRemoveModal);
removeModal.addEventListener('click', e => {
    if (e.target === removeModal) {
        hideRemoveModal();
    }
});
removeModalConfirm.addEventListener('click', () => {
    if (removeModalState) {
        removeFromCartAll(removeModalState.card.card_id);
        cards.delete(removeModalState.card.card_id);
        removeModalState.row.remove();
        updateTotal();
    }
    hideRemoveModal();
});

cartPage.addEventListener('keydown', e => {
    if (!removeModal.hidden && e.key === 'Escape') {
        hideRemoveModal();
    }
});

function updateTotal() {
    let cartTotal = 0;
    cartList.querySelectorAll('.cart-item').forEach(item => {
        const itemId = parseInt(item.id);
        const stackPrice = cards.get(itemId).price * (getCartItemCount(itemId) || 0);
        item.querySelector('.item-total-price').textContent = toMoney(stackPrice);
        cartTotal += stackPrice;
    });
    cartPage.querySelectorAll('.summary-val').forEach(item => {
        if (item?.id !== 'summary-without' && currentDeliveryOptionStatus === 'post')
            item.textContent = toMoney(cartTotal + deliveryPrice);
        else
            item.textContent = toMoney(cartTotal);
    });
}

form.querySelectorAll('input,textarea').forEach(item => {
    if (item.id !== 'agreement' && getUserData(item.name) !== undefined) {
        item.value = getUserData(item.name);
    }
});

form.addEventListener('input', (e) => {
    if (e.target.id === 'agreement') {
        if (e.target.checked)
            e.target.classList.remove('invalid');
    } else {
        setUserData(e.target.name, e.target.value);
        if (checkDataValid(e.target.name, e.target.value))
            e.target.classList.remove('invalid');
    }
});

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let isValid = true;
    form.querySelectorAll('input:not(#agreement)').forEach(item => {
        if (!checkDataValid(item.name, item.value)) {
            item.classList.add('invalid');
            showToastAlert(`Некорректный ввод: ${item.previousElementSibling.textContent}`);
            isValid = false;
        }
    });
    if (!form.querySelector('#agreement').checked) {
        showToastAlert(`Ознакомьтесь с условиями пользовательского соглашения`);
        isValid = false;
    }
    if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        submitCartOrder(currentDeliveryOptionStatus).then(public_id => {
            if (public_id) {
                clearCart();
                showToastSuccess('Заказ отправлен в магазин\nПроверьте email для дальнейших действий');
                setTimeout(() => navigateTo(`/order?public_id=${public_id}`), 500);
            } else {
                showToastAlert('Не получилось собрать заказ');
            }
        }).catch(reason => {
            showToastError(`Ошибка сервера: ${reason}`);
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заказ';
        });
    }
})

async function loadCart() {
    cartList.querySelectorAll('.cart-item').forEach(item => item.remove());
    cards.clear();
    
    const idsInCart = getCartItemsIds();
    if (idsInCart.length > 0) {
        const response = await api.get('/cards', {count: 1000, orderBy: 'name', card_id: getCartItemsIds()});
        response.forEach(card => {
            card.price = parseFloat(card.price);
            cards.set(card.card_id, card);
        });
    }
    
    cards.forEach((card, id) => {
        const clone = cartListItem.cloneNode(true);
        
        clone.id = card.card_id;
        const cartItemTitle = clone.querySelector('.cart-item-title');
        cartItemTitle.textContent = card.name;
        cartItemTitle.addEventListener('click', e => {
            e.preventDefault();
            navigateTo('/product', card);
        });
        if (!card.image) {
            clone.querySelector('.cart-item-img').setAttribute('src', "/assets/product-card-img-demo.png");
        } else {
            clone.querySelector('.cart-item-img').setAttribute('src', card.image);
        }
        clone.querySelector('.col-price').textContent = toMoney(card.price);
        const countInput = clone.querySelector('.qty-input');
        countInput.id = `input-count-${id}`;
        countInput.value = getCartItemCount(card.card_id);
        if (getCartItemCount(card.card_id) > card.count)
            countInput.classList.add('invalid');
        countInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '').replace(/^$/, '0');
            setCartItemCount(card.card_id, e.target.value);
            if (getCartItemCount(card.card_id) > card.count)
                e.target.classList.add('invalid');
            else
                e.target.classList.remove('invalid');
            updateTotal();
        });
        clone.querySelector('.qty-btn-add').addEventListener('click', () => {
            addToCartOne(card.card_id);
            countInput.value -= -1;
            if (getCartItemCount(card.card_id) > card.count)
                countInput.classList.add('invalid');
            updateTotal();
        });
        clone.querySelector('.qty-btn-rem').addEventListener('click', () => {
            const currentCount = getCartItemCount(card.card_id);
            if (currentCount > 1) {
                removeFromCartOne(card.card_id);
                countInput.value -= 1;
                if (getCartItemCount(card.card_id) <= card.count)
                    countInput.classList.remove('invalid');
                updateTotal();
            } else if (currentCount === 1) {
                showRemoveModal(card, clone);
            }
        });
        clone.querySelector('.col-price').textContent = toMoney(card.price);
        clone.querySelector('.delete-btn').addEventListener('click', () => {
            removeFromCartAll(card.card_id);
            cards.delete(card.card_id);
            clone.remove();
            updateTotal();
        });
        
        cartList.appendChild(clone);
    })
}

export async function renderBucketPage() {
    renderMainLoading();
    changeStep(1);
    await loadCart();
    updateTotal();
    renderMainWith(cartPage);
}

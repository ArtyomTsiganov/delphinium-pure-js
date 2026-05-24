import { renderMainWith } from "./mainRender.js";
import { parseHTML, toMoney } from "./api.js";
import { addToCartOne } from "./cart.js";
import {showToast} from "./toastAlert.js";


const productPage = parseHTML(`
<div class="product-page">
    <a class="back-link">← Назад</a>
    
    <div class="product-detail-main">
        <div class="product-left-col">
            <img src="" alt="" class="main-product-img">
            
            <div class="purchase-panel">
                <div class="price-block">
                    <span class="price"></span>
                    <span class="stock">В наличии: <b></b></span>
                </div>
                <button class="add-to-cart-btn">В Корзину</button>
            </div>
        </div>
        
        <div class="product-right-col">
            <h1 class="product-title"></h1>
            <div class="product-description">
                <p></p>
            </div>
        </div>
    </div>
</div>
`);

function setProductData() {
    const card = history.state;
    if (!card.image)
        productPage.querySelector('.main-product-img').setAttribute('src', 'assets/product-card-img-demo.png');
    else
        productPage.querySelector('.main-product-img').setAttribute('src', card.image);
    productPage.querySelector('.price').textContent = toMoney(card.price);
    productPage.querySelector('.stock b').textContent = card.count;
    productPage.querySelector('.add-to-cart-btn').replaceWith(
        productPage.querySelector('.add-to-cart-btn').cloneNode(true)
    );
    productPage.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCartOne(card.card_id);
        showToast(card.short_name ?? card.name);
    });
    productPage.querySelector('.product-title').textContent = card.name;
    productPage.querySelector('.product-description').textContent = card.description;
    productPage.querySelector('.back-link').addEventListener("click", e => {
        e.preventDefault();
        history.go(-1);
    });
}

export async function renderProductPage() {
    renderMainWith(productPage);
    setProductData();
}
import { navigateTo, setRoutes } from "./components/scripts/navigation.js";
import { renderLandingPage } from "./components/scripts/landingPage.js";
import { renderCatalogPage } from "./components/scripts/catalogPage.js";
import { renderBucketPage } from "./components/scripts/bucketPage.js";
import { renderProductPage } from "./components/scripts/productPage.js";
import {renderClientAgreementPage, renderPrivacyPolicyPage} from "./components/scripts/documentsPages.js";
import {renderOrderListPage} from "./components/scripts/orderPage.js";
import {getCartTotalCount} from "./components/scripts/cart.js";


setRoutes({
    '/': renderLandingPage,
    '/catalog': renderCatalogPage,
    '/cart': renderBucketPage,
    '/order': renderOrderListPage,
    '/product': renderProductPage,
    '/privacy-policy': renderPrivacyPolicyPage,
    '/client-agreement': renderClientAgreementPage,
});

document.querySelector('#header-catalog').addEventListener("click", () => navigateTo('/catalog'));
// document.querySelector('#header-deliveries').addEventListener("click", () => navigateTo('/deliveries'));
const headerCart = document.querySelector('#header-cart');
const cartCounter = document.createElement('span');
cartCounter.className = 'header-cart-counter';
headerCart.appendChild(cartCounter);

function updateHeaderCartCounter() {
    const count = getCartTotalCount();
    cartCounter.textContent = count > 99 ? '99+' : count;
    cartCounter.hidden = count === 0;
}

headerCart.addEventListener("click", () => navigateTo('/cart'));
window.addEventListener('cart-updated', updateHeaderCartCounter);
updateHeaderCartCounter();

document.querySelector('#header-logo').addEventListener("click", () => navigateTo('/'));
document.querySelector('#privacy-policy').addEventListener("click", () => navigateTo('/privacy-policy'));
document.querySelector('#client-agreement').addEventListener("click", () => navigateTo('/client-agreement'));

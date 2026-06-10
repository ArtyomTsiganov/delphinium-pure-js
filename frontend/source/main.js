import { navigateTo, setRoutes } from "./components/scripts/navigation.js";
import { renderLandingPage } from "./components/scripts/landingPage.js";
import { renderCatalogPage } from "./components/scripts/catalogPage.js";
import { renderBucketPage } from "./components/scripts/bucketPage.js";
import { renderProductPage } from "./components/scripts/productPage.js";
import {renderClientAgreementPage, renderPrivacyPolicyPage} from "./components/scripts/documentsPages.js";
import {renderOrderListPage} from "./components/scripts/ordersListPage.js";


setRoutes({
    '/': renderLandingPage,
    '/catalog': renderCatalogPage,
    '/cart': renderBucketPage,
    '/deliveries': renderOrderListPage,
    '/product': renderProductPage,
    '/privacy-policy': renderPrivacyPolicyPage,
    '/client-agreement': renderClientAgreementPage,
});

document.querySelector('#header-catalog').addEventListener("click", () => navigateTo('/catalog'));
document.querySelector('#header-deliveries').addEventListener("click", () => navigateTo('/deliveries'));
document.querySelector('#header-cart').addEventListener("click", () => navigateTo('/cart'));
document.querySelector('#header-logo').addEventListener("click", () => navigateTo('/'));
document.querySelector('#privacy-policy').addEventListener("click", () => navigateTo('/privacy-policy'));
document.querySelector('#client-agreement').addEventListener("click", () => navigateTo('/client-agreement'));
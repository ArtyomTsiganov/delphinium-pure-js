import { navigateTo, setRoutes } from "./components/scripts/navigation.js";
import { renderLandingPage } from "./components/scripts/landingPage.js";
import { renderCatalogPage } from "./components/scripts/catalogPage.js";
import { renderBucketPage } from "./components/scripts/bucketPage.js";
import { renderProductPage } from "./components/scripts/productPage.js";


setRoutes({
    '/': renderLandingPage,
    '/catalog': renderCatalogPage,
    '/cart': renderBucketPage,
    '/blog': () => {},
    '/profile': () => {},
    '/product': renderProductPage,
});

document.querySelector('#header-catalog').addEventListener("click", () => navigateTo('/catalog'));
document.querySelector('#header-blog').addEventListener("click", () => navigateTo('/blog'));
document.querySelector('#header-profile').addEventListener("click", () => navigateTo('/profile'));
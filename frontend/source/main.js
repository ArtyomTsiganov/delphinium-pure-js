import { setRoutes } from "./components/scripts/navigation.js";
import { renderLandingPage } from "./components/scripts/landingPage.js";
import { renderCatalogPage } from "./components/scripts/catalogPage.js";
import { renderBucketPage } from "./components/scripts/bucketPage.js";


setRoutes({
    '/': async () => {
        await renderCatalogPage();
    },
    '/landing': renderLandingPage,
    '/catalog': renderCatalogPage,
    '/cart': renderBucketPage,
});
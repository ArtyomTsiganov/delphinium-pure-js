import { headerTemplate } from './components/header/header.js';
document.body.insertAdjacentHTML('afterbegin', headerTemplate());

// for (const rollingArea of document.getElementsByClassName("rolling-list")) {
//     rollingArea.addEventListener("mousewheel", (e) => {
//         if (e.deltaY !== 0) {
//             e.preventDefault();
//             rollingArea.scrollBy(e.deltaY, 0);
//         }
//     });
// }
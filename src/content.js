import {ContentHandler} from "./content-handler";

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        setTimeout(() => {
            new ContentHandler().run();
        }, 3 * 1000);
    }
});

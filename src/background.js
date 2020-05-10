import {BackgroundHandler} from "./background-handler";

// This block once only once, when the browser starts
new BackgroundHandler().run().then(() => {
    console.log('Background script done');
});

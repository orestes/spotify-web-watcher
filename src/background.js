import {BackgroundHandler} from "./background-handler";

// This runs on every service worker start-up, not just once per browser session
new BackgroundHandler().register();

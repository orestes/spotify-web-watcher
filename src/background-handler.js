import {getCurrentUserId, setIcon} from "./utils";

export class BackgroundHandler {
    // A Manifest V3 service worker is torn down between events and restarted on
    // the next one, so every listener has to be attached synchronously on each
    // start-up. Anything registered after an `await` can miss the event that
    // woke the worker up.
    register() {
        chrome.runtime.onInstalled.addListener(({reason}) => {
            if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
                return;
            }

            this.displayWelcomePage();
        });

        chrome.storage.sync.onChanged.addListener((changes) => {
            console.log('Changes in storage', {changes});
            this.updateIcon();
        });

        this.updateIcon();
    }

    displayWelcomePage() {
        chrome.tabs.create({url: chrome.runtime.getURL("welcome.html")});
    }

    async updateIcon() {
        const color = (await getCurrentUserId()) ? 'green' : 'red';
        await setIcon(`/icons/48x48-${color}.png`);
    }
}

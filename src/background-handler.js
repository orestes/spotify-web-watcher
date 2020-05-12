import {getCurrentUserId, setIcon} from "./utils";

export class BackgroundHandler {
    async run() {
        const userId = await getCurrentUserId();
        await this.updateIcon(userId);

        chrome.storage.sync.onChanged.addListener(async (changes, namespace) => {
            console.log('Changes in storage', {changes, namespace});
            this.updateIcon(await getCurrentUserId());
        });

        if (userId) {
            return; // Already displayed this page
        }

        this.displayWelcomePage();
    }

    displayWelcomePage() {
        const welcomeUrl = chrome.extension.getURL("welcome.html");
        chrome.tabs.create({url: welcomeUrl});
    }

    async updateIcon(userId) {
        const color = userId ? 'green' : 'red';
        await setIcon(`../../icons/48x48-${color}.png`);
    }
}

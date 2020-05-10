import {config} from "../config";
import {getStoredValue, setIcon} from "./utils";

export class BackgroundHandler {
    async run() {
        await this.updateIcon();
        chrome.storage.sync.onChanged.addListener((changes, namespace) => {
            console.log('Changes in storage', {changes, namespace});
            this.updateIcon();
        });
    }

    async updateIcon() {
        const userId = (await getStoredValue(config.storageKey))[config.storageKey];
        const color = userId ? 'green' : 'red';
        await setIcon(`../../icons/48x48-${color}.png`);
    }
}

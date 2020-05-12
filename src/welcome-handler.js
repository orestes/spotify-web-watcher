import {config} from '../config.js';
import {getCurrentUserId} from "./utils";

export class WelcomeHandler {
    async run() {
        this.updateVersion();
        await this.updateLogo();

        chrome.storage.sync.onChanged.addListener(() => {
            this.updateLogo();
        });
    }

    async updateLogo() {
        const userId = await getCurrentUserId();
        const color = userId? 'green' : 'red';

        this.getLogoElement().setAttribute('src', `icons/48x48-${color}.png`);
    }

    updateVersion() {
        this.getVersionElement().innerText = `v${config.version}`;
    }

    getVersionElement() {
        return document.querySelector('.version');
    }

    getLogoElement() {
        return document.querySelector('.logo');
    }
}


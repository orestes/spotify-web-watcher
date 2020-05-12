import {config} from '../config.js';

export class WelcomeHandler {
    async run() {
        this.updateLogo();
        this.updateVersion();
    }

    updateLogo() {
        this.getLogoElement().setAttribute('src', 'icons/48x48-red.png');
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


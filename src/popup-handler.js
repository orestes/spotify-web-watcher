import "firebase/auth";
import * as firebase from "firebase/app";

import {config} from '../config.js';
import {getStoredValue} from "./utils";

export class PopupHandler {
    async signInAnonymously() {
        firebase.initializeApp(config.firebase);

        const {user} = await firebase.auth().signInAnonymously();

        return user.uid;
    };

    setText(text) {
        document.querySelector('input').setAttribute('value', text);
    }

    copyTextFactory(text) {
        return async () => {
            await navigator.clipboard.writeText(text);
        };
    }

    async run() {
        this.setText('Getting URL...');
        const userId = (await getStoredValue(config.storageKey))[config.storageKey];

        // TODO: Listen for changes on the stored value and display the URL

        if (!userId) {
            this.setText('Not configured');

            this.getCopyButton().style.display = 'none';
            this.getOpenButton().style.display = '';
            this.getOpenButton().addEventListener('click', () => {
                window.open('https://open.spotify.com');
            });

            return;
        }

        const url = `${config.baseUrl}/view/${userId}`;
        this.setText(url);

        const callback = this.copyTextFactory(url);
        this.getCopyButton().addEventListener('click', callback);
    }

    getCopyButton() {
        return document.querySelector('button.copy');
    }

    getOpenButton() {
        return document.querySelector('button.open');
    }
}


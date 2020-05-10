import * as firebase from "firebase/app";
import "firebase/auth";

import { config } from '../config.js';
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
        const userId = await getStoredValue(config.storageKey);// [config.storageKey]
        debugger;

        // TODO: Listen for changes on the stored value and display the URL

        if (!userId) {
            this.setText('Not configured');
            return;
        }

        const url = `${config.baseUrl}/view/${userId}`;
        this.setText(url);

        const callback = this.copyTextFactory(url);
        document.querySelector('button').addEventListener('click', callback);
    }
}


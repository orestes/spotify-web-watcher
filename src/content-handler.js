import {config} from "../config";
import {setStoredValue} from "./utils";

import 'firebase/auth';
import 'firebase/firestore';
import * as firebase from "firebase/app";

export class ContentHandler {

    constructor() {
        this.userId = undefined;
        this.pendingUpdates = {};
        this.updateTrigger = undefined;
    }

    async watchForChanges(element, callback) {
        // Options for the observer (which mutations to observe)
        const config = {attributes: true, characterData: true, childList: true, subtree: false};

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(function (mutationsList) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                } else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                    callback();
                }
            }
        });

        // Start observing the target node for configured mutations
        observer.observe(element, config);

        return () => {
            observer.disconnect()
        };
    };

    getCoverElement() {
        return document.querySelector('.cover-art-image');
    }

    getSongElement() {
        return document.querySelector('[data-testid=nowplaying-track-link]');
    }

    getArtistElement() {
        return document.querySelector('a[href^="/artist"]');
    }

    getCover() {
        return this.getCoverElement().src;
    }

    getSong() {
        return this.getSongElement().innerText;
    }

    getArtist() {
        return this.getArtistElement().innerText;
    }

    async publishPendingUpdates() {
        this.pendingUpdates.version = config.version;
        this.pendingUpdates.date = firebase.firestore.Timestamp.now();
        await firebase.firestore().collection(`users`).doc(this.userId).set(this.pendingUpdates, {merge: true});
    }

    updateNowPlaying(data) {
        // Merge the changes
        this.pendingUpdates = {...this.pendingUpdates, ...data};
        if (this.updateTrigger) {
            clearTimeout(this.updateTrigger);
        }

        this.updateTrigger = setTimeout(() => {
            this.publishPendingUpdates();
        }, config.debounceTime);
    }

    initFirebase() {
        firebase.initializeApp(config.firebase);
    };

    async getCurrentUserId() {
        const {user} = await firebase.auth().signInAnonymously();
        return user.uid;
    };

    async run() {
        this.initFirebase();
        this.userId = await this.getCurrentUserId();

        await setStoredValue({[config.storageKey]: this.userId});

        console.log('Current user', this.userId);

        const data = {
            cover: this.getCover(),
            song: this.getSong(),
            artist: this.getArtist(),
        };

        console.log('Now playing', data);

        await this.watchForChanges(this.getCoverElement(), () => {
            this.updateNowPlaying({cover: this.getCover()});
        });
        await this.watchForChanges(this.getSongElement(), () => {
            this.updateNowPlaying({song: this.getSong()});
        });
        await this.watchForChanges(this.getArtistElement(), () => {
            this.updateNowPlaying({artist: this.getArtist()});
        });

        await this.updateNowPlaying(data);

        console.log(`Spotify Watcher ${config.version} loaded`);
    };
}

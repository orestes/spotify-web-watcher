const config = {
    version: 'v0.0.1',
    debounceTime: 100,
    storageKey: 'userId',
    baseUrl: 'https://spotify-watcher-185e9.web.app',
    firebase: {
        apiKey: "AIzaSyA8QX_uGwN9mOt_XVDljtqLMrpNHJo47kg",
        authDomain: "spotify-watcher-185e9.firebaseapp.com",
        databaseURL: "https://spotify-watcher-185e9.firebaseio.com",
        projectId: "spotify-watcher-185e9",
        storageBucket: "spotify-watcher-185e9.appspot.com",
        messagingSenderId: "230581828104",
        appId: "1:230581828104:web:ab83862d48b29f1ad06fbd"
    }
};

const getStoredValue = async (key) => {
    return new Promise(((resolve, reject) => {
        chrome.storage.sync.get(key, (value) => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }

            return resolve(value);
        });
    }));
};

const setStoredValue = async (values) => {
    return new Promise(((resolve, reject) => {
        chrome.storage.sync.set(values, (value) => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }
            return resolve(value);
        });
    }));
};

const watchForChanges = async (element, callback) => {
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

const getCoverElement = () => document.querySelector('.cover-art-image');
const getSongElement = () => document.querySelector('[data-testid=nowplaying-track-link]');
const getArtistElement = () => document.querySelector('a[href^="/artist"]');

const getCover = () => getCoverElement().src;
const getSong = () => getSongElement().innerText;
const getArtist = () => getArtistElement().innerText;

let userId;
let pendingUpdates;
const publishPendingUpdates = async () => {
    pendingUpdates.version = config.version;
    pendingUpdates.date = firebase.firestore.Timestamp.now();
    console.log('Updating', pendingUpdates);
    await firebase.firestore().collection(`users`).doc(userId).set(pendingUpdates, { merge: true });
    console.log('Saved', pendingUpdates);
};

let updateTrigger;
const updateNowPlaying = (data) => {
    // Merge the changes
    pendingUpdates = {...pendingUpdates, ...data};
    if (updateTrigger) {
        clearTimeout(updateTrigger);
        console.log('debounced');
    }

    console.log('change queued', data);
    updateTrigger = setTimeout(publishPendingUpdates, config.debounceTime);
};

const initFirebase = () => {
    firebase.initializeApp(config.firebase);
};

const getCurrentUserId = async () => {
    return (await getStoredValue(config.storageKey))[config.storageKey];
};

const init = async () => {
    userId = await getCurrentUserId();
    if (!userId) {
        console.log('Not configured. Click on the extension\'s icon first');
        alert('Click on the Spotify Web Watcher icon to set up');
        return;
    }

    console.log('Current user', userId);

    console.log('Now playing', {
        cover: getCover(),
        song: getSong(),
        artist: getArtist(),
    });
    // TODO: Do we need to stop watching mutations?
    await watchForChanges(getCoverElement(), () => {
        updateNowPlaying({cover: getCover()})
    });
    // TODO: Do we need to stop watching mutations?
    await watchForChanges(getSongElement(), () => {
        updateNowPlaying({song: getSong()})
    });
    // TODO: Do we need to stop watching mutations?
    await watchForChanges(getArtistElement(), () => {
        updateNowPlaying({artist: getArtist()})
    });

    initFirebase();

    await updateNowPlaying({
        cover: getCover(),
        song: getSong(),
        artist: getArtist(),
    });

    console.log(`Spotify Watcher ${config.version} loaded`);
};

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        // TODO: Kick-off the watch when clicking the extension button
        setTimeout(init, 3 * 1000);
    }
});

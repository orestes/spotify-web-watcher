const config = {
    version: 'v0.0.1',
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

const setIcon = async (url) => {
    return new Promise((resolve, reject) => {
        chrome.browserAction.setIcon({path: url}, () => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }

            return resolve();
        })
    });
};

// This block once only once, when the browser starts
(async () => {
    const userId = (await getStoredValue(config.storageKey))[config.storageKey];
    const color = userId ? 'green' : 'red';
    await setIcon(`../../icons/48x48-${color}.png`);
})();

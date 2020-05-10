export const getStoredValue = async (key) => {
    return new Promise(((resolve, reject) => {
        chrome.storage.sync.get(key, (value) => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }

            return resolve(value);
        });
    }));
};
export const setStoredValue = async (values) => {
    return new Promise(((resolve, reject) => {
        chrome.storage.sync.set(values, (value) => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }
            return resolve(value);
        });
    }));
};
export const setIcon = async (url) => {
    return new Promise((resolve, reject) => {
        chrome.browserAction.setIcon({path: url}, () => {
            if (chrome.runtime.error) {
                return reject(chrome.runtime.error);
            }

            return resolve();
        })
    });
};

import {config} from "../config";

// Manifest V3 gives every one of these a promise-returning form, which replaces
// the callback wrappers this file used to hand-roll.
export const getStoredValue = async (key) => {
    return chrome.storage.sync.get(key);
};

export const setStoredValue = async (values) => {
    return chrome.storage.sync.set(values);
};

export const setIcon = async (path) => {
    return chrome.action.setIcon({path});
};

export const getCurrentUserId = async () => {
    return (await getStoredValue(config.storageKey))[config.storageKey];
};

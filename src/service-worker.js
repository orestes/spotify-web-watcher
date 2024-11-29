/**
 *
 * @param {OnInstalledReason} reason
 * @return {Promise<void>}
 */
async function handleOnInstalled({reason}) {
	// We're always off when reinstalled
	await chrome.action.setBadgeText({
		text: "OFF",
	});

	if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
		return;
	}

	await chrome.tabs.create({url: chrome.runtime.getURL("/src/welcome.html")});
}

/**
 *
 * @param {number} tabId
 * @returns {Promise<void>}
 */
async function turnOnOff(tabId) {
	// Retrieve the action badge to check if the extension is 'ON' or 'OFF'
	const prevState = await chrome.action.getBadgeText({tabId});
	// Next state will always be the opposite
	const nextState = prevState === 'ON' ? 'OFF' : 'ON'

	// Set the action badge to the next state
	await chrome.action.setBadgeText({
		tabId,
		text: nextState,
	});
}

/**
 *
 * @param {Tab} tab
 * @return {Promise<void>}
 */
async function handleOnAction(tab) {
	const results = await chrome.scripting
		.executeScript({
			target : {tabId : tab.id},
			func : watchForPlaybackChanges,
		})

	for (const {frameId, result} of results) {
		console.log(`Frame ${frameId} result:`, result);
	}

	// TODO: Use the return from the function to change the badge text
	await turnOnOff(tab.id);

}

/**
 * Runs on the Spotify Web Player tab. Uses a MutationObserver to catch the current artist, title and album cover
 * TODO: Are we allowed to hotlink Spotify's album covers?
 *
 * @return {Promise<void>} Any value, passed to the `executeScript` return value
 */
async function watchForPlaybackChanges() {
	console.log('debug::', 'ready');

	return 'OK :)';
}

chrome.runtime.onInstalled.addListener(handleOnInstalled);
chrome.action.onClicked.addListener(handleOnAction);

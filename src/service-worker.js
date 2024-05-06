chrome.runtime.onInstalled.addListener(({ reason }) => {
	if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
		return;
	}

	chrome.tabs.create({ url: chrome.runtime.getURL("/src/welcome.html") });
});

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: chrome.runtime.getURL("/src/welcome.html") });
	chrome.action.setBadgeText({
		text: "OK",
	});
	chrome.action.setBadgeBackgroundColor({ color: "green" });
});

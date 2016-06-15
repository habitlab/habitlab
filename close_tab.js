chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	if (request.greeting === "closeTab") {
		chrome.tabs.getSelected(function(tab) {
			console.log(tab.id);
			chrome.tabs.remove(tab.id);
		});
	}
});


chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log('tab was removed ' + tabId)
})

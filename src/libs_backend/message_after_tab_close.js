chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log('tab was removed ' + tabId)
  // to change the background color of the page
  /*
  setTimeout(function() {
    chrome.tabs.executeScript({code: 'document.querySelector("body").style.backgroundColor = "green"'})
  }, 3000)
  */
})

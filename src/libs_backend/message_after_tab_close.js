//const {polymer_ext} = require('libs_frontend/polymer_utils');

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log('tab with id ' + tabId + ' was closed')
  // to change the background color of the page
  setTimeout(function() {
    //chrome.tabs.executeScript({code: 'var notif=document.createElement("paper-scroll-header-panel");notif.text_content="You just closed a tab";'})
    chrome.tabs.executeScript({file: 'frontend_utils/close_tab_message.js'});
  }, 3000)

})

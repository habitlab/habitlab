const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

var close_notification = null;

//Displays a rich notification to the user
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === "chrome-notification-gmail-composing") {
    var notification = new Notification('HabitLab', {
      icon: chrome.extension.getURL('icons/icon_128.png'),
      body: "You've spent " + request.timeSpent + " composing this email."
    })
    close_notification = notification.close.bind(notification);
    notification.onclick = function() {
      log_action({'positive': 'User closed Facebook.'})
      closeTab();
      close_notification();
    }
  }

});

function closeTab() {
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
    for (let tab of tabs) {
      chrome.tabs.remove(tab.id)
    }
  })
}
